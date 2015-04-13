import THREE from './three.min.js';
import Parser from './codegen/Parser';

class SquareContext {
    constructor(width, height, func, domain) {
        const VIEW_ANGLE = 45, ASPECT = width / height, NEAR = 0.1, FAR = 10000;

        this.renderer = new THREE.WebGLRenderer();
        this.scene    = new THREE.Scene();
        this.camera   = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

        // pull camera back
        this.camera.position.z = 10;

        // compute square width/height to fit perfectly in view frustum
        const squareHeight = 2 * Math.tan(this.camera.fov / 2) * 150,
            squareWidth  = squareHeight * this.camera.aspect;

        // compile expression to GLSL function
        const compiled = Parser.parse(func).value.compile();

        // set up square with the proper coloring
        this.square = new THREE.Mesh(
            new THREE.PlaneGeometry(squareWidth, squareHeight),
            new THREE.ShaderMaterial({
                uniforms: {
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

// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// http://nbviewer.ipython.org/github/empet/Math/blob/master/DomainColoring.ipynb
// H = (arg(z) / 2π + 1) mod 1
// S = 1
// V = (1 - 1/(|z|^2))^0.2
vec4 domcol(vec2 z) {
    float hue = mod(atan(z.y, z.x) / (2.0 * PI) + 1.0, 1.0);

    float modz = length(z);
    float val  = pow(1.0 - 1.0 / (1.0 + modz * modz), 0.2);

    vec3 hsv = vec3(hue, 1.0, val);
    return vec4(hsv2rgb(hsv), 1.0);
}

uniform vec2 domainX;
uniform vec2 domainY;

float scale(float t, float start, float end) {
    return t * end + (1.0 - t) * start;
}

void main() {
    vec2 z = vec2(
        scale(gl_FragCoord.x, domainX.x, domainX.y),
        scale(gl_FragCoord.y, domainY.x, domainY.y)
    );

    gl_FragColor = domcol(f(z));
}`
            })
        );

        this.scene.add(this.square);
        this.scene.add(this.camera);

        this.renderer.setSize(width, height);
    }

    getDOMNode() {
        return this.renderer.domElement;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

module.exports = SquareContext
