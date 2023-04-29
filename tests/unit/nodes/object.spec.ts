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

test.group('Object node', () => {
  test('create JS output for an object node', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'object',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: 'profile',
        propertyName: 'userProfile',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        children: [],
        allowUnknownProperties: false,
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const userProfile_1 = defineValue(root['profile'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'profile',`,
      `  fieldPath: 'profile',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(userProfile_1);`,
      `if (ensureIsObject(userProfile_1)) {`,
      `if (userProfile_1.isValid) {`,
      `  refs['ref://2'].validator(userProfile_1.value, refs['ref://2'].options, userProfile_1);`,
      `}`,
      `if (userProfile_1.isValid) {`,
      `out['userProfile'] = {};`,
      '}',
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for a nullable object node', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'object',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'profile',
        propertyName: 'userProfile',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        children: [],
        allowUnknownProperties: false,
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const userProfile_1 = defineValue(root['profile'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'profile',`,
      `  fieldPath: 'profile',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(userProfile_1);`,
      `if (ensureIsObject(userProfile_1)) {`,
      `if (userProfile_1.isValid) {`,
      `  refs['ref://2'].validator(userProfile_1.value, refs['ref://2'].options, userProfile_1);`,
      `}`,
      `if (userProfile_1.isValid) {`,
      `out['userProfile'] = {};`,
      '}',
      `}`,
      'else if(userProfile_1.value === null) {',
      `  out['userProfile'] = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output without object validations', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'object',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'profile',
        propertyName: 'userProfile',
        validations: [],
        children: [],
        allowUnknownProperties: false,
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const userProfile_1 = defineValue(root['profile'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'profile',`,
      `  fieldPath: 'profile',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(userProfile_1);`,
      `if (ensureIsObject(userProfile_1)) {`,
      `if (userProfile_1.isValid) {`,
      `out['userProfile'] = {};`,
      '}',
      `}`,
      'else if(userProfile_1.value === null) {',
      `  out['userProfile'] = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output for object children', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'object',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'profile',
        propertyName: 'userProfile',
        validations: [],
        children: [
          {
            type: 'literal',
            allowNull: false,
            isOptional: false,
            bail: true,
            fieldName: 'username',
            propertyName: 'username',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
        allowUnknownProperties: false,
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const userProfile_1 = defineValue(root['profile'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'profile',`,
      `  fieldPath: 'profile',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(userProfile_1);`,
      `if (ensureIsObject(userProfile_1)) {`,
      `if (userProfile_1.isValid) {`,
      `out['userProfile'] = {};`,
      `const username_2 = defineValue(userProfile_1.value['username'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'username',`,
      `  fieldPath: 'profile' + '.' + 'username',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: userProfile_1.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(username_2);`,
      `if (username_2.isValid && username_2.isDefined) {`,
      `  refs['ref://2'].validator(username_2.value, refs['ref://2'].options, username_2);`,
      `}`,
      `if (username_2.isDefined && username_2.isValid) {`,
      `  out['userProfile']['username'] = username_2.value;`,
      `}`,
      '}',
      `}`,
      'else if(userProfile_1.value === null) {',
      `  out['userProfile'] = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output for object with bail mode disabled', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'object',
        allowNull: true,
        isOptional: false,
        bail: false,
        fieldName: 'profile',
        propertyName: 'userProfile',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        children: [],
        allowUnknownProperties: false,
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const userProfile_1 = defineValue(root['profile'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'profile',`,
      `  fieldPath: 'profile',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(userProfile_1);`,
      `if (ensureIsObject(userProfile_1)) {`,
      `refs['ref://2'].validator(userProfile_1.value, refs['ref://2'].options, userProfile_1);`,
      `out['userProfile'] = {};`,
      `}`,
      'else if(userProfile_1.value === null) {',
      `  out['userProfile'] = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output for node object with unknownProperties allowed', async ({ assert }) => {
    const compiler = new Compiler([
      {
        type: 'object',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: 'profile',
        propertyName: 'userProfile',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        children: [],
        allowUnknownProperties: true,
      },
    ])

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const userProfile_1 = defineValue(root['profile'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'profile',`,
      `  fieldPath: 'profile',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(userProfile_1);`,
      `if (ensureIsObject(userProfile_1)) {`,
      `if (userProfile_1.isValid) {`,
      `  refs['ref://2'].validator(userProfile_1.value, refs['ref://2'].options, userProfile_1);`,
      `}`,
      `if (userProfile_1.isValid) {`,
      `out['userProfile'] = {};`,
      `moveProperties(userProfile_1.value, out['userProfile'], []);`,
      '}',
      `}`,
      ...getClosingOutput(),
    ])
  })
})
