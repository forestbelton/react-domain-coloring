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

        this.update();

        // pull camera back
        this.camera.position.z = 10;

        this.scene.add(this.camera);
        this.renderer.setSize(width, height);
    }

    update(image) {
        this.image = image ? THREE.ImageUtils.loadTexture( image ) : THREE.ImageUtils.generateDataTexture( 1, 1, new THREE.Color( 0xff00ff ) );
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
                    texture: { type: "t", value: this.image },
                    screenWidth:  { type: 'f', value: this.width  },
                    screenHeight: { type: 'f', value: this.height },
                    //Revisit this to see why we aren't putting in the
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

uniform sampler2D texture;
uniform float screenWidth;
uniform float screenHeight;
uniform vec2 domainX, domainY;

// vec3 darkenCorners(vec3 col) {
//     float distFromMiddle = distance(gl_FragCoord, vec2(0.5, 0.5));
//     col.rgb *= 1.7 * (0.8 - distFromMiddle);
//     return col;
// } 

vec4 domcol(vec2 z) {
    return texture2D(texture, z);
}

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
