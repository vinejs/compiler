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
import { defineArrayLoop } from '../../../../src/scripts/array/loop.js'

test.group('Scripts | define array loop', () => {
  test('wrap code inside array loop', ({ assert }) => {
    const jsOutput = defineArrayLoop({
      variableName: 'contacts',
      loopCodeSnippet: 'console.log(contacts_i)',
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `const contacts_items_size = contacts.value.length;`,
      `for (let contacts_i = 0; contacts_i < contacts_items_size; contacts_i++) {`,
      `console.log(contacts_i)`,
      `}`,
    ])
  })

  test('wrap code inside array loop with a custom starting index', ({ assert }) => {
    const jsOutput = defineArrayLoop({
      variableName: 'contacts',
      startingIndex: 3,
      loopCodeSnippet: 'console.log(contacts_i)',
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `const contacts_items_size = contacts.value.length;`,
      `for (let contacts_i = 3; contacts_i < contacts_items_size; contacts_i++) {`,
      `console.log(contacts_i)`,
      `}`,
    ])
  })
})
