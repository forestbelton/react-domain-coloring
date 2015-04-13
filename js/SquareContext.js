import THREE from './three.min.js';
import Parser from './codegen/Parser';

class SquareContext {
    constructor(width, height) {
        const VIEW_ANGLE = 45, ASPECT = width / height, NEAR = 0.1, FAR = 10000;

        this.width  = width;
        this.height = height;

        this.renderer = new THREE.WebGLRenderer();
        this.scene    = new THREE.Scene();
        this.camera   = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

        // pull camera back
        this.camera.position.z = 10;

        this.scene.add(this.camera);
        this.renderer.setSize(width, height);
    }

    // TODO: When the input changes, only update material instead of recreating
    // the square
    draw(func, domain) {
        // compile expression to GLSL function
        const parseResult = Parser.parse(func);
        if(parseResult.status == false) {
            throw new Error('Parse error');
        }
        const compiled = parseResult.value.compile();

        if(this.square) {
            this.scene.remove(this.square);
        }

        // compute square width/height to fit perfectly in view frustum
        const squareHeight = 2 * Math.tan(this.camera.fov / 2) * 150,
            squareWidth  = squareHeight * this.camera.aspect;

        // set up square with the proper coloring
        this.square = new THREE.Mesh(
            new THREE.PlaneGeometry(squareWidth, squareHeight),
            new THREE.ShaderMaterial({
                uniforms: {
                    screenWidth:  { type: 'f', value: this.width  },
                    screenHeight: { type: 'f', value: this.height },
                    domainX: { type: 'v2', value: new THREE.Vector2(domain.x[0], domain.x[1]) },
                    domainY: { type: 'v2', value: new THREE.Vector2(domain.y[0], domain.y[1]) }
                },
                vertexShader: `
void main() {
    gl_Position = projectionMatrix
        * modelViewMatrix
        * vec4(position, 1.0);
}`,
                fragmentShader: `
${compiled}

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

float scale(float t, float start, float end) {
    return (1.0 - t) * start + t * end;
}

void main() {
    vec2 z = vec2(
        scale(gl_FragCoord.x / screenWidth, domainX.x, domainX.y),
        scale(gl_FragCoord.y / screenHeight, domainY.x, domainY.y)
    );

    gl_FragColor = domcol(f(z));
}`
            })
        );

        this.scene.add(this.square);
    }

    getDOMNode() {
        return this.renderer.domElement;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

module.exports = SquareContext
