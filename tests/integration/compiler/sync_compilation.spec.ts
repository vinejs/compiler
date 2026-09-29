/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Compiler } from '../../../index.js'
import type { LiteralNode, ObjectNode, Refs, ValidationNode } from '../../../src/types.js'
import { ErrorReporterFactory } from '../../../factories/error_reporter.js'
import { MessagesProviderFactory } from '../../../factories/messages_provider.js'

function literal(fieldName: string, validations: ValidationNode[] = []): LiteralNode {
  return {
    type: 'literal',
    bail: true,
    fieldName,
    validations,
    propertyName: fieldName,
    allowNull: false,
    isOptional: false,
  }
}

function object(fieldName: string, properties: ObjectNode['properties']): ObjectNode {
  return {
    type: 'object',
    groups: [],
    bail: true,
    fieldName,
    validations: [],
    propertyName: fieldName,
    allowNull: false,
    isOptional: false,
    properties,
    allowUnknownProperties: false,
  }
}

function executeSync(compiler: Compiler, data: any, refs: Refs = {}) {
  return compiler.compileSync()(
    data,
    {},
    refs,
    new MessagesProviderFactory().create(),
    new ErrorReporterFactory().create()
  )
}

test.group('Synchronous compilation', () => {
  test('returns the validated value directly', ({ assert }) => {
    let ruleCalled = false
    const compiler = new Compiler({
      type: 'root',
      schema: literal('*', [
        {
          name: 'string',
          ruleFnId: 'ref://1',
          implicit: false,
          isAsync: false,
        },
      ]),
    })
    const refs: Refs = {
      'ref://1': {
        validator(value) {
          assert.equal(value, 'virk')
          ruleCalled = true
        },
      },
    }

    const output = executeSync(compiler, 'virk', refs)

    assert.equal(output, 'virk')
    assert.isFalse(output instanceof Promise)
    assert.isTrue(ruleCalled)
  })

  test('throws validation errors directly', ({ assert }) => {
    assert.plan(2)
    const compiler = new Compiler({ type: 'root', schema: literal('username') })

    try {
      executeSync(compiler, undefined)
    } catch (error) {
      assert.equal(error.message, 'Validation failure')
      assert.deepEqual(error.messages, ['value is required'])
    }
  })

  test('validates nested objects and arrays synchronously', ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: object('*', [
        object('profile', [
          literal('name'),
          {
            type: 'array',
            bail: true,
            fieldName: 'tags',
            validations: [],
            propertyName: 'tags',
            allowNull: false,
            isOptional: false,
            each: literal('*'),
          },
        ]),
      ]),
    })

    const data = { profile: { name: 'virk', tags: ['maintainer', 'author'] } }
    const output = executeSync(compiler, data)

    assert.deepEqual(output, data)
    assert.notStrictEqual(output, data)
    assert.notStrictEqual(output.profile, data.profile)
    assert.notStrictEqual(output.profile.tags, data.profile.tags)
  })

  test('rejects async rules during compilation', ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: object('*', [
        literal('email', [
          {
            name: 'unique',
            ruleFnId: 'ref://1',
            implicit: false,
            isAsync: true,
          },
        ]),
      ]),
    })

    assert.throws(
      () => compiler.compileSync(),
      'Cannot compile validation rule "unique" for field "email" synchronously because it is async'
    )
  })

  test('rejects thenables returned by rules marked as synchronous', ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: object('*', [
        literal('email', [
          {
            name: 'unique',
            ruleFnId: 'ref://1',
            implicit: false,
            isAsync: false,
          },
        ]),
      ]),
    })
    const refs: Refs = {
      'ref://1': {
        validator() {
          return { then() {} }
        },
      },
    }

    assert.throws(
      () => executeSync(compiler, { email: 'romain@adonisjs.com' }, refs),
      'Validation rule "unique" for field "email" returned a promise or thenable while marked as synchronous'
    )
  })

  test('handles rejections of thenables returned by rules marked as synchronous', ({ assert }) => {
    let rejectionHandler: unknown
    const compiler = new Compiler({
      type: 'root',
      schema: object('*', [
        {
          type: 'array',
          bail: true,
          fieldName: 'emails',
          validations: [],
          propertyName: 'emails',
          allowNull: false,
          isOptional: false,
          each: literal('*', [
            {
              name: 'unique',
              ruleFnId: 'ref://1',
              implicit: false,
              isAsync: false,
            },
          ]),
        },
      ]),
    })
    const refs: Refs = {
      'ref://1': {
        validator() {
          return {
            then(_: unknown, onRejected: unknown) {
              rejectionHandler = onRejected
            },
          }
        },
      },
    }

    assert.throws(
      () => executeSync(compiler, { emails: ['romain@adonisjs.com'] }, refs),
      'Validation rule "unique" for field "emails.0" returned a promise or thenable while marked as synchronous'
    )
    assert.isFunction(rejectionHandler)
  })

  test('keeps compile asynchronous and awaits async rules', async ({ assert }) => {
    let ruleCompleted = false
    const compiler = new Compiler({
      type: 'root',
      schema: literal('*', [
        {
          name: 'delayed',
          ruleFnId: 'ref://1',
          implicit: false,
          isAsync: true,
        },
      ]),
    })
    const refs: Refs = {
      'ref://1': {
        async validator() {
          await Promise.resolve()
          ruleCompleted = true
        },
      },
    }
    const validate = compiler.compile()

    const pendingOutput = validate(
      'virk',
      {},
      refs,
      new MessagesProviderFactory().create(),
      new ErrorReporterFactory().create()
    )

    assert.instanceOf(pendingOutput, Promise)
    assert.isFalse(ruleCompleted)
    assert.equal(await pendingOutput, 'virk')
    assert.isTrue(ruleCompleted)
  })
})
