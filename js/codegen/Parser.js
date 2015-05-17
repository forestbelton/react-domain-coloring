import P from 'parsimmon';

import Compiler from '../../purs/Compiler.purs';

var ws = P.regex(/[ \r\t\n]*/);

function token(str) {
    return P.string(str).skip(ws);
}

var term = P.lazy(() =>
    P.alt(
        token('z').result(new Compiler.Var),
        token('i').result(new Compiler.Val(0, 1)),
        token('(').then(add_expr).skip(token(')')),
        P.regex(/-?[0-9][0-9]*(\.[0-9]+)?/).skip(ws)
            .map((n) => new Compiler.Val(parseFloat(n), 0))
    )
);

function binop(o, l, r) {
    switch(o) {
        case '+': return new Compiler.BinOp(new Compiler.Add, l, r);
        case '-': return new Compiler.BinOp(new Compiler.Sub, l, r);
        case '*': return new Compiler.BinOp(new Compiler.Mul, l, r);
        case '/': return new Compiler.BinOp(new Compiler.Div, l, r);
        //        case '^': return CExpr.Pow(l, r);
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

    const x = r.shift(), [t, o] = x;
    return binop(o, l, rassoc(t, r));
}

function chainr1(op, p) {
    return P.seq(
        p,
        P.seq(op, p).many()
    ).map(([l, r]) => rassoc(l, r));
}

var pow_expr = P.alt(
    P.seq(
        term,
        token('^'),
        P.regex(/[0-9]+/)
    ).map(([l, op, r]) => binop(op, l, parseInt(r, 10))),
    term
);

var mul_expr = chainl1(token('*').or(token('/')), pow_expr),
    add_expr = chainl1(token('+').or(token('-')), mul_expr);

export default ws.then(add_expr).skip(ws);
