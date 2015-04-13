import SquareContext from './SquareContext';

var sc = new SquareContext(500, 500);
document.body.appendChild(sc.getDOMNode());
sc.render();

import CExpr from './CExpr';
window.CExpr = CExpr;