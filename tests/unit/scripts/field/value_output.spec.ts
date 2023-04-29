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
import { defineFieldValueOutput } from '../../../../src/scripts/field/value_output.js'

test.group('Scripts | define field value output', () => {
  test('get JS output for writing output value', ({ assert }) => {
    const jsOutput = defineFieldValueOutput({
      variableName: 'username',
      outputExpression: `out['username']`,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (username.isDefined && username.isValid) {`,
      `out['username'] = username.value;`,
      `}`,
    ])
  })

  test('get JS output for writing output value with transform function', ({ assert }) => {
    const jsOutput = defineFieldValueOutput({
      variableName: 'username',
      transformFnRefId: 'ref://2',
      outputExpression: `out['username']`,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (username.isDefined && username.isValid) {`,
      `out['username'] = refs['ref://2'](username.value, username);`,
      `}`,
    ])
  })
})
