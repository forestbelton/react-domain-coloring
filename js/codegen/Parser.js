import P from 'parsimmon';

import Complex from '../../purs/Complex.purs';

var ws = P.regex(/[ \r\t\n]*/);

function token(str) {
    return P.string(str).skip(ws);
}

var term = P.lazy(() =>
    P.alt(
        token('z').result(Complex.variable),
        token('i').result(Complex.complex(0)(1)),
        token('e').result(Complex.complex(Math.E)(0)),
        P.seq(
            P.regex(/[a-z]+/),
            token('(').then(add_expr).skip(token(')'))
        ).map(([name, expr]) => Complex.cCall(name)(expr)),
        token('(').then(add_expr).skip(token(')')),
        P.regex(/-?[0-9][0-9]*(\.[0-9]+)?/).skip(ws)
            .map((n) => Complex.complex(parseFloat(n))(0))
    )
);

function binop(o, l, r) {
    switch(o) {
        case '+': return Complex.cAdd(l)(r);
        case '-': return Complex.cSub(l)(r);
        case '*': return Complex.cMul(l)(r);
        case '/': return Complex.cDiv(l)(r);
        case '^': return Complex.cPow(l)(r);
    }
}

function lassoc(l, r) {
    if(l.length == 0) {
        return r;
    }

    const x = l.pop(), [t, o] = x;
    return binop(o, lassoc(l, t), r);
}

var chainl1 = function(op, p) {
    return P.seq(
        P.seq(p, op).many(),
        p
    ).map(([l, r]) => lassoc(l, r));
};

function rassoc(l, r) {
    if(r.length == 0) {
        return l;
    }

    const x = r.shift(), [o, t] = x;
    return binop(o, l, rassoc(t, r));
}

function chainr1(op, p) {
    return P.seq(
        p,
        P.seq(op, p).many()
    ).map(([l, r]) => rassoc(l, r));
}

var pow_expr = chainr1(token('^'), term),
    mul_expr = chainl1(token('*').or(token('/')), pow_expr),
    add_expr = chainl1(token('+').or(token('-')), mul_expr);

export default ws.then(add_expr).skip(ws);
