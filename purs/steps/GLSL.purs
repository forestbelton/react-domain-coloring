module Steps.GLSL (glsl) where

import Complex
import Term

glslOpName :: Op -> String
glslOpName Add = "+"
glslOpName Sub = "-"
glslOpName Mul = "*"
glslOpName Div = "/"

glslOp :: Op -> String -> String -> String
glslOp op l r = "(" ++ l ++ glslOpName op ++ r ++ ")"

foreign import toExponential
"""
function toExponential(x) {
    return x.toExponential();
}
""" :: Number -> String

glsl :: Complex Term -> String
glsl term = case foldComplex "z.x" "z.y" toExponential glslOp term of
    Complex a b -> "vec2(" ++ a ++ "," ++ b ++ ")"

