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
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
      },
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: '',`,
      `  fieldPath: '',`,
      `  wildCardPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item);`,
      `if (root_item.isValid && root_item.isDefined) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isDefined && root_item.isValid) {`,
      `  out = root_item.value;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for nullable field', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
      },
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: '',`,
      `  fieldPath: '',`,
      `  wildCardPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (root_item.isValid && root_item.isDefined) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isDefined && root_item.isValid) {`,
      `  out = root_item.value;`,
      `} else if (root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output with bail mode disabled', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'literal',
        allowNull: true,
        isOptional: false,
        bail: false,
        fieldName: '*',
        propertyName: '*',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
      },
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: '',`,
      `  fieldPath: '',`,
      `  wildCardPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (root_item.isDefined) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isDefined && root_item.isValid) {`,
      `  out = root_item.value;`,
      `} else if (root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })
})
