import { CompilerLiteralNode } from '../../src/types.js'

export const schema: CompilerLiteralNode[] = [
  {
    type: 'literal',
    fieldName: 'username',
    propertyName: 'userName',
    allowNull: false,
    isOptional: false,
    bail: true,
    validations: [],
  },
  {
    type: 'literal',
    fieldName: 'email',
    propertyName: 'email',
    allowNull: false,
    isOptional: false,
    bail: true,
    validations: [],
  },
  {
    type: 'literal',
    fieldName: 'password',
    propertyName: 'password',
    allowNull: false,
    isOptional: false,
    bail: true,
    validations: [],
  },
]

export const refs = {}
