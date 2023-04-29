import { assert, Assert } from '@japa/assert'
import { pathToFileURL } from 'node:url'
import { specReporter } from '@japa/spec-reporter'
import { runFailedTests } from '@japa/run-failed-tests'
import { processCliArgs, configure, run } from '@japa/runner'
import { beautifyCode } from '../factories/code_beautifier.js'

Assert.macro('assertFormatted', function (actual, expected) {
  this.deepEqual(beautifyCode(actual).toArray(), beautifyCode(expected).toArray())
})

/*
|--------------------------------------------------------------------------
| Configure tests
|--------------------------------------------------------------------------
|
| The configure method accepts the configuration to configure the Japa
| tests runner.
|
| The first method call "processCliArgs" process the command line arguments
| and turns them into a config object. Using this method is not mandatory.
|
| Please consult japa.dev/runner-config for the config docs.
*/
configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    plugins: [assert(), runFailedTests()],
    reporters: [specReporter()],
    importer: (filePath) => import(pathToFileURL(filePath).href),
    suites: [
      {
        name: 'unit',
        files: ['tests/unit/**/*.spec.ts'],
      },
      {
        name: 'integration',
        files: ['tests/integration/**/*.spec.ts'],
      },
    ],
  },
})

/*
|--------------------------------------------------------------------------
| Run tests
|--------------------------------------------------------------------------
|
| The following "run" method is required to execute all the tests.
|
*/
run()
