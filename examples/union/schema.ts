import { CompilerLiteralNode, CompilerUnionNode } from '../../src/types.js'

export const schema: [CompilerLiteralNode, CompilerUnionNode] = [
  {
    type: 'literal',
    fieldName: 'password',
    propertyName: 'password',
    allowNull: false,
    isOptional: false,
    bail: true,
    validations: [],
  },
  {
    type: 'union',
    children: [
      {
        conditionalFnRefId: 'ref://1',
        schema: {
          type: 'literal',
          fieldName: 'email',
          propertyName: 'email',
          allowNull: false,
          isOptional: false,
          bail: true,
          validations: [],
        },
      },
      {
        conditionalFnRefId: 'ref://2',
        schema: {
          type: 'literal',
          fieldName: 'username',
          propertyName: 'username',
          allowNull: false,
          isOptional: false,
          bail: true,
          validations: [],
        },
      },
    ],
  },
]

export const refs = {
  'ref://1': () => true,
  'ref://2': () => false,
}
