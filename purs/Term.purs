module Term (Op(..), Term(..), foldTerm) where

data Op = Add | Sub | Mul | Div | Pow

-- An expression type for a single component in a complex number
--
-- IPart and RPart are the real and imaginary parts of the complex variable,
-- respectively
data Term = RPart
          | IPart
          | Constant Number
          | BinOp Op Term Term
          | Call String Term

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
    -> (String -> a -> a)
    -> Term
    -> a
foldTerm x y f g h RPart          = x
foldTerm x y f g h IPart          = y
foldTerm x y f g h (Constant n)   = f n
foldTerm x y f g h (BinOp op l r) = g op (foldTerm x y f g h l) (foldTerm x y f g h r)
foldTerm x y f g h (Call n t)     = h n (foldTerm x y f g h t)
