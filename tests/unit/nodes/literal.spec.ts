/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Compiler } from '../../../src/compiler/main.js'
import { validateCode } from '../../../factories/code_validator.js'
import { getClosingOutput, getInitialOutput } from '../../../factories/output.js'

test.group('Literal node', () => {
  test('create JS output for a literal node', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'literal',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: 'username',
        propertyName: 'userName',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const userName_1 = defineValue(root['username'], {`,
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
      `ensureExists(userName_1);`,
      `if (userName_1.isValid && userName_1.isDefined) {`,
      `  refs['ref://2'].validator(userName_1.value, refs['ref://2'].options, userName_1);`,
      `}`,
      `if (userName_1.isDefined && userName_1.isValid) {`,
      `  out['userName'] = userName_1.value;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for nullable field', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'literal',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'username',
        propertyName: 'userName',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const userName_1 = defineValue(root['username'], {`,
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
      `ensureIsDefined(userName_1);`,
      `if (userName_1.isValid && userName_1.isDefined) {`,
      `  refs['ref://2'].validator(userName_1.value, refs['ref://2'].options, userName_1);`,
      `}`,
      `if (userName_1.isDefined && userName_1.isValid) {`,
      `  out['userName'] = userName_1.value;`,
      `}`,
      `else if(userName_1.value === null) {`,
      `  out['userName'] = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output with bail mode disabled', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'literal',
        allowNull: true,
        isOptional: false,
        bail: false,
        fieldName: 'username',
        propertyName: 'userName',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const userName_1 = defineValue(root['username'], {`,
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
      `ensureIsDefined(userName_1);`,
      `if (userName_1.isDefined) {`,
      `  refs['ref://2'].validator(userName_1.value, refs['ref://2'].options, userName_1);`,
      `}`,
      `if (userName_1.isDefined && userName_1.isValid) {`,
      `  out['userName'] = userName_1.value;`,
      `}`,
      `else if(userName_1.value === null) {`,
      `  out['userName'] = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })
})
