/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EOL } from 'node:os'
import { test } from '@japa/runner'
import { validateCode } from '../../../../factories/code_validator.js'
import { defineFieldNullOutput } from '../../../../src/scripts/field/null_output.js'

test.group('Scripts | define field null output', () => {
  test('get JS output for writing null output value', ({ assert }) => {
    const jsOutput = defineFieldNullOutput({
      variableName: 'username',
      allowNull: true,
      outputExpression: `out['username']`,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if(username.value === null) {`,
      `  out['username'] = null;`,
      `}`,
    ])
  })

  test('get JS output when allowNull is disabled', ({ assert }) => {
    const jsOutput = defineFieldNullOutput({
      variableName: 'username',
      allowNull: false,
      outputExpression: `out['username']`,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput.split(EOL), [``])
  })

  test('transform null value using transform ref id', ({ assert }) => {
    const jsOutput = defineFieldNullOutput({
      variableName: 'username',
      allowNull: true,
      transformFnRefId: 'ref://1',
      outputExpression: `out['username']`,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if(username.value === null) {`,
      `out['username'] = refs['ref://1'](null, username);`,
      `}`,
    ])
  })

  test('generate else if conditional', ({ assert }) => {
    const jsOutput = `if (foo) {} ${defineFieldNullOutput({
      variableName: 'username',
      allowNull: true,
      transformFnRefId: 'ref://1',
      conditional: 'else if',
      outputExpression: `out['username']`,
    })}`

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `if (foo) {} else if(username.value === null) {`,
      `out['username'] = refs['ref://1'](null, username);`,
      `}`,
    ])
  })
})
