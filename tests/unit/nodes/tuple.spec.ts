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

test.group('Tuple node', () => {
  test('create JS output for tuple node', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        allowUnknownProperties: false,
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        properties: [
          {
            type: 'literal',
            fieldName: '0',
            propertyName: '0',
            allowNull: false,
            isOptional: false,
            bail: false,
            validations: [],
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
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item);`,
      `if (ensureIsArray(root_item)) {`,
      `if (root_item.isValid) {`,
      `refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isValid) {`,
      `out = [];`,
      `const root_item_item_0 = defineValue(root_item.value[0], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 0,`,
      `  fieldPath: '0',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(root_item_item_0);`,
      `if (root_item_item_0.isDefined && root_item_item_0.isValid) {`,
      `out[0] = root_item_item_0.value;`,
      `}`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for nullable tuple node', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        allowUnknownProperties: false,
        validations: [],
        properties: [
          {
            type: 'literal',
            fieldName: '0',
            propertyName: '0',
            allowNull: false,
            isOptional: false,
            bail: false,
            validations: [],
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
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsArray(root_item)) {`,
      `if (root_item.isValid) {`,
      `out = [];`,
      `const root_item_item_0 = defineValue(root_item.value[0], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 0,`,
      `  fieldPath: '0',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(root_item_item_0);`,
      `if (root_item_item_0.isDefined && root_item_item_0.isValid) {`,
      `out[0] = root_item_item_0.value;`,
      `}`,
      `}`,
      `} else if (root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for tuple node when unknownProperties are allowed', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        allowUnknownProperties: true,
        validations: [],
        properties: [
          {
            type: 'literal',
            fieldName: '0',
            propertyName: '0',
            allowNull: false,
            isOptional: false,
            bail: false,
            validations: [],
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
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsArray(root_item)) {`,
      `if (root_item.isValid) {`,
      `out = copyProperties(root_item.value);`,
      `const root_item_item_0 = defineValue(root_item.value[0], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 0,`,
      `  fieldPath: '0',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(root_item_item_0);`,
      `if (root_item_item_0.isDefined && root_item_item_0.isValid) {`,
      `out[0] = root_item_item_0.value;`,
      `}`,
      `}`,
      `} else if (root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for tuple node without array validations', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        allowUnknownProperties: false,
        validations: [],
        properties: [
          {
            type: 'literal',
            fieldName: '0',
            propertyName: '0',
            allowNull: false,
            isOptional: false,
            bail: false,
            validations: [],
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
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item);`,
      `if (ensureIsArray(root_item)) {`,
      `if (root_item.isValid) {`,
      `out = [];`,
      `const root_item_item_0 = defineValue(root_item.value[0], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 0,`,
      `  fieldPath: '0',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(root_item_item_0);`,
      `if (root_item_item_0.isDefined && root_item_item_0.isValid) {`,
      `out[0] = root_item_item_0.value;`,
      `}`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for tuple node with bail mode disabled', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'tuple',
        allowNull: false,
        isOptional: false,
        bail: false,
        fieldName: '*',
        propertyName: '*',
        allowUnknownProperties: false,
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        properties: [
          {
            type: 'literal',
            fieldName: '0',
            propertyName: '0',
            allowNull: false,
            isOptional: false,
            bail: false,
            validations: [],
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
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item);`,
      `if (ensureIsArray(root_item)) {`,
      `refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `out = [];`,
      `const root_item_item_0 = defineValue(root_item.value[0], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 0,`,
      `  fieldPath: '0',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(root_item_item_0);`,
      `if (root_item_item_0.isDefined && root_item_item_0.isValid) {`,
      `out[0] = root_item_item_0.value;`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })
})
