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
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
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
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  name: '',`,
      `  wildCardPath: '',`,
      `  getFieldPath: memo(() => {`,
      `    return '';`,
      `  }),`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isValid) {`,
      `const root_item_out = {};`,
      `out = root_item_out;`,
      `const root_item_keys = Object.keys(root_item.value);`,
      `const root_item_keys_size = root_item_keys.length;`,
      `for (let root_item_key_i = 0; root_item_key_i < root_item_keys_size; root_item_key_i++) {`,
      `const root_item_i = root_item_keys[root_item_key_i];`,
      `const root_item_item = defineValue(root_item.value[root_item_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  name: root_item_i,`,
      `  wildCardPath: '*',`,
      `  getFieldPath: memo(() => {`,
      `    return root_item_i;`,
      `  }),`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item_item);`,
      `if (root_item_item.isDefined && root_item_item.isValid) {`,
      `  root_item_out[root_item_i] = root_item_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for nullable record node', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
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
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  name: '',`,
      `  wildCardPath: '',`,
      `  getFieldPath: memo(() => {`,
      `    return '';`,
      `  }),`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isValid) {`,
      `const root_item_out = {};`,
      `out = root_item_out;`,
      `const root_item_keys = Object.keys(root_item.value);`,
      `const root_item_keys_size = root_item_keys.length;`,
      `for (let root_item_key_i = 0; root_item_key_i < root_item_keys_size; root_item_key_i++) {`,
      `const root_item_i = root_item_keys[root_item_key_i];`,
      `const root_item_item = defineValue(root_item.value[root_item_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  name: root_item_i,`,
      `  wildCardPath: '*',`,
      `  getFieldPath: memo(() => {`,
      `    return root_item_i;`,
      `  }),`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item_item);`,
      `if (root_item_item.isDefined && root_item_item.isValid) {`,
      `  root_item_out[root_item_i] = root_item_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      `else if(root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output without record validations', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
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
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  name: '',`,
      `  wildCardPath: '',`,
      `  getFieldPath: memo(() => {`,
      `    return '';`,
      `  }),`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `const root_item_out = {};`,
      `out = root_item_out;`,
      `const root_item_keys = Object.keys(root_item.value);`,
      `const root_item_keys_size = root_item_keys.length;`,
      `for (let root_item_key_i = 0; root_item_key_i < root_item_keys_size; root_item_key_i++) {`,
      `const root_item_i = root_item_keys[root_item_key_i];`,
      `const root_item_item = defineValue(root_item.value[root_item_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  name: root_item_i,`,
      `  wildCardPath: '*',`,
      `  getFieldPath: memo(() => {`,
      `    return root_item_i;`,
      `  }),`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item_item);`,
      `if (root_item_item.isDefined && root_item_item.isValid) {`,
      `  root_item_out[root_item_i] = root_item_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      `else if(root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output with record children validations', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
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
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  name: '',`,
      `  wildCardPath: '',`,
      `  getFieldPath: memo(() => {`,
      `    return '';`,
      `  }),`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `const root_item_out = {};`,
      `out = root_item_out;`,
      `const root_item_keys = Object.keys(root_item.value);`,
      `const root_item_keys_size = root_item_keys.length;`,
      `for (let root_item_key_i = 0; root_item_key_i < root_item_keys_size; root_item_key_i++) {`,
      `const root_item_i = root_item_keys[root_item_key_i];`,
      `const root_item_item = defineValue(root_item.value[root_item_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  name: root_item_i,`,
      `  wildCardPath: '*',`,
      `  getFieldPath: memo(() => {`,
      `    return root_item_i;`,
      `  }),`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item_item);`,
      `if (root_item_item.isDefined) {`,
      `  refs['ref://2'].validator(root_item_item.value, refs['ref://2'].options, root_item_item);`,
      `}`,
      `if (root_item_item.isDefined && root_item_item.isValid) {`,
      `  root_item_out[root_item_i] = root_item_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      `else if(root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for record node with bail mode disabled', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'record',
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
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  name: '',`,
      `  wildCardPath: '',`,
      `  getFieldPath: memo(() => {`,
      `    return '';`,
      `  }),`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `const root_item_out = {};`,
      `out = root_item_out;`,
      `const root_item_keys = Object.keys(root_item.value);`,
      `const root_item_keys_size = root_item_keys.length;`,
      `for (let root_item_key_i = 0; root_item_key_i < root_item_keys_size; root_item_key_i++) {`,
      `const root_item_i = root_item_keys[root_item_key_i];`,
      `const root_item_item = defineValue(root_item.value[root_item_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  name: root_item_i,`,
      `  wildCardPath: '*',`,
      `  getFieldPath: memo(() => {`,
      `    return root_item_i;`,
      `  }),`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item_item);`,
      `if (root_item_item.isDefined && root_item_item.isValid) {`,
      `  root_item_out[root_item_i] = root_item_item.value;`,
      `}`,
      `}`,
      `}`,
      `else if(root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })
})
