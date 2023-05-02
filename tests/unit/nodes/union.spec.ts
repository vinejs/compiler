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
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'union',
        fieldName: '*',
        propertyName: '*',
        children: [
          {
            conditionalFnRefId: 'ref://1',
            schema: {
              type: 'literal',
              fieldName: '*',
              allowNull: false,
              isOptional: false,
              propertyName: '*',
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
              fieldName: '*',
              allowNull: false,
              isOptional: false,
              propertyName: '*',
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
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `data: root,`,
      `meta: meta,`,
      `fieldName: '',`,
      `fieldPath: '',`,
      `mutate: defineValue,`,
      `report: report,`,
      `isValid: true,`,
      `parent: root,`,
      `isArrayMember: false,`,
      '});',
      `if(refs['ref://1'](root_item.value, root_item)) {`,
      `ensureExists(root_item);`,
      `if (root_item.isValid && root_item.isDefined) {`,
      `refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isDefined && root_item.isValid) {`,
      `out = root_item.value;`,
      `}`,
      `}`,
      `else if(refs['ref://3'](root_item.value, root_item)) {`,
      `ensureExists(root_item);`,
      `if (root_item.isValid && root_item.isDefined) {`,
      `refs['ref://4'].validator(root_item.value, refs['ref://4'].options, root_item);`,
      `}`,
      `if (root_item.isDefined && root_item.isValid) {`,
      `out = root_item.value;`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })
})
