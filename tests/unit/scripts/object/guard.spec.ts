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
import { defineObjectGuard } from '../../../../src/scripts/object/guard.js'

test.group('Scripts | define object guard', () => {
  test('wrap code inside object guard conditional', ({ assert }) => {
    const jsOutput = defineObjectGuard({
      variableName: 'profile',
      guardedCodeSnippet: 'console.log(profile)',
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (ensureIsObject(profile)) {`,
      `console.log(profile)`,
      `}`,
    ])
  })
})
