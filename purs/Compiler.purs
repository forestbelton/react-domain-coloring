module Compiler (Op(..), CExpr(..), glsl) where

data Op = Add | Mul | Sub | Div

data CExpr = Var
           | Val Number Number
           | BinOp Op CExpr CExpr

fold :: forall a. a
    -> (Number -> Number -> a)
    -> (Op -> a -> a -> a)
    -> CExpr
    -> a
fold x f g Var            = x
fold x f g (Val a b)      = f a b
fold x f g (BinOp op l r) = g op (fold x f g l) (fold x f g r)

-- compilation to GLSL
compileVal :: Number -> Number -> String
compileVal x y = "vec2(" ++ show x ++ "," ++ show y ++ ")"

compileOpName :: Op -> String
compileOpName Add = "cx_add"
compileOpName Mul = "cx_mul"
compileOpName Sub = "cx_sub"
compileOpName Div = "cx_div"

compileOp :: Op -> String -> String -> String
compileOp op l r = (compileOpName op) ++ "(" ++ l ++ "," ++ r ++ ")"

compile :: CExpr -> String
compile = fold "z" compileVal compileOp

glsl :: CExpr -> String
glsl = compile
