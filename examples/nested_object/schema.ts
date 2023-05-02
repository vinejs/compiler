import { CompilerRootNode } from '../../src/types.js'

export const schema: CompilerRootNode = {
  type: 'root',
  schema: {
    type: 'object',
    allowNull: false,
    isOptional: false,
    fieldName: '*',
    propertyName: '*',
    allowUnknownProperties: false,
    bail: true,
    children: [
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
        groups: [],
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
    ],
    groups: [],
    validations: [],
  },
}
export const refs = {}
