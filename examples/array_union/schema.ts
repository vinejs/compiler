import { RootNode } from '../../src/types.js'

export const schema: RootNode = {
  type: 'root',
  schema: {
    type: 'array',
    fieldName: '*',
    propertyName: '*',
    allowNull: false,
    isOptional: false,
    bail: true,
    validations: [],
    each: {
      fieldName: '*',
      propertyName: '*',
      type: 'union',
      conditions: [
        {
          conditionalFnRefId: 'ref://1',
          schema: {
            type: 'object',
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            groups: [],
            properties: [
              {
                type: 'literal',
                fieldName: 'phone',
                propertyName: 'phone',
                allowNull: false,
                isOptional: false,
                bail: true,
                validations: [],
              },
            ],
            fieldName: '*',
            propertyName: '*',
            isOptional: false,
            validations: [],
          },
        },
        {
          conditionalFnRefId: 'ref://2',
          schema: {
            type: 'object',
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            groups: [],
            properties: [
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
            fieldName: '*',
            propertyName: '*',
            isOptional: false,
            validations: [],
          },
        },
      ],
    },
  },
}

export const refs = {
  'ref://1': () => true,
  'ref://2': () => false,
}
