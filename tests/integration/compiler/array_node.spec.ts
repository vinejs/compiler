/*
 * @adonisjs/validator
 *
 * (c) Validator
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Compiler } from '../../../src/compiler/main.js'
import { ErrorReporterFactory } from '../../../factories/error_reporter.js'
import { ValidationRule } from '../../../src/types.js'

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
        allowUnknownProperties: false,
      },
    })

    const data: any[] = []
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
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
        allowUnknownProperties: false,
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
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
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
        allowUnknownProperties: false,
      },
    })

    const data = 'hello world'
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is not a valid array'])
    }
  })

  test('ignore array elements when each node is not defined', async ({ assert }) => {
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
        allowUnknownProperties: false,
      },
    })

    const data = ['hello world', 'hi world']
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, [])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, [])
  })

  test('keep array items elements when unknown properties are allowed', async ({ assert }) => {
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
        allowUnknownProperties: true,
      },
    })

    const data = ['hello world', 'hi world']
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, ['hello world', 'hi world'])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, ['hello world', 'hi world'])
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
        allowUnknownProperties: false,
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
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
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
        allowUnknownProperties: false,
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
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
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
        allowUnknownProperties: false,
        each: {
          type: 'array',
          bail: true,
          fieldName: '*',
          validations: [],
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
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
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
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
        allowUnknownProperties: false,
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
        validator(value, options, ctx) {
          assert.deepEqual(value, ['hello world', 'hi world'])
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
          assert.deepEqual(value, ['hello world', 'hi world'])
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
        allowUnknownProperties: false,
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
        validator(value, options, ctx) {
          assert.deepEqual(value, ['hello world', 'hi world'])
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
        allowUnknownProperties: false,
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
        validator(value, options, ctx) {
          assert.deepEqual(value, ['hello world', 'hi world'])
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
          assert.deepEqual(value, ['hello world', 'hi world'])
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
        allowUnknownProperties: false,
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
        validator(value, options, ctx) {
          assert.deepEqual(value, ['hello world', 'hi world'])
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
        allowUnknownProperties: false,
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
        validator(value, options, ctx) {
          assert.deepEqual(value, ['hello world', 'hi world'])
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
          assert.oneOf(value, ['hello world', 'hi world'])
          assert.isUndefined(options)
          assert.containsSubset(ctx, {
            isArrayMember: true,
            isValid: true,
            meta: {},
            parent: ['hello world', 'hi world'],
            data,
          })
          assert.oneOf(ctx.fieldName, [0, 1])
          assert.oneOf(ctx.fieldPath, [0, 1])

          if (ctx.isArrayMember) {
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

test.group('Array node | mode: tuple', () => {
  test('process children nodes', async ({ assert }) => {
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
        allowUnknownProperties: false,
        children: [
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
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, ['hello world', 'hi world'])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, ['hello world', 'hi world'])
  })

  test('ignore additional array items', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: '',
        validations: [],
        propertyName: '',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        children: [
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
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, ['hello world'])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, ['hello world'])
  })

  test('keep additional array items when unknown properties are allowed', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: true,
        children: [
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
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, ['hello world', 'hi world'])

    // Mutation test
    data[0] = 'foo'
    assert.deepEqual(output, ['hello world', 'hi world'])
  })

  test('process nested children nodes', async ({ assert }) => {
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
        allowUnknownProperties: false,
        children: [
          {
            type: 'array',
            bail: true,
            fieldName: '0',
            validations: [],
            propertyName: '0',
            allowNull: false,
            isOptional: false,
            allowUnknownProperties: false,
            children: [
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
            type: 'array',
            bail: true,
            fieldName: '1',
            validations: [],
            propertyName: '1',
            allowNull: false,
            isOptional: false,
            allowUnknownProperties: false,
            children: [
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
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
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
        type: 'array',
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: true,
        children: [
          {
            type: 'array',
            bail: true,
            fieldName: '0',
            validations: [],
            propertyName: '0',
            allowNull: false,
            isOptional: false,
            allowUnknownProperties: true,
            children: [
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
            type: 'array',
            bail: true,
            fieldName: '1',
            validations: [],
            propertyName: '1',
            allowNull: false,
            isOptional: false,
            allowUnknownProperties: true,
            children: [
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
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
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
        allowUnknownProperties: false,
      },
    })

    const data: any = []
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
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
        allowUnknownProperties: false,
      },
    })

    const data: any = undefined
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
        type: 'array',
        bail: true,
        fieldName: 'contacts',
        validations: [],
        propertyName: 'contacts',
        allowNull: false,
        isOptional: true,
        allowUnknownProperties: false,
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
        allowUnknownProperties: false,
      },
    })

    const data = 'hello world'
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is not a valid array'])
    }
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
        allowUnknownProperties: false,
      },
    })

    const data: any = []
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
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
        allowUnknownProperties: false,
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
        allowUnknownProperties: false,
      },
    })

    const data: any = null
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
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
        allowUnknownProperties: false,
      },
    })

    const data = 'hello world'
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is not a valid array'])
    }
  })
})
