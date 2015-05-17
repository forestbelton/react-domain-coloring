module Complex (Complex(..), foldComplex, cAdd, cSub, cMul, cDiv, complex, variable) where

import Term

data Complex a = Complex a a

cAdd :: Complex Term -> Complex Term -> Complex Term
cAdd (Complex a b) (Complex c d) = Complex (a + c) (b + d)

cSub :: Complex Term -> Complex Term -> Complex Term
cSub (Complex a b) (Complex c d) = Complex (a - c) (b - d)

cMul :: Complex Term -> Complex Term -> Complex Term
cMul (Complex a b) (Complex c d) = Complex (a * c - b * d) (b * c + a * d)

cDiv :: Complex Term -> Complex Term -> Complex Term
cDiv (Complex a b) (Complex c d) = Complex ((a * c + b * d) / denom) ((b * c - a * d) / denom)
    where denom = c * c + d * d

complex :: Number -> Number -> Complex Term
complex x y = Complex (Constant x) (Constant y)

variable :: Complex Term
variable = Complex RPart IPart

foldComplex :: forall a. a
    -> a
    -> (Number -> a)
    -> (Op -> a -> a -> a)
    -> Complex Term
    -> Complex a
foldComplex x y f g (Complex a b) = Complex (foldTerm x y f g a) (foldTerm x y f g b)
