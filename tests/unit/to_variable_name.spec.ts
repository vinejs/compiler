/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { toVariableName } from '../../src/helpers.js'

test.group('To variable name', () => {
  test('convert value with special chars to a valid variable name', ({ assert }) => {
    assert.equal(toVariableName('user.name'), 'userName')
    assert.equal(toVariableName('user-1-name'), 'user1Name')
  })

  test('convert value starting with a number to a valid variable name', ({ assert }) => {
    assert.equal(toVariableName('1'), 'var_1')
    assert.equal(toVariableName('01'), 'var_01')
  })

  test('convert value starting special characters to a valid variable name', ({ assert }) => {
    assert.equal(toVariableName('$foo'), 'foo')
    assert.equal(toVariableName('$1'), 'var_1')
    assert.equal(toVariableName('#1'), 'var_1')
    assert.equal(toVariableName('#username'), 'username')
    assert.equal(toVariableName('@age'), 'age')
    assert.equal(toVariableName('(age)'), 'age')
    assert.equal(toVariableName('age^2'), 'age2')
    assert.equal(toVariableName('age*2'), 'age2')
  })
})
