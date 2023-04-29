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
import { defineFieldVariables } from '../../../../src/scripts/field/variables.js'

test.group('Scripts | define field variables', () => {
  test('get JS output for field variables', ({ assert }) => {
    const jsOutput = defineFieldVariables({
      variableName: 'username',
      valueExpression: `root['username']`,
      fieldPathExpression: `'username'`,
      fieldNameExpression: `'username'`,
      parentValueExpression: 'root',
      isArrayMember: false,
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `const username = defineValue(root['username'], {`,
      `data: root,`,
      `meta: meta,`,
      `fieldName: 'username',`,
      `fieldPath: 'username',`,
      `mutate: defineValue,`,
      `report: report,`,
      `isValid: true,`,
      `parent: root,`,
      `isArrayMember: false,`,
      '});',
    ])
  })

  test('get JS output with parse function', ({ assert }) => {
    const jsOutput = defineFieldVariables({
      variableName: 'username',
      valueExpression: `root['username']`,
      fieldPathExpression: `'username'`,
      fieldNameExpression: `'username'`,
      parentValueExpression: 'root',
      isArrayMember: false,
      parseFnRefId: 'ref://1',
    })

    assert.doesNotThrows(() => validateCode(jsOutput))
    assert.assertFormatted(jsOutput, [
      `const username = defineValue(refs['ref://1'](root['username']), {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'username',`,
      `  fieldPath: 'username',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
    ])
  })
})
