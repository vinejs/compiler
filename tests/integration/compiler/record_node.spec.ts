/*
 * @vinejs/compiler
 *
 * (c) VineJS
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

test.group('Record node', () => {
  test('process a record field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data: any = {}
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, {})

    // Mutation test:
    data.colors = { white: '#fff' }
    assert.deepEqual(output, {})
  })

  test('dis-allow undefined value', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
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
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
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

  test('dis-allow non-object values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
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
      assert.deepEqual(error.messages, ['value is not a valid object'])
    }
  })

  test('process each element', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data = { white: '#fff', black: '#000' }
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, { white: '#fff', black: '#000' })

    // Mutation test:
    data.white = 'white'
    assert.deepEqual(output, { white: '#fff', black: '#000' })
  })

  test('validate nested each elements', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'record',
          bail: true,
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          validations: [],
          each: {
            type: 'literal',
            bail: true,
            allowNull: false,
            isOptional: false,
            fieldName: '*',
            propertyName: '*',
            validations: [],
          },
        },
      },
    })

    const data = { white: '#fff', black: '#000' }
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, messagesProvider, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, [
        'value is not a valid object',
        'value is not a valid object',
      ])
    }
  })

  test('process nested each elements', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'record',
          bail: true,
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          validations: [],
          each: {
            type: 'literal',
            bail: true,
            allowNull: false,
            isOptional: false,
            fieldName: '*',
            propertyName: '*',
            validations: [],
          },
        },
      },
    })

    const data = {
      white: { bg: '#f3f3f3', fg: '#fff' },
      black: { bg: '#000', fg: '#000' },
    }
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, {
      white: { bg: '#f3f3f3', fg: '#fff' },
      black: { bg: '#000', fg: '#000' },
    })

    // Mutation test:
    data.white.bg = 'white'
    assert.deepEqual(output, {
      white: { bg: '#f3f3f3', fg: '#fff' },
      black: { bg: '#000', fg: '#000' },
    })
  })

  test('run validations', async ({ assert }) => {
    assert.plan(7)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
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
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data = { white: '#fff', black: '#000' }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, field) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
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
          assert.deepEqual(value, { white: '#fff', black: '#000' })
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
    assert.deepEqual(output, { white: '#fff', black: '#000' })
  })

  test('stop validations after first error', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
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
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data = { white: '#fff', black: '#000' }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, field) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
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
          throw new Error('Never expected to reach here')
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
        type: 'record',
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
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data = { white: '#fff', black: '#000' }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, field) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
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
          assert.deepEqual(value, { white: '#fff', black: '#000' })
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

  test('do not process children when record is invalid', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
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
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
          isOptional: false,
          fieldName: '*',
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

    const data = { white: '#fff', black: '#000' }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, field) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
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

  test('process children for invalid record when bail mode is disabled', async ({ assert }) => {
    assert.plan(15)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
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
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
          isOptional: false,
          fieldName: '*',
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

    const data = { white: '#fff', black: '#000' }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, field) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
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
          assert.oneOf(field.name, ['white', 'black'])
          assert.equal(field.wildCardPath, '*')
          assert.isUndefined(options)
          assert.containsSubset(field, {
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: { white: '#fff', black: '#000' },
            data,
          })

          if (!field.isArrayMember) {
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
          type: 'record',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          each: {
            type: 'literal',
            bail: true,
            allowNull: false,
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
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        parseFnId: 'ref://1',
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data: any = {}
    const meta = {}

    const refs = refsBuilder()
    refs.trackParser((value) => {
      assert.deepEqual(value, {})
      return value
    })

    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs.toJSON(), messagesProvider, errorReporter)
    assert.deepEqual(output, {})

    // Mutation test:
    data.colors = { white: '#fff' }
    assert.deepEqual(output, {})
  })

  test('get nested runtime field path', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        each: {
          type: 'record',
          bail: true,
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          validations: [],
          each: {
            type: 'literal',
            bail: true,
            allowNull: false,
            isOptional: false,
            fieldName: '*',
            propertyName: '*',
            validations: [],
            transformFnId: 'ref://1',
          },
        },
      },
    })

    const data = {
      white: { bg: '#f3f3f3', fg: '#fff' },
      black: { bg: '#000', fg: '#000' },
    }
    const meta = {}
    const refs = refsBuilder()
    refs.trackTransformer((value, ctx) => {
      assert.oneOf(ctx.getFieldPath(), ['white.bg', 'white.fg', 'black.bg', 'black.fg'])
      assert.equal(ctx.wildCardPath, '*.*')
      return value
    })
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs.toJSON(), messagesProvider, errorReporter)
    assert.deepEqual(output, {
      white: { bg: '#f3f3f3', fg: '#fff' },
      black: { bg: '#000', fg: '#000' },
    })

    // Mutation test:
    data.white.bg = 'white'
    assert.deepEqual(output, {
      white: { bg: '#f3f3f3', fg: '#fff' },
      black: { bg: '#000', fg: '#000' },
    })
  })
})

test.group('Record node | optional: true', () => {
  test('process a record field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data = {}
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, {})
  })

  test('allow undefined value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
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
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, undefined)
  })

  test('allow null value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
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

  test('dis-allow non-object values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
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
      assert.deepEqual(error.messages, ['value is not a valid object'])
    }
  })

  test('convert empty string to null', async ({ assert }) => {
    const compiler = new Compiler(
      {
        type: 'root',
        schema: {
          type: 'record',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
          allowNull: false,
          isOptional: true,
          each: {
            type: 'literal',
            bail: true,
            allowNull: false,
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

test.group('Record node | allowNull: true', () => {
  test('process a record field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    })

    const data = {}
    const meta = {}
    const refs = {}
    const messagesProvider = new MessagesProviderFactory().create()
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, messagesProvider, errorReporter)
    assert.deepEqual(output, {})
  })

  test('dis-allow undefined value', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
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
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
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
    assert.deepEqual(output, null)
  })

  test('dis-allow non-object values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        each: {
          type: 'literal',
          bail: true,
          allowNull: false,
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
      assert.deepEqual(error.messages, ['value is not a valid object'])
    }
  })

  test('convert empty string to null', async ({ assert }) => {
    const compiler = new Compiler(
      {
        type: 'root',
        schema: {
          type: 'record',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
          allowNull: true,
          isOptional: false,
          each: {
            type: 'literal',
            bail: true,
            allowNull: false,
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
