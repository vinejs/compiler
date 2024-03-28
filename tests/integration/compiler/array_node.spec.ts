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
import { Compiler } from '../../../src/compiler/main.js'
import type { ValidationRule } from '../../../src/types.js'
import { ErrorReporterFactory } from '../../../factories/error_reporter.js'
import { MessagesProviderFactory } from '../../../factories/messages_provider.js'

test.group('Array node', () => {
  test('process an array field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data: any[] = []
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, [])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, [])
  })

  test('dis-allow undefined value', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
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
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
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
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
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

  test('validate each node', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
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
    })

    const data = [undefined]
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

  test('process each node', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
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

  test('process nested array nodes', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'array',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
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
    })

    const data: any = [['hello world'], ['hi world']]
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, [['hello world'], ['hi world']])

    // Mutation test
    data[0][0] = 'foo'
    assert.deepEqual(output, [['hello world'], ['hi world']])
  })

  test('run validations', async ({ assert }) => {
    assert.plan(7)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: '',
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
        propertyName: '',
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
    })

    const data = ['hello world', 'hi world']
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, field) {
          assert.deepEqual(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(field, {
            name: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
        },
      },
      'ref://3': {
        validator(value, options, field) {
          assert.deepEqual(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(field, {
            name: '',
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
    assert.deepEqual(output, ['hello world', 'hi world'])
  })

  test('stop validations after first error', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
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
    })

    const data = ['hello world', 'hi world']
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, field) {
          assert.deepEqual(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(field, {
            name: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          field.report('ref://2 validation failed', 'ref', field)
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
        type: 'array',
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
    })

    const data = ['hello world', 'hi world']
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, field) {
          assert.deepEqual(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(field, {
            name: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          field.report('ref://2 validation failed', 'ref', field)
        },
      },
      'ref://3': {
        validator(value, options, field) {
          assert.deepEqual(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(field, {
            name: '',
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

  test('do not process children when array is invalid', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
        ],
        propertyName: 'contacts',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          fieldName: '*',
          allowNull: false,
          isOptional: false,
          propertyName: '*',
          validations: [
            {
              ruleFnId: 'ref://3',
              implicit: false,
              isAsync: false,
            },
          ],
        },
      },
    })

    const data = ['hello world', 'hi world']
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, field) {
          assert.deepEqual(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(field, {
            name: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          field.report('ref://2 validation failed', 'ref', field)
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

  test('process children for invalid array when bail mode is disabled', async ({ assert }) => {
    assert.plan(17)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: false,
        fieldName: 'contacts',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
        ],
        propertyName: 'contacts',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          fieldName: '*',
          allowNull: false,
          isOptional: false,
          propertyName: '*',
          validations: [
            {
              ruleFnId: 'ref://3',
              implicit: false,
              isAsync: false,
            },
          ],
        },
      },
    })

    const data = ['hello world', 'hi world']
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, field) {
          assert.deepEqual(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(field, {
            name: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          field.report('ref://2 validation failed', 'ref', field)
        },
      },
      'ref://3': {
        validator(value, options, field) {
          assert.oneOf(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(field, {
            isArrayMember: true,
            isValid: true,
            meta: {},
            parent: ['hello world', 'hi world'],
            data,
          })
          assert.oneOf(field.name, [0, 1])
          assert.equal(field.wildCardPath, '*')

          if (field.isArrayMember) {
            assert.equal(field.parent[field.name], value)
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
          type: 'array',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          each: {
            type: 'literal',
            allowNull: false,
            bail: true,
            isOptional: false,
            fieldName: '*',
            propertyName: '*',
            validations: [],
          },
        },
      },
      { convertEmptyStringsToNull: true }
    )

    const data: any = ''
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
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        parseFnId: 'ref://1',
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data: any[] = []
    const meta = {}
    const refs = refsBuilder()
    refs.trackParser((value) => {
      assert.deepEqual(value, [])
      return value
    })

    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs.toJSON(), messagesProvider, errorReporter)
    assert.deepEqual(output, [])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, [])
  })

  test('get nested runtime field path', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'array',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
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
            transformFnId: 'ref://1',
          },
        },
      },
    })

    const data: any = [['hello world'], ['hi world']]
    const meta = {}

    const refs = refsBuilder()
    refs.trackTransformer((value, ctx) => {
      assert.oneOf(ctx.getFieldPath(), ['0.0', '1.0'])
      assert.equal(ctx.wildCardPath, '*.*')
      return value
    })

    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs.toJSON(), messagesProvider, errorReporter)
    assert.deepEqual(output, [['hello world'], ['hi world']])

    // Mutation test
    data[0][0] = 'foo'
    assert.deepEqual(output, [['hello world'], ['hi world']])
  })
})

test.group('Array node | optional: true', () => {
  test('process an array field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: false,
        isOptional: true,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data: any = []
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, [])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, [])
  })

  test('allow undefined value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: false,
        isOptional: true,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data: any = undefined
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, undefined)
  })

  test('allow null value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: false,
        isOptional: true,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data = null
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, undefined)
  })

  test('dis-allow non-array values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: false,
        isOptional: true,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
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
          type: 'array',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
          allowNull: false,
          isOptional: true,
          each: {
            type: 'literal',
            allowNull: false,
            bail: true,
            isOptional: false,
            fieldName: '*',
            propertyName: '*',
            validations: [],
          },
        },
      },
      { convertEmptyStringsToNull: true }
    )

    const data: any = ''
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.isUndefined(output)
  })
})

test.group('Array node | allowNull: true', () => {
  test('process an array field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: true,
        isOptional: false,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data: any = []
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, [])
  })

  test('dis-allow undefined value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: true,
        isOptional: false,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
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
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: true,
        isOptional: false,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data: any = null
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, null)
  })

  test('dis-allow non-array values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: true,
        isOptional: false,
        each: {
          type: 'literal',
          allowNull: false,
          bail: true,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
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
          type: 'array',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
          allowNull: true,
          isOptional: false,
          each: {
            type: 'literal',
            allowNull: false,
            bail: true,
            isOptional: false,
            fieldName: '*',
            propertyName: '*',
            validations: [],
          },
        },
      },
      { convertEmptyStringsToNull: true }
    )

    const data: any = ''
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.isNull(output)
  })
})
