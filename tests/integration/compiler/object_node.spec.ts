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

test.group('Object node', () => {
  test('process an object field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '',
        validations: [],
        propertyName: '',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
      },
    })

    const data: any = {}
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {})

    // Mutation test:
    data.profile = {}
    assert.deepEqual(output, {})
  })

  test('dis-allow undefined value', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
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
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
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

  test('dis-allow non-object values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
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
            fieldName: 'username',
            allowNull: false,
            isOptional: false,
            propertyName: 'userName',
            validations: [],
          },
        ],
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
      assert.deepEqual(error.messages, ['value is not a valid object'])
    }
  })

  test('ignore object properties when children nodes are not defined', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
      },
    })

    const data = { username: 'virk', age: 34 }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {})

    // Mutation test:
    data.age = 22
    assert.deepEqual(output, {})
  })

  test('validate object children', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
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
    })

    const data = {}
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    try {
      await fn(data, meta, refs, errorReporter)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is required', 'value is required'])
    }
  })

  test('process children nodes', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
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
    })

    const data = { username: 'virk', age: 34 }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, { userName: 'virk', age: 34 })

    // Mutation test:
    data.age = 22
    assert.deepEqual(output, { userName: 'virk', age: 34 })
  })

  test('process nested object nodes', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [
          {
            type: 'object',
            groups: [],
            bail: true,
            fieldName: 'social',
            validations: [],
            propertyName: 'social',
            allowNull: false,
            isOptional: false,
            allowUnknownProperties: false,
            properties: [
              {
                type: 'literal',
                bail: true,
                fieldName: 'twitter_handle',
                allowNull: false,
                isOptional: false,
                propertyName: 'twitterHandle',
                validations: [],
              },
              {
                type: 'literal',
                bail: true,
                fieldName: 'github_username',
                allowNull: false,
                isOptional: false,
                propertyName: 'githubUsername',
                validations: [],
              },
            ],
          },
        ],
      },
    })

    const data = {
      social: {
        github_username: 'thetutlage',
        twitter_handle: 'AmanVirk1',
      },
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {
      social: {
        githubUsername: 'thetutlage',
        twitterHandle: 'AmanVirk1',
      },
    })

    // Mutation test:
    data.social.github_username = 'foo'
    assert.deepEqual(output, {
      social: {
        githubUsername: 'thetutlage',
        twitterHandle: 'AmanVirk1',
      },
    })
  })

  test('run object validations', async ({ assert }) => {
    assert.plan(7)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
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
        allowUnknownProperties: false,
        allowNull: false,
        isOptional: false,
        properties: [],
      },
    })

    const data = {}
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, {})
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
          assert.deepEqual(value, {})
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
    assert.deepEqual(output, {})
  })

  test('stop validations after first error', async ({ assert }) => {
    assert.plan(5)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
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
        allowUnknownProperties: false,
        allowNull: false,
        isOptional: false,
        properties: [],
      },
    })

    const data = {}
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, {})
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
        type: 'object',
        groups: [],
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
        allowUnknownProperties: false,
        allowNull: false,
        isOptional: false,
        properties: [],
      },
    })

    const data = {}
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, {})
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
          assert.deepEqual(value, {})
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

  test('do not process children when object is invalid', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
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
            fieldName: 'username',
            allowNull: false,
            isOptional: false,
            propertyName: 'userName',
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
            fieldName: 'age',
            allowNull: false,
            isOptional: false,
            propertyName: 'age',
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

    const data = { username: 'virk', age: 34 }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, { username: 'virk', age: 34 })
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

  test('process children for invalid object when bail mode is disabled', async ({ assert }) => {
    assert.plan(11)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
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
            fieldName: 'username',
            allowNull: false,
            isOptional: false,
            propertyName: 'userName',
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
            fieldName: 'age',
            allowNull: false,
            isOptional: false,
            propertyName: 'age',
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

    const data = { username: 'virk', age: 34 }
    const meta = {}

    const refs: Record<string, ValidationRule> = {
      'ref://2': {
        validator(value, options, ctx) {
          assert.deepEqual(value, { username: 'virk', age: 34 })
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
          if (ctx.fieldName === 'username') {
            assert.equal(value, 'virk')
            assert.isUndefined(options)
            assert.containsSubset(ctx, {
              fieldName: 'username',
              fieldPath: 'username',
              isArrayMember: false,
              isValid: true,
              meta: {},
              parent: { username: 'virk', age: 34 },
              data,
            })
          } else {
            assert.equal(value, 34)
            assert.isUndefined(options)
            assert.containsSubset(ctx, {
              fieldName: 'age',
              fieldPath: 'age',
              isArrayMember: false,
              isValid: true,
              meta: {},
              parent: { username: 'virk', age: 34 },
              data,
            })
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

  test('process object groups', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [
          {
            type: 'group',
            conditions: [
              {
                conditionalFnRefId: 'ref://1',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'username',
                      propertyName: 'username',
                      validations: [],
                    },
                  ],
                },
              },
              {
                conditionalFnRefId: 'ref://2',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'email',
                      propertyName: 'email',
                      validations: [],
                    },
                  ],
                },
              },
            ],
          },
        ],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
      },
    })

    const data: any = {
      username: 'virk',
    }
    const meta = {}
    const refs = {
      'ref://1': () => true,
      'ref://2': () => false,
    }
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, { username: 'virk' })

    // Mutation test:
    data.username = 'foo'
    assert.deepEqual(output, { username: 'virk' })
  })

  test('allow unknowProperties when object groups are defined', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [
          {
            type: 'group',
            conditions: [
              {
                conditionalFnRefId: 'ref://1',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'username',
                      propertyName: 'userName',
                      validations: [],
                    },
                  ],
                },
              },
              {
                conditionalFnRefId: 'ref://2',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'email',
                      propertyName: 'email',
                      validations: [],
                    },
                  ],
                },
              },
            ],
          },
        ],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: true,
        properties: [],
      },
    })

    const data: any = {
      username: 'virk',
      foo: 'bar',
      baz: 'bam',
    }
    const meta = {}
    const refs = {
      'ref://1': () => true,
      'ref://2': () => false,
    }
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, { userName: 'virk', foo: 'bar', baz: 'bam' })

    // Mutation test:
    data.username = 'foo'
    assert.deepEqual(output, { userName: 'virk', foo: 'bar', baz: 'bam' })
  })
})

