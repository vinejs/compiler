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
    validations: [],
    groups: [
      {
        type: 'group',
        conditions: [
          {
            conditionalFnRefId: 'ref://1',
            schema: {
              type: 'sub_object',
              children: [
                {
                  type: 'literal',
                  fieldName: 'email',
                  propertyName: 'email',
                  allowNull: false,
                  isOptional: false,
                  bail: true,
                  validations: [],
                },
              ],
            },
          },
          {
            conditionalFnRefId: 'ref://2',
            schema: {
              type: 'sub_object',
              children: [
                {
                  type: 'literal',
                  fieldName: 'username',
                  propertyName: 'username',
                  allowNull: false,
                  isOptional: false,
                  bail: true,
                  validations: [],
                },
              ],
            },
          },
        ],
      },
    ],
    children: [
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
  },
}

export const refs = {
  'ref://1': () => true,
  'ref://2': () => false,
}
