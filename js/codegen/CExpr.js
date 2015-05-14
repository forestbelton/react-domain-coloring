export default class CExpr {
    constructor(fold) {
        this.fold = fold;
    }

    static Var() {
        return new CExpr((x, f, g, h, i) => {
            return x;
        });
    };

    static Constant(a, b) {
        return new CExpr((x, f, g, h, i) => {
            return f(a, b);
        });
    }

    static Add(z, w) {
        return new CExpr((x, f, g, h, i) => {
            return g(z.fold(x, f, g, h, i), w.fold(x, f, g, h, i));
        });
    }

    static Mul(z, w) {
        return new CExpr((x, f, g, h, i) => {
            return h(z.fold(x, f, g, h, i), w.fold(x, f, g, h, i));
        });
    }

    static Pow(z, n) {
        return new CExpr((x, f, g, h, i) => {
            return i(z.fold(x, f, g, h, i), n);
        });
    }

    compile() {
	const mul = ([a, b], [c, d]) => 
            [`${a} * ${c} - ${b} * ${d}`, `${a} * ${d} + ${b} * ${c}`];	

        const [a, b] = this.fold(
            ['z.x', 'z.y'],
            (a, b) => [a.toExponential(), b.toExponential()],
            ([a, b], [c, d]) => {
                return [`${a} + ${c}`, `${b} + ${d}`];
            },
            (z, w) => {
                return mul(z, w);
            },
	    (z, n) => {
                var acc = ['1.0', '0.0'];

                for(var i = 0; i < n; ++i) {
                    acc = mul(z, acc);
                }

                return acc;                
            }
        );

        return `vec2 f(vec2 z) { return vec2(${a}, ${b}); }`;
    }
}
