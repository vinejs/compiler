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
import { defineObjectInitialOutput } from '../../../../src/scripts/object/initial_output.js'

test.group('Scripts | define object initial output', () => {
  test('define initial object for object', ({ assert }) => {
    const jsOutput = defineObjectInitialOutput({
      outputExpression: `out['profile']`,
      outputValueExpression: `{}`,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [`out['profile'] = {};`])
  })
})
