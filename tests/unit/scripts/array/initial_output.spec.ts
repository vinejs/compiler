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
import { defineArrayInitialOutput } from '../../../../src/scripts/array/initial_output.js'

test.group('Scripts | define array initial output', () => {
  test('define initial output for array', ({ assert }) => {
    const jsOutput = defineArrayInitialOutput({
      outputExpression: `out['contacts']`,
      outputValueExpression: `[]`,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [`out['contacts'] = [];`])
  })
})
