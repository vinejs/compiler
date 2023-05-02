import { z } from 'zod'
// @ts-ignore
import Benchmark from 'benchmark'
import Ajv, { AsyncValidateFunction } from 'ajv'
import { Compiler } from '../src/compiler/main.js'
import { ErrorReporterFactory } from '../factories/error_reporter.js'

const suite = new Benchmark.Suite()

const data = { profile: { username: 'virk' } }
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
  profile: z.object({
    username: z.string(),
  }),
})

const compiler = new Compiler({
  type: 'root',
  schema: {
    type: 'object',
    allowNull: false,
    isOptional: false,
    fieldName: '*',
    allowUnknownProperties: false,
    bail: true,
    properties: [
      {
        type: 'object',
        propertyName: 'profile',
        allowNull: false,
        allowUnknownProperties: false,
        isOptional: false,
        fieldName: 'profile',
        bail: true,
        groups: [],
        properties: [
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
        ],
        validations: [],
      },
    ],
    groups: [],
    propertyName: '*',
    validations: [],
  },
})

compiler.compile()
const fn = compiler.compile()

const ajv = new Ajv.default()
const ajvSchema = {
  $async: true,
  type: 'object',
  properties: {
    profile: {
      type: 'object',
      properties: {
        username: { type: 'string' },
      },
      required: ['username'],
    },
  },
  required: ['profile'],
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
      zodSchema.parseAsync(data).then(() => deferred.resolve())
    },
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
