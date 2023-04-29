/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { validateCode } from '../../../../factories/code_validator.js'
import { defineFieldValidations } from '../../../../src/scripts/field/validations.js'

test.group('Scripts | define field validations', () => {
  test('get JS output for validations', ({ assert }) => {
    const jsOutput = defineFieldValidations({
      variableName: 'username',
      dropMissingCheck: false,
      validations: [
        {
          isAsync: false,
          ruleFnId: 'ref://1',
          implicit: false,
        },
      ],
      bail: true,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (username.isValid && username.isDefined) {`,
      `refs['ref://1'].validator(username.value, refs['ref://1'].options, username);`,
      `}`,
    ])
  })

  test('get JS output with bail disabled', ({ assert }) => {
    const jsOutput = defineFieldValidations({
      variableName: 'username',
      dropMissingCheck: false,
      validations: [
        {
          isAsync: false,
          ruleFnId: 'ref://1',
          implicit: false,
        },
      ],
      bail: false,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (username.isDefined) {`,
      `  refs['ref://1'].validator(username.value, refs['ref://1'].options, username);`,
      `}`,
    ])
  })

  test('get JS output for implict rule', ({ assert }) => {
    const jsOutput = defineFieldValidations({
      variableName: 'username',
      dropMissingCheck: false,
      validations: [
        {
          isAsync: false,
          ruleFnId: 'ref://1',
          implicit: true,
        },
      ],
      bail: true,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (username.isValid) {`,
      `  refs['ref://1'].validator(username.value, refs['ref://1'].options, username);`,
      `}`,
    ])
  })

  test('get JS output with bail disabled and for implict rule', ({ assert }) => {
    const jsOutput = defineFieldValidations({
      variableName: 'username',
      dropMissingCheck: false,
      validations: [
        {
          isAsync: false,
          ruleFnId: 'ref://1',
          implicit: true,
        },
      ],
      bail: false,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `refs['ref://1'].validator(username.value, refs['ref://1'].options, username);`,
    ])
  })

  test('get JS output for multiple validations', ({ assert }) => {
    const jsOutput = defineFieldValidations({
      variableName: 'username',
      dropMissingCheck: false,
      validations: [
        {
          isAsync: false,
          ruleFnId: 'ref://1',
          implicit: false,
        },
        {
          isAsync: false,
          ruleFnId: 'ref://2',
          implicit: false,
        },
      ],
      bail: true,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (username.isValid && username.isDefined) {`,
      `refs['ref://1'].validator(username.value, refs['ref://1'].options, username);`,
      `}`,
      `if (username.isValid && username.isDefined) {`,
      `refs['ref://2'].validator(username.value, refs['ref://2'].options, username);`,
      `}`,
    ])
  })
})

test.group('Scripts | async | define field validations', () => {
  test('get JS output for validations', ({ assert }) => {
    const jsOutput = defineFieldValidations({
      variableName: 'username',
      dropMissingCheck: false,
      validations: [
        {
          isAsync: true,
          ruleFnId: 'ref://1',
          implicit: false,
        },
      ],
      bail: true,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (username.isValid && username.isDefined) {`,
      `  await refs['ref://1'].validator(username.value, refs['ref://1'].options, username);`,
      `}`,
    ])
  })

  test('get JS output with bail disabled', ({ assert }) => {
    const jsOutput = defineFieldValidations({
      variableName: 'username',
      dropMissingCheck: false,
      validations: [
        {
          isAsync: true,
          ruleFnId: 'ref://1',
          implicit: false,
        },
      ],
      bail: false,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (username.isDefined) {`,
      ` await refs['ref://1'].validator(username.value, refs['ref://1'].options, username);`,
      `}`,
    ])
  })

  test('get JS output for implict rule', ({ assert }) => {
    const jsOutput = defineFieldValidations({
      variableName: 'username',
      dropMissingCheck: false,
      validations: [
        {
          isAsync: true,
          ruleFnId: 'ref://1',
          implicit: true,
        },
      ],
      bail: true,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (username.isValid) {`,
      `await refs['ref://1'].validator(username.value, refs['ref://1'].options, username);`,
      `}`,
    ])
  })

  test('get JS output with bail disabled and for implict rule', ({ assert }) => {
    const jsOutput = defineFieldValidations({
      variableName: 'username',
      dropMissingCheck: false,
      validations: [
        {
          isAsync: true,
          ruleFnId: 'ref://1',
          implicit: true,
        },
      ],
      bail: false,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `await refs['ref://1'].validator(username.value, refs['ref://1'].options, username);`,
    ])
  })

  test('get JS output for multiple validations', ({ assert }) => {
    const jsOutput = defineFieldValidations({
      variableName: 'username',
      dropMissingCheck: false,
      validations: [
        {
          isAsync: true,
          ruleFnId: 'ref://1',
          implicit: false,
        },
        {
          isAsync: true,
          ruleFnId: 'ref://2',
          implicit: false,
        },
      ],
      bail: true,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (username.isValid && username.isDefined) {`,
      `  await refs['ref://1'].validator(username.value, refs['ref://1'].options, username);`,
      `}`,
      `if (username.isValid && username.isDefined) {`,
      `  await refs['ref://2'].validator(username.value, refs['ref://2'].options, username);`,
      `}`,
    ])
  })
})
