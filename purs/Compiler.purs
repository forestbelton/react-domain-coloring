module Compiler (compile) where

import Complex
import Term

import Steps.GLSL

compile :: Complex Term -> String
compile = glsl
