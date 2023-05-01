// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import Ajv, { AsyncValidateFunction } from 'ajv'
import { Compiler } from '../src/compiler/main.js'
import { ErrorReporterFactory } from '../factories/error_reporter.js'

const suite = new Benchmark.Suite()

const data = { username: 'virk' }
const meta = {}
const refs = {
  'ref://1': {
    validator(value: unknown, _: any, ctx: any) {
      if (typeof value !== 'string') {
        ctx.report('Value is not a string')
      }
    },
    options: {},
  },
}
const errorReporter = new ErrorReporterFactory().create()

const zodSchema = z.object({
  username: z.string(),
})

const compiler = new Compiler([
  {
    type: 'literal',
    bail: true,
    allowNull: false,
    fieldName: 'username',
    propertyName: 'userName',
    isOptional: false,
    validations: [
      {
        isAsync: false,
        ruleFnId: 'ref://1',
        implicit: false,
      },
    ],
  },
])

compiler.compile()
const fn = compiler.compile()

const ajv = new Ajv.default()
const ajvSchema = {
  $async: true,
  type: 'object',
  properties: {
    username: { type: 'string' },
  },
  required: ['username'],
  additionalProperties: false,
}

const ajvValidate = ajv.compile(ajvSchema) as AsyncValidateFunction<any>

suite
  .add('VineJS compiler', {
    defer: true,

    // benchmark test function
    fn: function (deferred: any) {
      fn(data, meta, refs, errorReporter).then(() => deferred.resolve())
    },
  })
  .add('Ajv', {
    defer: true,

    // benchmark test function
    fn: function (deferred: any) {
      ajvValidate(data).then(() => deferred.resolve())
    },
  })
  .add('Zod', {
    defer: true,
    fn(deferred: any) {
      zodSchema.parseAsync({ username: 'virk' }).then(() => deferred.resolve())
    },
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })