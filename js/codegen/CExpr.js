export default class CExpr {
    constructor(runFold) {
        this.runFold = runFold;
    }

    fold(x, f, g, h) {
        return this.runFold(x, f, g, h);
    }

    static Var() {
        return new CExpr((x, f, g, h) => {
            return x;
        });
    };

    static Constant(a, b) {
        return new CExpr((x, f, g, h) => {
            return f(a, b);
        });
    }

    static Add(z, w) {
        return new CExpr((x, f, g, h) => {
            return g(z.fold(x, f, g, h), w.fold(x, f, g, h));
        });
    }

    static Mul(z, w) {
        return new CExpr((x, f, g, h) => {
            return h(z.fold(x, f, g, h), w.fold(x, f, g, h));
        });
    }

    compile() {
        const [a, b] = this.fold(
            ['z.x', 'z.y'],
            (a, b) => [a.toExponential(), b.toExponential()],
            ([a, b], [c, d]) => {
                return [`${a} + ${c}`, `${b} + ${d}`];
            },
            ([a, b], [c, d]) => {
                return [`${a} * ${c} - ${b} * ${d}`, `${a} * ${d} + ${b} * ${c}`];
            }
        );

        return `vec2 f(vec2 z) { return vec2(${a}, ${b}); }`;
    }
}
