import { CompilerArrayNode } from '../../src/types.js'

export const schema: [CompilerArrayNode] = [
  {
    type: 'array',
    fieldName: 'contacts',
    propertyName: 'contacts',
    allowNull: false,
    isOptional: false,
    bail: true,
    validations: [],
    allowUnknownProperties: false,
    each: {
      type: 'union',
      children: [
        {
          conditionalFnRefId: 'ref://1',
          schema: {
            type: 'object',
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            children: [
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
            fieldName: '*',
            propertyName: '*',
            isOptional: false,
            validations: [],
          },
        },
      ],
    },
  },
]

export const refs = {
  'ref://1': () => true,
  'ref://2': () => false,
}
