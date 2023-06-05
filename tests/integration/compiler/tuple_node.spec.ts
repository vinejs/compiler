/*
 * @adonisjs/validator
 *
 * (c) Validator
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { refsBuilder } from '../../../index.js'
import { ValidationRule } from '../../../src/types.js'
import { Compiler } from '../../../src/compiler/main.js'
import { ErrorReporterFactory } from '../../../factories/error_reporter.js'
import { MessagesProviderFactory } from '../../../factories/messages_provider.js'

test.group('Tuple node', () => {
  test('process children nodes', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = ['hello world', 'hi world']
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, ['hello world', 'hi world'])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, ['hello world', 'hi world'])
  })

  test('dis-allow undefined value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = undefined
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is required'])
    }
  })

  test('dis-allow null value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = null
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is required'])
    }
  })

  test('dis-allow non-array values', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = 'hello world'
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is not a valid array'])
    }
  })

  test('ignore additional array items', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '',
        validations: [],
        propertyName: '',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
        ],
      },
    })

    const data = ['hello world', 'hi world']
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, ['hello world'])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, ['hello world'])
  })

  test('keep additional array items when unknown properties are allowed', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: true,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
        ],
      },
    })

    const data = ['hello world', 'hi world']
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, ['hello world', 'hi world'])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, ['hello world', 'hi world'])
  })

  test('process nested children nodes', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'tuple',
            bail: true,
            fieldName: '0',
            validations: [],
            propertyName: '0',
            allowNull: false,
            isOptional: false,
            allowUnknownProperties: false,
            properties: [
              {
                type: 'literal',
                bail: true,
                fieldName: '0',
                allowNull: false,
                isOptional: false,
                propertyName: '0',
                validations: [],
              },
              {
                type: 'literal',
                bail: true,
                fieldName: '1',
                allowNull: false,
                isOptional: false,
                propertyName: '1',
                validations: [],
              },
            ],
          },
          {
            type: 'tuple',
            bail: true,
            fieldName: '1',
            validations: [],
            propertyName: '1',
            allowNull: false,
            isOptional: false,
            allowUnknownProperties: false,
            properties: [
              {
                type: 'literal',
                bail: true,
                fieldName: '0',
                allowNull: false,
                isOptional: false,
                propertyName: '0',
                validations: [],
              },
              {
                type: 'literal',
                bail: true,
                fieldName: '1',
                allowNull: false,
                isOptional: false,
                propertyName: '1',
                validations: [],
              },
            ],
          },
        ],
      },
    })

    const data = [
      ['hello world', 'hi world'],
      ['hi world', 'hello world'],
    ]
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, [
      ['hello world', 'hi world'],
      ['hi world', 'hello world'],
    ])

    // Mutation test
    data[0][0] = 'foo'
    assert.deepEqual(output, [
      ['hello world', 'hi world'],
      ['hi world', 'hello world'],
    ])
  })

  test('allow unknown properties in nested tuple', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: true,
        properties: [
          {
            type: 'tuple',
            bail: true,
            fieldName: '0',
            validations: [],
            propertyName: '0',
            allowNull: false,
            isOptional: false,
            allowUnknownProperties: true,
            properties: [
              {
                type: 'literal',
                bail: true,
                fieldName: '0',
                allowNull: false,
                isOptional: false,
                propertyName: '0',
                validations: [],
              },
              {
                type: 'literal',
                bail: true,
                fieldName: '1',
                allowNull: false,
                isOptional: false,
                propertyName: '1',
                validations: [],
              },
            ],
          },
          {
            type: 'tuple',
            bail: true,
            fieldName: '1',
            validations: [],
            propertyName: '1',
            allowNull: false,
            isOptional: false,
            allowUnknownProperties: true,
            properties: [
              {
                type: 'literal',
                bail: true,
                fieldName: '0',
                allowNull: false,
                isOptional: false,
                propertyName: '0',
                validations: [],
              },
              {
                type: 'literal',
                bail: true,
                fieldName: '1',
                allowNull: false,
                isOptional: false,
                propertyName: '1',
                validations: [],
              },
            ],
          },
        ],
      },
    })

    const data = [
      ['hello world', 'hi world', 'foo bar'],
      ['hi world', 'hello world', 'foo bar'],
      ['hi world', 'hello world', 'foo bar'],
    ]

    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, [
      ['hello world', 'hi world', 'foo bar'],
      ['hi world', 'hello world', 'foo bar'],
      ['hi world', 'hello world', 'foo bar'],
    ])

    // Mutation test
    data[0][0] = 'foo'
    assert.deepEqual(output, [
      ['hello world', 'hi world', 'foo bar'],
      ['hi world', 'hello world', 'foo bar'],
      ['hi world', 'hello world', 'foo bar'],
    ])
  })

  test('run array validations', async ({ assert }) => {
    assert.plan(7)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
          {
            ruleFnId: 'ref://3',
            implicit: false,
            isAsync: false,
          },
        ],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
      },
    })

    const data: any[] = []
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, [])
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
        },
      },
      'ref://3': {
        validator(value, options, ctx) {
          assert.deepEqual(value, [])
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
        },
      },
    }

    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, [])
  })

  test('stop validation after first error', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
          {
            ruleFnId: 'ref://3',
            implicit: false,
            isAsync: false,
          },
        ],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
      },
    })

    const data: any[] = []
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, [])
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          ctx.report('ref://2 validation failed', 'ref', ctx)
        },
      },
      'ref://3': {
        validator() {
          throw new Error('Never expected to be called')
        },
      },
    }

    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['ref://2 validation failed'])
    }
  })

  test('continue validations after error when bail mode is disabled', async ({ assert }) => {
    assert.plan(8)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: false,
        fieldName: '*',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
          {
            ruleFnId: 'ref://3',
            implicit: false,
            isAsync: false,
          },
        ],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
      },
    })

    const data: any[] = []
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, [])
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          ctx.report('ref://2 validation failed', 'ref', ctx)
        },
      },
      'ref://3': {
        validator(value, options, ctx) {
          assert.deepEqual(value, [])
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            isArrayMember: false,
            isValid: false,
            meta: {},
            parent: data,
            data,
          })
        },
      },
    }

    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['ref://2 validation failed'])
    }
  })

  test('do not process properties when array is invalid', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
        ],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [
              {
                ruleFnId: 'ref://3',
                implicit: false,
                isAsync: false,
              },
            ],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [
              {
                ruleFnId: 'ref://3',
                implicit: false,
                isAsync: false,
              },
            ],
          },
        ],
      },
    })

    const data: any[] = ['hello world', 'hi world']
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          ctx.report('ref://2 validation failed', 'ref', ctx)
        },
      },
      'ref://3': {
        validator() {
          throw new Error('Never expected to be called')
        },
      },
    }

    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['ref://2 validation failed'])
    }
  })

  test('process properties of invalid array when bail mode is disabled', async ({ assert }) => {
    assert.plan(11)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: false,
        fieldName: '*',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
        ],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [
              {
                ruleFnId: 'ref://3',
                implicit: false,
                isAsync: false,
              },
            ],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [
              {
                ruleFnId: 'ref://3',
                implicit: false,
                isAsync: false,
              },
            ],
          },
        ],
      },
    })

    const data: any[] = ['hello world', 'hi world']
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          ctx.report('ref://2 validation failed', 'ref', ctx)
        },
      },
      'ref://3': {
        validator(value, options, ctx) {
          if (ctx.fieldName === 0) {
            assert.equal(value, 'hello world')
            assert.isUndefined(options)
            assert.containsSubset(ctx, {
              fieldName: 0,
              wildCardPath: '0',
              isArrayMember: true,
              isValid: true,
              meta: {},
              parent: ['hello world', 'hi world'],
              data,
            })
          } else {
            assert.equal(value, 'hi world')
            assert.isUndefined(options)
            assert.containsSubset(ctx, {
              fieldName: 1,
              wildCardPath: '1',
              isArrayMember: true,
              isValid: true,
              meta: {},
              parent: ['hello world', 'hi world'],
              data,
            })
          }
        },
      },
    }

    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['ref://2 validation failed'])
    }
  })

  test('convert empty string to null', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler(
      {
        type: 'root',
        schema: {
          type: 'tuple',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
          properties: [
            {
              type: 'literal',
              bail: true,
              fieldName: '0',
              allowNull: false,
              isOptional: false,
              propertyName: '0',
              validations: [],
            },
            {
              type: 'literal',
              bail: true,
              fieldName: '1',
              allowNull: false,
              isOptional: false,
              propertyName: '1',
              validations: [],
            },
          ],
        },
      },
      { convertEmptyStringsToNull: true }
    )

    const data = ''
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is required'])
    }
  })

  test('call parse function', async ({ assert }) => {
    assert.plan(3)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        parseFnId: 'ref://1',
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = ['hello world', 'hi world']
    const meta = {}

    const refs = refsBuilder()
    refs.trackParser((value) => {
      assert.deepEqual(value, data)
      return value
    })

    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs.toJSON(), messagesProvider, errorReporter)
    assert.deepEqual(output, ['hello world', 'hi world'])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, ['hello world', 'hi world'])
  })
})

test.group('Tuple node | optional: true', () => {
  test('process children nodes', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = ['hello world', 'hi world']
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, ['hello world', 'hi world'])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, ['hello world', 'hi world'])
  })

  test('allow undefined value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = undefined
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.isUndefined(output)
  })

  test('allow null value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = null
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.isUndefined(output)
  })

  test('dis-allow non-array values', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = 'hello world'
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is not a valid array'])
    }
  })

  test('convert empty string to null', async ({ assert }) => {
    const compiler = new Compiler(
      {
        type: 'root',
        schema: {
          type: 'tuple',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
          allowNull: false,
          isOptional: true,
          allowUnknownProperties: false,
          properties: [
            {
              type: 'literal',
              bail: true,
              fieldName: '0',
              allowNull: false,
              isOptional: false,
              propertyName: '0',
              validations: [],
            },
            {
              type: 'literal',
              bail: true,
              fieldName: '1',
              allowNull: false,
              isOptional: false,
              propertyName: '1',
              validations: [],
            },
          ],
        },
      },
      { convertEmptyStringsToNull: true }
    )

    const data = ''
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.isUndefined(output)
  })
})

test.group('Tuple node | allowNull: true', () => {
  test('process children nodes', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = ['hello world', 'hi world']
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, ['hello world', 'hi world'])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, ['hello world', 'hi world'])
  })

  test('dis-allow undefined value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = undefined
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is required'])
    }
  })

  test('allow null value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = null
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.isNull(output)
  })

  test('dis-allow non-array values', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: '0',
            allowNull: false,
            isOptional: false,
            propertyName: '0',
            validations: [],
          },
          {
            type: 'literal',
            bail: true,
            fieldName: '1',
            allowNull: false,
            isOptional: false,
            propertyName: '1',
            validations: [],
          },
        ],
      },
    })

    const data = 'hello world'
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is not a valid array'])
    }
  })

  test('convert empty string to null', async ({ assert }) => {
    const compiler = new Compiler(
      {
        type: 'root',
        schema: {
          type: 'tuple',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
          allowNull: true,
          isOptional: false,
          allowUnknownProperties: false,
          properties: [
            {
              type: 'literal',
              bail: true,
              fieldName: '0',
              allowNull: false,
              isOptional: false,
              propertyName: '0',
              validations: [],
            },
            {
              type: 'literal',
              bail: true,
              fieldName: '1',
              allowNull: false,
              isOptional: false,
              propertyName: '1',
              validations: [],
            },
          ],
        },
      },
      { convertEmptyStringsToNull: true }
    )

    const data = ''
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.isNull(output)
  })
})
