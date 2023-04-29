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
import { defineRecordLoop } from '../../../../src/scripts/record/loop.js'

test.group('Scripts | define record loop', () => {
  test('wrap code inside record loop', ({ assert }) => {
    const jsOutput = defineRecordLoop({
      variableName: 'colors',
      loopCodeSnippet: 'console.log(colors_i)',
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `const colors_keys = Object.keys(colors.value);`,
      `const colors_keys_size = colors_keys.length;`,
      `for (let colors_key_i = 0; colors_key_i < colors_keys_size; colors_key_i++) {`,
      `const colors_i = colors_keys[colors_key_i];`,
      `console.log(colors_i)`,
      `}`,
    ])
  })
})
