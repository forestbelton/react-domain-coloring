export default class CExpr {
    constructor(runFold) {
        this.runFold = runFold;
    }

    fold(x, f, g, h, i, j) {
        return this.runFold(x, f, g, h, i, j);
    }

    static Var() {
        return new CExpr((x, f, g, h, i, j) => {
            return x;
        });
    };

    static Constant(a, b) {
        return new CExpr((x, f, g, h, i, j) => {
            return f(a, b);
        });
    }

    static Add(z, w) {
        return new CExpr((x, f, g, h, i, j) => {
            return g(z.fold(x, f, g, h, i, j), w.fold(x, f, g, h, i, j));
        });
    }

    static Mul(z, w) {
        return new CExpr((x, f, g, h, i, j) => {
            return h(z.fold(x, f, g, h, i, j), w.fold(x, f, g, h, i, j));
        });
    }

    static Sub(z, w) {
        return new CExpr((x, f, g, h, i, j) => {
            return i(z.fold(x, f, g, h, i, j), w.fold(x, f, g, h, i, j));
        });
    }

    static Div(z, w) {
        return new CExpr((x, f, g, h, i, j) => {
            return j(z.fold(x, f, g, h, i, j), w.fold(x, f, g, h, i, j));
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
            },
            ([a, b], [c, d]) => {
                return [`${a} - ${c}`, `${b} - ${d}`];
            },
            ([a, b], [c, d]) => {
                return [`${a} * ${c} + ${b} * ${d} / ${c} * ${c} + ${d} * ${d}`, `${b} * ${c} - ${a} * ${d} / ${c} * ${c} + ${d} * ${d}`];
            }
        );

        return `vec2 f(vec2 z) { return vec2(${a}, ${b}); }`;
    }
}
