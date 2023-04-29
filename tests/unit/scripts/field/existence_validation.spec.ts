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
import { defineFieldExistenceValidations } from '../../../../src/scripts/field/existence_validations.js'

test.group('Scripts | define field existence valitions', () => {
  test('get JS output for field existence validations', ({ assert }) => {
    const jsOutput = defineFieldExistenceValidations({
      variableName: 'username',
      isOptional: false,
      allowNull: false,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [`ensureExists(username);`])
  })

  test('get JS output for optional field', ({ assert }) => {
    const jsOutput = defineFieldExistenceValidations({
      variableName: 'username',
      isOptional: true,
      allowNull: false,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [''])
  })

  test('get JS output for nullable field', ({ assert }) => {
    const jsOutput = defineFieldExistenceValidations({
      variableName: 'username',
      isOptional: false,
      allowNull: true,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, ['ensureIsDefined(username);'])
  })

  test('get JS output for optional and nullable field', ({ assert }) => {
    const jsOutput = defineFieldExistenceValidations({
      variableName: 'username',
      isOptional: true,
      allowNull: true,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [''])
  })
})
