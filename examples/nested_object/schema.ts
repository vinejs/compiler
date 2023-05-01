import { CompilerLiteralNode, CompilerObjectNode } from '../../src/types.js'

export const schema: [CompilerLiteralNode, CompilerObjectNode] = [
  {
    type: 'literal',
    fieldName: 'id',
    propertyName: 'id',
    allowNull: false,
    isOptional: false,
    bail: true,
    validations: [],
  },
  {
    type: 'object',
    fieldName: 'profile',
    propertyName: 'profile',
    allowNull: false,
    isOptional: false,
    bail: true,
    validations: [],
    allowUnknownProperties: false,
    children: [
      {
        type: 'literal',
        allowNull: false,
        isOptional: true,
        bail: true,
        fieldName: 'twitter_handle',
        propertyName: 'twitterHandle',
        validations: [],
      },
      {
        type: 'literal',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: 'github_username',
        propertyName: 'githubUsername',
        validations: [],
      },
    ],
  },
]

export const refs = {}
