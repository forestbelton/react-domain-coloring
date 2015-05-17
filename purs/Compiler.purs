module Compiler (Op(..), CExpr(..), glsl) where

data Op = Add | Mul | Sub | Div

data CExpr = Var
           | Val Number Number
           | BinOp Op CExpr CExpr
           | Call String CExpr

fold :: forall a. a
    -> (Number -> Number -> a)
    -> (Op -> a -> a -> a)
    -> (String -> a -> a)
    -> CExpr
    -> a
fold x f g h Var            = x
fold x f g h (Val a b)      = f a b
fold x f g h (BinOp op l r) = g op (fold x f g h l) (fold x f g h r)
fold x f g h (Call s a)     = h s (fold x f g h a)

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

compileCallName :: String -> String
compileCallName "sin" = "cx_sin"
compileCallName "cos" = "cx_cos"

compileCall :: String -> String -> String
compileCall name arg = (compileCallName name) ++ "(" ++ arg ++ ")"

compile :: CExpr -> String
compile = fold "z" compileVal compileOp compileCall

glsl :: CExpr -> String
glsl = compile
