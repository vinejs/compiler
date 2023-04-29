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

test.group('Union node', () => {
  test('create JS output for a union node', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'union',
        fieldName: 'username',
        propertyName: 'userName',
        children: [
          {
            conditionalFnRefId: 'ref://1',
            schema: {
              type: 'literal',
              fieldName: 'username',
              allowNull: false,
              isOptional: false,
              propertyName: 'userName',
              bail: true,
              validations: [
                {
                  ruleFnId: 'ref://2',
                  implicit: false,
                  isAsync: false,
                },
              ],
            },
          },
          {
            conditionalFnRefId: 'ref://3',
            schema: {
              type: 'literal',
              fieldName: 'username',
              allowNull: false,
              isOptional: false,
              propertyName: 'userName',
              bail: true,
              validations: [
                {
                  ruleFnId: 'ref://4',
                  implicit: false,
                  isAsync: false,
                },
              ],
            },
          },
        ],
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const userName_1 = defineValue(root['username'], {`,
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
      `if(refs['ref://1'](userName_1.value, userName_1)) {`,
      `ensureExists(userName_1);`,
      `if (userName_1.isValid && userName_1.isDefined) {`,
      `refs['ref://2'].validator(userName_1.value, refs['ref://2'].options, userName_1);`,
      `}`,
      `if (userName_1.isDefined && userName_1.isValid) {`,
      `out['userName'] = userName_1.value;`,
      `}`,
      `}`,
      `else if(refs['ref://3'](userName_1.value, userName_1)) {`,
      `ensureExists(userName_1);`,
      `if (userName_1.isValid && userName_1.isDefined) {`,
      `refs['ref://4'].validator(userName_1.value, refs['ref://4'].options, userName_1);`,
      `}`,
      `if (userName_1.isDefined && userName_1.isValid) {`,
      `out['userName'] = userName_1.value;`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })
})
