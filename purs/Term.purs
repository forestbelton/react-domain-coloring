module Term (Op(..), Term(..), foldTerm) where

data Op = Add | Sub | Mul | Div

-- An expression type for a single component in a complex number
--
-- IPart and RPart are the real and imaginary parts of the complex variable,
-- respectively
data Term = RPart
          | IPart
          | Constant Number
          | BinOp Op Term Term

instance semiringTerm :: Semiring Term where
    zero = Constant 0
    one  = Constant 1
    (+)  = BinOp Add
    (*)  = BinOp Mul

instance ringTerm :: Ring Term where
    (-) = BinOp Sub

instance moduloSemiringTerm :: ModuloSemiring Term where
    mod x y = Constant 0 -- stub
    (/)     = BinOp Div

foldTerm :: forall a. a
    -> a
    -> (Number -> a)
    -> (Op -> a -> a -> a)
    -> Term
    -> a
foldTerm x y f g RPart          = x
foldTerm x y f g IPart          = y
foldTerm x y f g (Constant n)   = f n
foldTerm x y f g (BinOp op l r) = g op (foldTerm x y f g l) (foldTerm x y f g r)

