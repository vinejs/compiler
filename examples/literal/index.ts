import { Compiler } from '../../src/compiler/main.js'
import { beautifyCode } from '../../factories/code_beautifier.js'
import type { CompilerValidationNode, CompilerLiteralNode } from '../../src/types.js'

const validations: CompilerValidationNode[] = [
  {
    implicit: false,
    isAsync: false,
    ruleFnId: 'ref://6',
  },
  {
    implicit: true,
    isAsync: false,
    ruleFnId: 'ref://7',
  },
  {
    implicit: true,
    isAsync: true,
    ruleFnId: 'ref://8',
  },
]

const standardNode: CompilerLiteralNode = {
  type: 'literal',
  allowNull: false,
  isOptional: false,
  bail: false,
  fieldName: 'user_name',
  propertyName: 'userName',
  validations: validations,
  parseFnId: 'ref://1',
}

const optionalNode: CompilerLiteralNode = {
  type: 'literal',
  allowNull: false,
  isOptional: true,
  bail: true,
  fieldName: 'user_name',
  propertyName: 'userName',
  validations: validations,
  transformFnId: 'ref://2',
}

const nullableNode: CompilerLiteralNode = {
  type: 'literal',
  allowNull: true,
  isOptional: false,
  bail: false,
  fieldName: 'user_name',
  propertyName: 'userName',
  validations: validations,
  parseFnId: 'ref://3',
  transformFnId: 'ref://4',
}

const nullAndOptionalNode: CompilerLiteralNode = {
  type: 'literal',
  allowNull: true,
  isOptional: true,
  bail: true,
  fieldName: 'user_name',
  propertyName: 'userName',
  validations: validations,
  parseFnId: 'ref://5',
}

const compiler = new Compiler([standardNode, optionalNode, nullAndOptionalNode, nullableNode])
compiler.compile()

console.log(beautifyCode(compiler.compile().toString()).toString())
