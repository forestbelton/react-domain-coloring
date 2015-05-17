import THREE from './three.min.js';
import Parser from './codegen/Parser';
import Compiler from '../purs/Compiler.purs';

export default class SquareContext {
    constructor(options) {
        const VIEW_ANGLE = 45,
              ASPECT = options.width / options.height,
              NEAR = 0.1,
              FAR = 10000;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(options.width, options.height);

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera.position.z = 10;
        this.scene.add(this.camera);

        // compute square width/height to fit perfectly in view frustum
        const squareHeight = 2 * Math.tan(this.camera.fov / 2) * 150,
              squareWidth  = squareHeight * this.camera.aspect;

        // set up square with the proper coloring
        this.square = new THREE.Mesh(
            new THREE.PlaneGeometry(squareWidth, squareHeight),
            new THREE.ShaderMaterial({
                uniforms: {
                    screenWidth:  { type: 'f', value: options.width  },
                    screenHeight: { type: 'f', value: options.height },
                    domainX: { type: 'v2', value: new THREE.Vector2(options.domain.x[0], options.domain.x[1]) },
                    domainY: { type: 'v2', value: new THREE.Vector2(options.domain.y[0], options.domain.y[1]) }
                },
                vertexShader: `
                void main() {
                    gl_Position = projectionMatrix
                        * modelViewMatrix
                        * vec4(position, 1.0);

                }`,
                fragmentShader: this.buildFragmentShader(options.func)
            })
        );

        this.scene.add(this.square);
    }

    setSize(width, height) {
        this.square.material.uniforms.screenWidth.value  = width;
        this.square.material.uniforms.screenHeight.value = height;

        this.renderer.setSize(width, height);
    }

    setDomain(domain) {
        this.square.material.uniforms.domainX.value = new THREE.Vector2(
            domain.x[0],
            domain.x[1]
        );

        this.square.material.uniforms.domainY.value = new THREE.Vector2(
            domain.y[0],
            domain.y[1]
        );
    }

    setFunc(func) {
        this.square.material.fragmentShader = this.buildFragmentShader(func);
        this.square.material.needsUpdate = true;
    }

    buildFragmentShader(func) {
        // compile expression to GLSL function
        const parseResult = Parser.parse(func);
        if(parseResult.status == false) {
            throw new Error('Parse error');
        }

        const compiled = Compiler.compile(parseResult.value);

        return `
float sinh(float x) {
    return (1.0 - exp(-2.0 * x)) / (2.0 * exp(-x));
}

float cosh(float x) {
    return (1.0 + exp(-2.0 * x)) / (2.0 * exp(-x));
}

vec2 cx_sin(vec2 z) {
    return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));
}

vec2 cx_cos(vec2 z) {
    return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y));
}

vec2 f(vec2 z) {
    return ${compiled};
}

#define PI 3.14159265358979323846
#define cx_arg(z) atan(z.y, z.x)
#define cx_abs(z) length(z)

// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 domcol(vec2 z) {
/* Alternative coloring, found at
 * http://mathematica.stackexchange.com/a/7359
 */
    float h = 0.5 + cx_arg(z) / (2.0 * PI);
    float s = abs(sin(2.0 * PI * cx_abs(z)));

    float b  = abs(sin(2.0 * PI * z.y)) * pow(sin(2.0 * PI * z.x), 0.25);
    float b2 = 0.5 * ((1.0 - s) + b + sqrt((1.0 - s - b) * (1.0 - s - b) + 0.01));

    vec3 hsv = vec3(h, sqrt(s), b2);
    return vec4(hsv2rgb(hsv), 1.0);
}

uniform float screenWidth;
uniform float screenHeight;
uniform vec2 domainX, domainY;

void main() {
    vec2 z = vec2(
        mix(domainX.x, domainX.y, gl_FragCoord.x / screenWidth),
        mix(domainY.x, domainY.y, gl_FragCoord.y / screenHeight)
    );

    gl_FragColor = domcol(f(z));
}`;
    }

    getDOMNode() {
        return this.renderer.domElement;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
};
