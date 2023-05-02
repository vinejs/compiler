/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Compiler } from '../../../src/compiler/main.js'
import { ErrorReporterFactory } from '../../../factories/error_reporter.js'

test.group('Union node', () => {
  test('create a union of literal values', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'union',
        fieldName: 'uid',
        propertyName: 'uid',
        children: [
          {
            conditionalFnRefId: 'ref://1',
            schema: {
              type: 'literal',
              bail: true,
              fieldName: 'uid',
              propertyName: 'uid',
              allowNull: false,
              isOptional: false,
              validations: [
                {
                  implicit: false,
                  isAsync: false,
                  ruleFnId: 'ref://3',
                },
              ],
            },
          },
          {
            conditionalFnRefId: 'ref://2',
            schema: {
              type: 'literal',
              bail: true,
              fieldName: 'uid',
              propertyName: 'uid',
              allowNull: false,
              isOptional: false,
              validations: [],
            },
          },
        ],
      },
    ])

    const data = { uid: 'virk' }
    const meta = {}

    const refs = {
      'ref://1': () => false,
      'ref://2': () => true,
      'ref://3': {
        validator() {
          throw new Error('Never expected to be called')
        },
      },
    }

    const errorReporter = new ErrorReporterFactory().create()
    const fn = compiler.compile()
    assert.deepEqual(await fn(data, meta, refs, errorReporter), { uid: 'virk' })
  })

  test('create a union of objects', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'union',
        fieldName: 'profile',
        propertyName: 'profile',
        children: [
          {
            conditionalFnRefId: 'ref://1',
            schema: {
              type: 'object',
              groups: [],
              bail: true,
              fieldName: 'profile',
              validations: [],
              propertyName: 'profile',
              allowNull: false,
              isOptional: false,
              allowUnknownProperties: false,
              children: [
                {
                  type: 'literal',
                  bail: true,
                  fieldName: 'username',
                  allowNull: false,
                  isOptional: false,
                  propertyName: 'userName',
                  validations: [],
                },
                {
                  type: 'literal',
                  bail: true,
                  fieldName: 'age',
                  allowNull: false,
                  isOptional: false,
                  propertyName: 'age',
                  validations: [],
                },
              ],
            },
          },
          {
            conditionalFnRefId: 'ref://2',
            schema: {
              type: 'object',
              groups: [],
              bail: true,
              fieldName: 'profile',
              validations: [],
              propertyName: 'profile',
              allowNull: false,
              isOptional: false,
              allowUnknownProperties: false,
              children: [
                {
                  type: 'literal',
                  bail: true,
                  fieldName: 'email',
                  allowNull: false,
                  isOptional: false,
                  propertyName: 'email',
                  validations: [],
                },
              ],
            },
          },
        ],
      },
    ])

    const data = { profile: { email: 'foo@bar.com' } }
    const meta = {}

    const refs = {
      'ref://1': () => false,
      'ref://2': () => true,
    }

    const errorReporter = new ErrorReporterFactory().create()
    const fn = compiler.compile()
    assert.deepEqual(await fn(data, meta, refs, errorReporter), {
      profile: { email: 'foo@bar.com' },
    })
  })

  test('create a union of arrays', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'union',
        fieldName: 'contacts',
        propertyName: 'contacts',
        children: [
          {
            conditionalFnRefId: 'ref://1',
            schema: {
              type: 'array',
              bail: true,
              fieldName: 'contacts',
              validations: [],
              propertyName: 'contacts',
              allowNull: false,
              isOptional: false,
              allowUnknownProperties: false,
              each: {
                type: 'object',
                groups: [],
                allowNull: false,
                allowUnknownProperties: false,
                bail: false,
                fieldName: 'contacts',
                isOptional: false,
                propertyName: 'contacts',
                validations: [],
                children: [
                  {
                    type: 'literal',
                    bail: true,
                    fieldName: 'email',
                    allowNull: false,
                    isOptional: false,
                    propertyName: 'email',
                    validations: [],
                  },
                ],
              },
            },
          },
          {
            conditionalFnRefId: 'ref://2',
            schema: {
              type: 'array',
              bail: true,
              fieldName: 'contacts',
              validations: [],
              propertyName: 'contacts',
              allowNull: false,
              isOptional: false,
              allowUnknownProperties: false,
              each: {
                type: 'object',
                groups: [],
                allowNull: false,
                allowUnknownProperties: false,
                bail: false,
                fieldName: 'contacts',
                isOptional: false,
                propertyName: 'contacts',
                validations: [],
                children: [
                  {
                    type: 'literal',
                    bail: true,
                    fieldName: 'phone',
                    allowNull: false,
                    isOptional: false,
                    propertyName: 'phone',
                    validations: [],
                  },
                ],
              },
            },
          },
        ],
      },
    ])

    const data = { contacts: [{ phone: '123456789' }] }
    const meta = {}

    const refs = {
      'ref://1': () => false,
      'ref://2': () => true,
    }

    const errorReporter = new ErrorReporterFactory().create()
    const fn = compiler.compile()
    assert.deepEqual(await fn(data, meta, refs, errorReporter), {
      contacts: [{ phone: '123456789' }],
    })
  })

  test('create a union of unions', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'union',
        fieldName: 'account',
        propertyName: 'account',
        children: [
          {
            conditionalFnRefId: 'ref://1',
            schema: {
              type: 'union',
              fieldName: 'account',
              propertyName: 'account',
              children: [
                {
                  conditionalFnRefId: 'ref://3',
                  schema: {
                    type: 'object',
                    groups: [],
                    allowNull: false,
                    allowUnknownProperties: false,
                    bail: true,
                    validations: [],
                    fieldName: 'account',
                    propertyName: 'account',
                    isOptional: false,
                    children: [
                      {
                        type: 'literal',
                        fieldName: 'twitter_handle',
                        allowNull: false,
                        isOptional: false,
                        bail: true,
                        propertyName: 'twitter_handle',
                        validations: [],
                      },
                    ],
                  },
                },
                {
                  conditionalFnRefId: 'ref://4',
                  schema: {
                    type: 'object',
                    groups: [],
                    allowNull: false,
                    allowUnknownProperties: false,
                    bail: true,
                    validations: [],
                    fieldName: 'account',
                    propertyName: 'account',
                    isOptional: false,
                    children: [
                      {
                        type: 'literal',
                        fieldName: 'github_username',
                        allowNull: false,
                        isOptional: false,
                        bail: true,
                        propertyName: 'github_username',
                        validations: [],
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            conditionalFnRefId: 'ref://2',
            schema: {
              type: 'union',
              fieldName: 'account',
              propertyName: 'account',
              children: [
                {
                  conditionalFnRefId: 'ref://5',
                  schema: {
                    type: 'object',
                    groups: [],
                    allowNull: false,
                    allowUnknownProperties: false,
                    bail: true,
                    validations: [],
                    fieldName: 'account',
                    propertyName: 'account',
                    isOptional: false,
                    children: [
                      {
                        type: 'literal',
                        fieldName: 'email',
                        allowNull: false,
                        isOptional: false,
                        bail: true,
                        propertyName: 'email',
                        validations: [],
                      },
                    ],
                  },
                },
                {
                  conditionalFnRefId: 'ref://6',
                  schema: {
                    type: 'object',
                    groups: [],
                    allowNull: false,
                    allowUnknownProperties: false,
                    bail: true,
                    validations: [],
                    fieldName: 'account',
                    propertyName: 'account',
                    isOptional: false,
                    children: [
                      {
                        type: 'literal',
                        fieldName: 'phone',
                        allowNull: false,
                        isOptional: false,
                        bail: true,
                        propertyName: 'phone',
                        validations: [],
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    ])

    const data = {
      account: {
        email: 'foo@bar.com',
      },
    }
    const meta = {}

    const refs = {
      'ref://1': () => false,
      'ref://2': () => true,
      'ref://3': () => false,
      'ref://4': () => false,
      'ref://5': () => true,
      'ref://6': () => false,
    }

    const errorReporter = new ErrorReporterFactory().create()
    const fn = compiler.compile()
    assert.deepEqual(await fn(data, meta, refs, errorReporter), {
      account: {
        email: 'foo@bar.com',
      },
    })
  })

  test('create a union of records', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'union',
        fieldName: 'colors',
        propertyName: 'colors',
        children: [
          {
            conditionalFnRefId: 'ref://1',
            schema: {
              type: 'record',
              bail: true,
              fieldName: 'colors',
              validations: [],
              propertyName: 'colors',
              allowNull: false,
              isOptional: false,
              each: {
                type: 'literal',
                bail: true,
                fieldName: '*',
                allowNull: false,
                isOptional: false,
                propertyName: '*',
                validations: [],
              },
            },
          },
          {
            conditionalFnRefId: 'ref://2',
            schema: {
              type: 'record',
              bail: true,
              fieldName: 'colors',
              validations: [],
              propertyName: 'colors',
              allowNull: false,
              isOptional: false,
              each: {
                type: 'literal',
                bail: true,
                fieldName: '*',
                allowNull: false,
                isOptional: false,
                propertyName: '*',
                validations: [],
                transformFnId: 'ref://3',
              },
            },
          },
        ],
      },
    ])

    const data = { colors: { white: '#ffffff', black: '#000000' } }
    const meta = {}

    const refs = {
      'ref://1': () => false,
      'ref://2': () => true,
      'ref://3': (hex: string) => {
        const r = Number.parseInt(hex.slice(1, 3), 16)
        const g = Number.parseInt(hex.slice(3, 5), 16)
        const b = Number.parseInt(hex.slice(5, 7), 16)
        return { r, g, b }
      },
    }

    const errorReporter = new ErrorReporterFactory().create()
    const fn = compiler.compile()
    assert.deepEqual(await fn(data, meta, refs, errorReporter), {
      colors: { white: { r: 255, g: 255, b: 255 }, black: { r: 0, g: 0, b: 0 } },
    })
  })
})
