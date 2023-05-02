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
import { TransformFn, ValidationRule } from '../../../src/types.js'

test.group('Literal node', () => {
  test('process value for a field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
      },
    })

    const data = 'virk'
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, 'virk')
  })

  test('allow empty string value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
      },
    })

    const data = ''
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, '')
  })

  test('dis-allow undefined value', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [],
        propertyName: 'userName',
        allowNull: false,
        isOptional: false,
      },
    })

    const data = undefined
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

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [],
        propertyName: 'userName',
        allowNull: false,
        isOptional: false,
      },
    })

    const data = null
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

  test('run validations', async ({ assert }) => {
    assert.plan(7)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
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
      },
    })

    const data = 'virk'
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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
    assert.deepEqual(output, 'virk')
  })

  test('stop validations after first error', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
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
        propertyName: 'userName',
        allowNull: false,
        isOptional: false,
      },
    })

    const data = 'virk'
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
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
      },
    })

    const data = 'virk'
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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

  test('do not call transform when field is invalid', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        transformFnId: 'ref://3',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
        ],
        propertyName: 'userName',
        allowNull: false,
        isOptional: false,
      },
    })

    const data = 'virk'
    const meta = {}

    const refs: {
      'ref://2': ValidationRule
      'ref://3': TransformFn
    } = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
          ctx.report('ref://2 failed', ctx)
        },
      },
      'ref://3': () => {
        throw new Error('Never expected to reach here')
      },
    }

    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['ref://2 failed'])
    }
  })

  test('call transform when field is valid', async ({ assert }) => {
    assert.plan(4)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: '*',
        transformFnId: 'ref://3',
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
      },
    })

    const data = 'virk'
    const meta = {}

    const refs: {
      'ref://2': ValidationRule
      'ref://3': TransformFn
    } = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
            isArrayMember: false,
            isValid: true,
            meta: {},
            parent: data,
            data,
          })
        },
      },
      'ref://3': (value) => {
        return (value as string).toUpperCase()
      },
    }

    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    assert.deepEqual(await fn(data, meta, refs, errorReporter), 'VIRK')
  })
})

test.group('Literal node | optional: true', () => {
  test('process value for an optional field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [],
        propertyName: 'userName',
        allowNull: false,
        isOptional: true,
      },
    })

    const data = 'virk'
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, 'virk')
  })

  test('allow empty string value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [],
        propertyName: 'userName',
        allowNull: false,
        isOptional: true,
      },
    })

    const data = ''
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, '')
  })

  test('allow undefined value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [],
        propertyName: 'userName',
        allowNull: false,
        isOptional: true,
      },
    })

    const data = undefined
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, undefined)
  })

  test('allow null value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [],
        propertyName: 'userName',
        allowNull: false,
        isOptional: true,
      },
    })

    const data = null
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, undefined)
  })

  test('run validations', async ({ assert }) => {
    assert.plan(7)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
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
        propertyName: 'userName',
        allowNull: false,
        isOptional: true,
      },
    })

    const data = 'virk'
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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
    assert.deepEqual(output, 'virk')
  })

  test('do not run validations when value is undefined', async ({ assert }) => {
    assert.plan(1)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
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
        isOptional: true,
      },
    })

    const data = undefined
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator() {
          throw new Error('Never expected to reach here')
        },
      },
      'ref://3': {
        validator() {
          throw new Error('Never expected to reach here')
        },
      },
    }

    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, undefined)
  })

  test('run validations for implicit rules when value is undefined', async ({ assert }) => {
    assert.plan(4)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
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
            implicit: true,
            isAsync: false,
          },
        ],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
      },
    })

    const data = undefined
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator() {
          throw new Error('Never expected to reach here')
        },
      },
      'ref://3': {
        validator(value, options, ctx) {
          assert.equal(value, undefined)
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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
    assert.deepEqual(output, undefined)
  })
})

test.group('Literal node | allowNull: true', () => {
  test('process value for a nullable field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [],
        propertyName: 'userName',
        allowNull: true,
        isOptional: false,
      },
    })

    const data = 'virk'
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, 'virk')
  })

  test('allow empty string value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [],
        propertyName: 'userName',
        allowNull: true,
        isOptional: false,
      },
    })

    const data = ''
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, '')
  })

  test('allow null value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [],
        propertyName: 'userName',
        allowNull: true,
        isOptional: false,
      },
    })

    const data = null
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, null)
  })

  test('dis-allow undefined value', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [],
        propertyName: 'userName',
        allowNull: true,
        isOptional: false,
      },
    })

    const data = undefined
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

  test('run validations', async ({ assert }) => {
    assert.plan(7)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
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
        allowNull: true,
        isOptional: false,
      },
    })

    const data = 'virk'
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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
          assert.equal(value, 'virk')
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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
    assert.deepEqual(output, 'virk')
  })

  test('do not run validations when value is null', async ({ assert }) => {
    assert.plan(1)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
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
        propertyName: 'userName',
        allowNull: true,
        isOptional: false,
      },
    })

    const data = null
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator() {
          throw new Error('Never expected to reach here')
        },
      },
      'ref://3': {
        validator() {
          throw new Error('Never expected to reach here')
        },
      },
    }

    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, null)
  })

  test('run validations for implicit rules when value is null', async ({ assert }) => {
    assert.plan(4)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        bail: true,
        fieldName: 'username',
        validations: [
          {
            ruleFnId: 'ref://2',
            implicit: false,
            isAsync: false,
          },
          {
            ruleFnId: 'ref://3',
            implicit: true,
            isAsync: false,
          },
        ],
        propertyName: 'userName',
        allowNull: true,
        isOptional: false,
      },
    })

    const data = null
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator() {
          throw new Error('Never expected to reach here')
        },
      },
      'ref://3': {
        validator(value, options, ctx) {
          assert.isNull(value)
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            fieldName: '',
            fieldPath: '',
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
    assert.deepEqual(output, null)
  })
})
