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

test.group('Record node', () => {
  test('create JS output for record node', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: 'colors',
        propertyName: 'colorPalette',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        each: {
          type: 'literal',
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          bail: false,
          validations: [],
        },
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const colorPalette_1 = defineValue(root['colors'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'colors',`,
      `  fieldPath: 'colors',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(colorPalette_1);`,
      `if (ensureIsObject(colorPalette_1)) {`,
      `if (colorPalette_1.isValid) {`,
      `  refs['ref://2'].validator(colorPalette_1.value, refs['ref://2'].options, colorPalette_1);`,
      `}`,
      `if (colorPalette_1.isValid) {`,
      `out['colorPalette'] = {};`,
      `const colorPalette_1_keys = Object.keys(colorPalette_1.value);`,
      `const colorPalette_1_keys_size = colorPalette_1_keys.length;`,
      `for (let colorPalette_1_key_i = 0; colorPalette_1_key_i < colorPalette_1_keys_size; colorPalette_1_key_i++) {`,
      `const colorPalette_1_i = colorPalette_1_keys[colorPalette_1_key_i];`,
      `const colorPalette_1_item = defineValue(colorPalette_1.value[colorPalette_1_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: colorPalette_1_i,`,
      `  fieldPath: 'colors' + '.' + colorPalette_1_i,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: colorPalette_1.value,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(colorPalette_1_item);`,
      `if (colorPalette_1_item.isDefined && colorPalette_1_item.isValid) {`,
      `  out['colorPalette'][colorPalette_1_i] = colorPalette_1_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for nullable record node', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'colors',
        propertyName: 'colorPalette',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        each: {
          type: 'literal',
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          bail: false,
          validations: [],
        },
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const colorPalette_1 = defineValue(root['colors'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'colors',`,
      `  fieldPath: 'colors',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(colorPalette_1);`,
      `if (ensureIsObject(colorPalette_1)) {`,
      `if (colorPalette_1.isValid) {`,
      `  refs['ref://2'].validator(colorPalette_1.value, refs['ref://2'].options, colorPalette_1);`,
      `}`,
      `if (colorPalette_1.isValid) {`,
      `out['colorPalette'] = {};`,
      `const colorPalette_1_keys = Object.keys(colorPalette_1.value);`,
      `const colorPalette_1_keys_size = colorPalette_1_keys.length;`,
      `for (let colorPalette_1_key_i = 0; colorPalette_1_key_i < colorPalette_1_keys_size; colorPalette_1_key_i++) {`,
      `const colorPalette_1_i = colorPalette_1_keys[colorPalette_1_key_i];`,
      `const colorPalette_1_item = defineValue(colorPalette_1.value[colorPalette_1_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: colorPalette_1_i,`,
      `  fieldPath: 'colors' + '.' + colorPalette_1_i,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: colorPalette_1.value,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(colorPalette_1_item);`,
      `if (colorPalette_1_item.isDefined && colorPalette_1_item.isValid) {`,
      `  out['colorPalette'][colorPalette_1_i] = colorPalette_1_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      `else if(colorPalette_1.value === null) {`,
      `  out['colorPalette'] = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output without record validations', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'colors',
        propertyName: 'colorPalette',
        validations: [],
        each: {
          type: 'literal',
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          bail: false,
          validations: [],
        },
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const colorPalette_1 = defineValue(root['colors'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'colors',`,
      `  fieldPath: 'colors',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(colorPalette_1);`,
      `if (ensureIsObject(colorPalette_1)) {`,
      `if (colorPalette_1.isValid) {`,
      `out['colorPalette'] = {};`,
      `const colorPalette_1_keys = Object.keys(colorPalette_1.value);`,
      `const colorPalette_1_keys_size = colorPalette_1_keys.length;`,
      `for (let colorPalette_1_key_i = 0; colorPalette_1_key_i < colorPalette_1_keys_size; colorPalette_1_key_i++) {`,
      `const colorPalette_1_i = colorPalette_1_keys[colorPalette_1_key_i];`,
      `const colorPalette_1_item = defineValue(colorPalette_1.value[colorPalette_1_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: colorPalette_1_i,`,
      `  fieldPath: 'colors' + '.' + colorPalette_1_i,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: colorPalette_1.value,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(colorPalette_1_item);`,
      `if (colorPalette_1_item.isDefined && colorPalette_1_item.isValid) {`,
      `  out['colorPalette'][colorPalette_1_i] = colorPalette_1_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      `else if(colorPalette_1.value === null) {`,
      `  out['colorPalette'] = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output with record children validations', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'colors',
        propertyName: 'colorPalette',
        validations: [],
        each: {
          type: 'literal',
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          bail: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
        },
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const colorPalette_1 = defineValue(root['colors'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'colors',`,
      `  fieldPath: 'colors',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(colorPalette_1);`,
      `if (ensureIsObject(colorPalette_1)) {`,
      `if (colorPalette_1.isValid) {`,
      `out['colorPalette'] = {};`,
      `const colorPalette_1_keys = Object.keys(colorPalette_1.value);`,
      `const colorPalette_1_keys_size = colorPalette_1_keys.length;`,
      `for (let colorPalette_1_key_i = 0; colorPalette_1_key_i < colorPalette_1_keys_size; colorPalette_1_key_i++) {`,
      `const colorPalette_1_i = colorPalette_1_keys[colorPalette_1_key_i];`,
      `const colorPalette_1_item = defineValue(colorPalette_1.value[colorPalette_1_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: colorPalette_1_i,`,
      `  fieldPath: 'colors' + '.' + colorPalette_1_i,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: colorPalette_1.value,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(colorPalette_1_item);`,
      `if (colorPalette_1_item.isDefined) {`,
      `  refs['ref://2'].validator(colorPalette_1_item.value, refs['ref://2'].options, colorPalette_1_item);`,
      `}`,
      `if (colorPalette_1_item.isDefined && colorPalette_1_item.isValid) {`,
      `  out['colorPalette'][colorPalette_1_i] = colorPalette_1_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      `else if(colorPalette_1.value === null) {`,
      `  out['colorPalette'] = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for record node with bail mode disabled', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'record',
        allowNull: true,
        isOptional: false,
        bail: false,
        fieldName: 'colors',
        propertyName: 'colorPalette',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        each: {
          type: 'literal',
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          bail: false,
          validations: [],
        },
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const colorPalette_1 = defineValue(root['colors'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'colors',`,
      `  fieldPath: 'colors',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(colorPalette_1);`,
      `if (ensureIsObject(colorPalette_1)) {`,
      `refs['ref://2'].validator(colorPalette_1.value, refs['ref://2'].options, colorPalette_1);`,
      `out['colorPalette'] = {};`,
      `const colorPalette_1_keys = Object.keys(colorPalette_1.value);`,
      `const colorPalette_1_keys_size = colorPalette_1_keys.length;`,
      `for (let colorPalette_1_key_i = 0; colorPalette_1_key_i < colorPalette_1_keys_size; colorPalette_1_key_i++) {`,
      `const colorPalette_1_i = colorPalette_1_keys[colorPalette_1_key_i];`,
      `const colorPalette_1_item = defineValue(colorPalette_1.value[colorPalette_1_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: colorPalette_1_i,`,
      `  fieldPath: 'colors' + '.' + colorPalette_1_i,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: colorPalette_1.value,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(colorPalette_1_item);`,
      `if (colorPalette_1_item.isDefined && colorPalette_1_item.isValid) {`,
      `  out['colorPalette'][colorPalette_1_i] = colorPalette_1_item.value;`,
      `}`,
      `}`,
      `}`,
      `else if(colorPalette_1.value === null) {`,
      `  out['colorPalette'] = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })
})
