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
import { ValidationRule } from '../../../src/types.js'

test.group('Record node', () => {
  test('process a record field', async ({ assert }) => {
    const compiler = new Compiler([
      {
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
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    ])

    const data: any = {
      colors: {},
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, { colors: {} })

    // Mutation test:
    data.colors.white = '#fff'
    assert.deepEqual(output, { colors: {} })
  })

  test('dis-allow undefined value', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler([
      {
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
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    ])

    const data = {}
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is required'])
    }
  })

  test('dis-allow null value', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler([
      {
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
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    ])

    const data = {
      colors: null,
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is required'])
    }
  })

  test('dis-allow non-object values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler([
      {
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
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    ])

    const data = {
      colors: 'hello world',
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is not a valid object'])
    }
  })

  test('process each element', async ({ assert }) => {
    const compiler = new Compiler([
      {
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
          allowNull: false,
          isOptional: false,
          fieldName: '*',
          propertyName: '*',
          validations: [],
        },
      },
    ])

    const data = {
      colors: { white: '#fff', black: '#000' },
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {
      colors: { white: '#fff', black: '#000' },
    })

    // Mutation test:
    data.colors.white = 'white'
    assert.deepEqual(output, {
      colors: { white: '#fff', black: '#000' },
    })
  })

  test('validate nested each elements', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [],
        propertyName: 'colors',
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
    ])

    const data = {
      colors: { white: '#fff', black: '#000' },
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, [
        'value is not a valid object',
        'value is not a valid object',
      ])
    }
  })

  test('process nested each elements', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [],
        propertyName: 'colors',
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
    ])

    const data = {
      colors: { white: { bg: '#f3f3f3', fg: '#fff' }, black: { bg: '#000', fg: '#000' } },
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {
      colors: { white: { bg: '#f3f3f3', fg: '#fff' }, black: { bg: '#000', fg: '#000' } },
    })

    // Mutation test:
    data.colors.white.bg = 'white'
    assert.deepEqual(output, {
      colors: { white: { bg: '#f3f3f3', fg: '#fff' }, black: { bg: '#000', fg: '#000' } },
    })
  })

  test('run validations', async ({ assert }) => {
    assert.plan(7)

    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
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
        propertyName: 'colors',
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
    ])

    const data = {
      colors: { white: '#fff', black: '#000' },
    }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: 'colors',
            fieldPath: 'colors',
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
          assert.deepEqual(value, { white: '#fff', black: '#000' })
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: 'colors',
            fieldPath: 'colors',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
        },
      },
    }

    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {
      colors: { white: '#fff', black: '#000' },
    })
  })

  test('stop validations after first error', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
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
        propertyName: 'colors',
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
    ])

    const data = {
      colors: { white: '#fff', black: '#000' },
    }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: 'colors',
            fieldPath: 'colors',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          ctx.report('ref://2 validation failed', ctx)
        },
      },
      'ref://3': {
        validator(value, options, ctx) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: 'colors',
            fieldPath: 'colors',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
        },
      },
    }

    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()

    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['ref://2 validation failed'])
    }
  })

  test('continue validations after error when bail mode is disabled', async ({ assert }) => {
    assert.plan(8)

    const compiler = new Compiler([
      {
        type: 'record',
        bail: false,
        fieldName: 'colors',
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
        propertyName: 'colors',
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
    ])

    const data = {
      colors: { white: '#fff', black: '#000' },
    }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: 'colors',
            fieldPath: 'colors',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          ctx.report('ref://2 validation failed', ctx)
        },
      },
      'ref://3': {
        validator(value, options, ctx) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: 'colors',
            fieldPath: 'colors',
            isArrayMember: false,
            isValid: false,
            meta: {},
            parent: data,
            data,
          })
        },
      },
    }

    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()

    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['ref://2 validation failed'])
    }
  })

  test('do not process children when record is invalid', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
        ],
        propertyName: 'colors',
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
    ])

    const data = {
      colors: { white: '#fff', black: '#000' },
    }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: 'colors',
            fieldPath: 'colors',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          ctx.report('ref://2 validation failed', ctx)
        },
      },
      'ref://3': {
        validator() {
          throw new Error('Never expected to be called')
        },
      },
    }

    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()

    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['ref://2 validation failed'])
    }
  })

  test('process children for invalid record when bail mode is disabled', async ({ assert }) => {
    assert.plan(15)

    const compiler = new Compiler([
      {
        type: 'record',
        bail: false,
        fieldName: 'colors',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
        ],
        propertyName: 'colors',
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
    ])

    const data = {
      colors: { white: '#fff', black: '#000' },
    }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, { white: '#fff', black: '#000' })
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: 'colors',
            fieldPath: 'colors',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          ctx.report('ref://2 validation failed', ctx)
        },
      },
      'ref://3': {
        validator(value, options, ctx) {
          assert.oneOf(ctx.fieldName, ['white', 'black'])
          assert.oneOf(ctx.fieldPath, ['colors.white', 'colors.black'])
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: { white: '#fff', black: '#000' },
            data,
          })

          if (!ctx.isArrayMember) {
            assert.equal(ctx.parent[ctx.fieldName], value)
          }
        },
      },
    }

    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()

    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['ref://2 validation failed'])
    }
  })
})

test.group('Record node | optional: true', () => {
  test('process a record field', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [],
        propertyName: 'colors',
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
    ])

    const data = {
      colors: {},
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, { colors: {} })
  })

  test('allow undefined value', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [],
        propertyName: 'colors',
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
    ])

    const data = {}
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {})
  })

  test('allow null value', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [],
        propertyName: 'colors',
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
    ])

    const data = {
      colors: null,
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {})
  })

  test('dis-allow non-object values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [],
        propertyName: 'colors',
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
    ])

    const data = {
      colors: 'hello world',
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is not a valid object'])
    }
  })
})

test.group('Record node | allowNull: true', () => {
  test('process a record field', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [],
        propertyName: 'colors',
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
    ])

    const data = {
      colors: {},
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, { colors: {} })
  })

  test('dis-allow undefined value', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [],
        propertyName: 'colors',
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
    ])

    const data = {}
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()

    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is required'])
    }
  })

  test('allow null value', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [],
        propertyName: 'colors',
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
    ])

    const data = {
      colors: null,
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, { colors: null })
  })

  test('dis-allow non-object values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler([
      {
        type: 'record',
        bail: true,
        fieldName: 'colors',
        validations: [],
        propertyName: 'colors',
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
    ])

    const data = {
      colors: 'hello world',
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is not a valid object'])
    }
  })
})
