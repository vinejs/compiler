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
import { callParseFunction } from '../../../../src/scripts/union/parse.js'

test.group('Scripts | call parse function', () => {
  test('get snippet to mutate the field value', ({ assert }) => {
    const jsOutput = callParseFunction({
      variableName: 'colors',
      parseFnRefId: 'ref://1',
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [`colors.value = refs['ref://1'](colors.value);`])
  })

  test('return empty string when parseFnRefId is not defined', ({ assert }) => {
    const jsOutput = callParseFunction({
      variableName: 'colors',
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [''])
  })
})