test.group('Object node | optional: true', () => {
  test('process an object field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        allowUnknownProperties: false,
        properties: [],
      },
    })

    const data = {}
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {})
  })

  test('allow undefined value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        allowUnknownProperties: false,
        properties: [],
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
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        allowUnknownProperties: false,
        properties: [],
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

  test('dis-allow non-object values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: true,
        allowUnknownProperties: false,
        properties: [],
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
      assert.deepEqual(error.messages, ['value is not a valid object'])
    }
  })
})

test.group('Object node | allowNull: true', () => {
  test('process an object field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
      },
    })

    const data = {}
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {})
  })

  test('allow null value', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
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
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
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

  test('dis-allow non-object values', async ({ assert }) => {
    assert.plan(2)

    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: true,
        isOptional: false,
        allowUnknownProperties: false,
        properties: [],
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
      assert.deepEqual(error.messages, ['value is not a valid object'])
    }
  })
})

test.group('Object node | allowUnknownProperties', () => {
  test('keep object properties when unknown properties are allowed', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: true,
        properties: [],
      },
    })

    const data = { username: 'virk', age: 34 }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, { username: 'virk', age: 34 })

    // Mutation test:
    data.age = 22
    assert.deepEqual(output, { username: 'virk', age: 34 })
  })

  test('validate known properties when unknown properties are allowed', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: true,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: 'username',
            allowNull: false,
            isOptional: false,
            propertyName: 'userName',
            validations: [],
          },
        ],
      },
    })

    const data = { age: 34 }
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

  test('process known properties when unknown properties are allowed', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: true,
        properties: [
          {
            type: 'literal',
            bail: true,
            fieldName: 'username',
            allowNull: false,
            isOptional: false,
            propertyName: 'userName',
            validations: [],
          },
        ],
      },
    })

    const data = { username: 'virk', age: 34 }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {
      userName: 'virk',
      age: 34,
    })

    // Mutation test:
    data.age = 22
    assert.deepEqual(output, {
      userName: 'virk',
      age: 34,
    })
  })

  test('allow unknown properties with nested object', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        bail: true,
        fieldName: '*',
        validations: [],
        propertyName: '*',
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: true,
        properties: [
          {
            type: 'object',
            groups: [],
            bail: true,
            fieldName: 'social',
            validations: [],
            propertyName: 'social',
            allowNull: false,
            isOptional: false,
            allowUnknownProperties: true,
            properties: [
              {
                type: 'literal',
                bail: true,
                fieldName: 'twitter_handle',
                allowNull: false,
                isOptional: false,
                propertyName: 'twitterHandle',
                validations: [],
              },
              {
                type: 'literal',
                bail: true,
                fieldName: 'github_username',
                allowNull: false,
                isOptional: false,
                propertyName: 'githubUsername',
                validations: [],
              },
            ],
          },
        ],
      },
    })

    const data = {
      social: {
        github_username: 'thetutlage',
        twitter_handle: 'AmanVirk1',
        soundcloud_account: 'foobar',
      },
      username: 'foo',
    }
    const meta = {}
    const refs = {}
    const errorReporter = new ErrorReporterFactory().create()

    const fn = compiler.compile()
    const output = await fn(data, meta, refs, errorReporter)
    assert.deepEqual(output, {
      social: {
        githubUsername: 'thetutlage',
        soundcloud_account: 'foobar',
        twitterHandle: 'AmanVirk1',
      },
      username: 'foo',
    })

    // Mutation test:
    data.social.github_username = 'foo'
    data.username = 'bar'
    assert.deepEqual(output, {
      social: {
        githubUsername: 'thetutlage',
        soundcloud_account: 'foobar',
        twitterHandle: 'AmanVirk1',
      },
      username: 'foo',
    })
  })
})
