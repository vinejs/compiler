/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { defineInlineFunctions } from '../../src/scripts/define_inline_functions.js'

const fn = new Function(
  'data',
  'output',
  'ignoreProperties',
  `
  ${defineInlineFunctions()}
  moveProperties(data, output, ignoreProperties)
  `
)

test.group('Move properties', () => {
  test('move properties from a flat object', ({ assert }) => {
    const data = {
      username: 'virk',
      password: 'secret',
      age: 32,
    }

    const output = {
      username: 'VIRK',
    }

    fn(data, output, ['username'])
    assert.deepEqual(output, {
      username: 'VIRK',
      password: 'secret',
      age: 32,
    })

    // Mutating source
    data.age = 34
    assert.deepEqual(output, {
      username: 'VIRK',
      password: 'secret',
      age: 32,
    })
  })

  test('move properties from a nested object', ({ assert }) => {
    const data = {
      username: 'virk',
      password: 'secret',
      meta: {
        age: 32,
        password: 'secret',
        sigfile: 'file://foobar',
      },
    }

    const output = {
      username: 'VIRK',
      password: 'SECRET',
    }

    fn(data, output, ['username', 'password'])
    assert.deepEqual(output, {
      username: 'VIRK',
      password: 'SECRET',
      meta: {
        age: 32,
        password: 'secret',
        sigfile: 'file://foobar',
      },
    })

    // Mutating source
    data.meta.age = 34
    assert.deepEqual(output, {
      username: 'VIRK',
      password: 'SECRET',
      meta: {
        age: 32,
        password: 'secret',
        sigfile: 'file://foobar',
      },
    })
  })

  test('dereference arrays', ({ assert }) => {
    const data = {
      username: 'virk',
      password: 'secret',
      meta: [
        {
          age: 32,
          password: 'secret',
          sigfile: 'file://foobar',
        },
      ],
    }

    const output = {
      username: 'VIRK',
      password: 'SECRET',
    }

    fn(data, output, ['username', 'password'])
    assert.deepEqual(output, {
      username: 'VIRK',
      password: 'SECRET',
      meta: [
        {
          age: 32,
          password: 'secret',
          sigfile: 'file://foobar',
        },
      ],
    })

    // Mutating source
    data.meta[0].age = 34
    data.meta.push({ age: 34, password: 'foo', sigfile: 'file://foo' })
    assert.deepEqual(output, {
      username: 'VIRK',
      password: 'SECRET',
      meta: [
        {
          age: 32,
          password: 'secret',
          sigfile: 'file://foobar',
        },
      ],
    })
  })
})
