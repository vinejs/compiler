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

test.group('Array node', () => {
  test('create JS output for array node', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'array',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: 'marks',
        propertyName: 'marks',
        allowUnknownProperties: false,
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
      `const marks_1 = defineValue(root['marks'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'marks',`,
      `  fieldPath: 'marks',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(marks_1);`,
      `if (ensureIsArray(marks_1)) {`,
      `if (marks_1.isValid) {`,
      `  refs['ref://2'].validator(marks_1.value, refs['ref://2'].options, marks_1);`,
      `}`,
      `if (marks_1.isValid) {`,
      `out['marks'] = [];`,
      `const marks_1_items_size = marks_1.value.length;`,
      `for (let marks_1_i = 0; marks_1_i < marks_1_items_size; marks_1_i++) {`,
      `const marks_1_item = defineValue(marks_1.value[marks_1_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: marks_1_i,`,
      `  fieldPath: 'marks' + '.' + marks_1_i,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: marks_1.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(marks_1_item);`,
      `if (marks_1_item.isDefined && marks_1_item.isValid) {`,
      `  out['marks'][marks_1_i] = marks_1_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for nullable array node', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'array',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'marks',
        propertyName: 'marks',
        allowUnknownProperties: false,
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
      `const marks_1 = defineValue(root['marks'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'marks',`,
      `  fieldPath: 'marks',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(marks_1);`,
      `if (ensureIsArray(marks_1)) {`,
      `if (marks_1.isValid) {`,
      `  refs['ref://2'].validator(marks_1.value, refs['ref://2'].options, marks_1);`,
      `}`,
      `if (marks_1.isValid) {`,
      `out['marks'] = [];`,
      `const marks_1_items_size = marks_1.value.length;`,
      `for (let marks_1_i = 0; marks_1_i < marks_1_items_size; marks_1_i++) {`,
      `const marks_1_item = defineValue(marks_1.value[marks_1_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: marks_1_i,`,
      `  fieldPath: 'marks' + '.' + marks_1_i,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: marks_1.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(marks_1_item);`,
      `if (marks_1_item.isDefined && marks_1_item.isValid) {`,
      `  out['marks'][marks_1_i] = marks_1_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      `else if(marks_1.value === null) {`,
      `  out['marks'] = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output without array validations', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'array',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'marks',
        propertyName: 'marks',
        allowUnknownProperties: false,
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
      `const marks_1 = defineValue(root['marks'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'marks',`,
      `  fieldPath: 'marks',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(marks_1);`,
      `if (ensureIsArray(marks_1)) {`,
      `if (marks_1.isValid) {`,
      `out['marks'] = [];`,
      `const marks_1_items_size = marks_1.value.length;`,
      `for (let marks_1_i = 0; marks_1_i < marks_1_items_size; marks_1_i++) {`,
      `const marks_1_item = defineValue(marks_1.value[marks_1_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: marks_1_i,`,
      `  fieldPath: 'marks' + '.' + marks_1_i,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: marks_1.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(marks_1_item);`,
      `if (marks_1_item.isDefined && marks_1_item.isValid) {`,
      `  out['marks'][marks_1_i] = marks_1_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      `else if(marks_1.value === null) {`,
      `  out['marks'] = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output in tuple mode', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'array',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'marks',
        propertyName: 'marks',
        allowUnknownProperties: false,
        validations: [],
        children: [
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
      `const marks_1 = defineValue(root['marks'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'marks',`,
      `  fieldPath: 'marks',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(marks_1);`,
      `if (ensureIsArray(marks_1)) {`,
      `if (marks_1.isValid) {`,
      `out['marks'] = [];`,
      `const marks_1_item_0 = defineValue(marks_1.value[0], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 0,`,
      `  fieldPath: 'marks' + '.' + 0,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: marks_1.value,`,
      `  isArrayMember: true,`,
      `});`,
      `ensureExists(marks_1_item_0);`,
      `if (marks_1_item_0.isDefined && marks_1_item_0.isValid) {`,
      `  out['marks'][0] = marks_1_item_0.value;`,
      `}`,
      `const marks_1_items_size = marks_1.value.length;`,
      `for (let marks_1_i = 1; marks_1_i < marks_1_items_size; marks_1_i++) {`,
      `const marks_1_item = defineValue(marks_1.value[marks_1_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: marks_1_i,`,
      `  fieldPath: 'marks' + '.' + marks_1_i,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: marks_1.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(marks_1_item);`,
      `if (marks_1_item.isDefined && marks_1_item.isValid) {`,
      `  out['marks'][marks_1_i] = marks_1_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      `else if(marks_1.value === null) {`,
      `  out['marks'] = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for array with bail mode disabled', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'array',
        allowNull: true,
        isOptional: false,
        bail: false,
        fieldName: 'marks',
        propertyName: 'marks',
        allowUnknownProperties: false,
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
      `const marks_1 = defineValue(root['marks'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'marks',`,
      `  fieldPath: 'marks',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(marks_1);`,
      `if (ensureIsArray(marks_1)) {`,
      `refs['ref://2'].validator(marks_1.value, refs['ref://2'].options, marks_1);`,
      `out['marks'] = [];`,
      `const marks_1_items_size = marks_1.value.length;`,
      `for (let marks_1_i = 0; marks_1_i < marks_1_items_size; marks_1_i++) {`,
      `const marks_1_item = defineValue(marks_1.value[marks_1_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: marks_1_i,`,
      `  fieldPath: 'marks' + '.' + marks_1_i,`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: marks_1.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(marks_1_item);`,
      `if (marks_1_item.isDefined && marks_1_item.isValid) {`,
      `  out['marks'][marks_1_i] = marks_1_item.value;`,
      `}`,
      `}`,
      `}`,
      'else if(marks_1.value === null) {',
      `  out['marks'] = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output for array node with each schema', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'array',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: 'marks',
        propertyName: 'marks',
        allowUnknownProperties: false,
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
      `const marks_1 = defineValue(root['marks'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'marks',`,
      `  fieldPath: 'marks',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(marks_1);`,
      `if (ensureIsArray(marks_1)) {`,
      `if (marks_1.isValid) {`,
      `  refs['ref://2'].validator(marks_1.value, refs['ref://2'].options, marks_1);`,
      `}`,
      `if (marks_1.isValid) {`,
      `out['marks'] = [];`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for array node when unknown properties are allowed', async ({
    assert,
  }) => {
    const compiler = new Compiler([
      {
        type: 'array',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: 'marks',
        propertyName: 'marks',
        allowUnknownProperties: true,
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
      `const marks_1 = defineValue(root['marks'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'marks',`,
      `  fieldPath: 'marks',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(marks_1);`,
      `if (ensureIsArray(marks_1)) {`,
      `if (marks_1.isValid) {`,
      `  refs['ref://2'].validator(marks_1.value, refs['ref://2'].options, marks_1);`,
      `}`,
      `if (marks_1.isValid) {`,
      `out['marks'] = copyProperties(marks_1.value);`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })
})
