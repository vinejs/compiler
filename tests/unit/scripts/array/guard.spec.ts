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
import { defineArrayGuard } from '../../../../src/scripts/array/guard.js'

test.group('Scripts | define array guard', () => {
  test('wrap code inside array guard conditional', ({ assert }) => {
    const jsOutput = defineArrayGuard({
      variableName: 'contacts',
      guardedCodeSnippet: 'console.log(contacts)',
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (ensureIsArray(contacts)) {`,
      `console.log(contacts)`,
      `}`,
    ])
  })
})
