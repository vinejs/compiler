import { CompilerRootNode } from '../../src/types.js'

export const schema: CompilerRootNode = {
  type: 'root',
  schema: {
    type: 'object',
    fieldName: '*',
    propertyName: '*',
    allowNull: false,
    isOptional: false,
    allowUnknownProperties: false,
    bail: true,
    children: [
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
    ],
    groups: [],
    validations: [],
  },
}

export const refs = {}
