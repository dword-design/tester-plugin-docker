import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import packageName from 'depcheck-package-name'
import execa from 'execa'
import outputFiles from 'output-files'
import withLocalTmpDir from 'with-local-tmp-dir'

export default tester(
  {
    works: async () => {
      await outputFiles({
        Dockerfile: endent`
          FROM node:12-alpine
          WORKDIR /app
        `,
        'index.spec.js': endent`
          import tester from '@dword-design/tester'
          import execa from 'execa'
          import self from '../src'

          export default tester({
            works: async () => expect(await execa.command('docker run self ls', { all: true }))
            .toEqual('Dockerfile index.spec.js')
          }, [self()])
        `,
      })
      await execa.command(
        `mocha --ui ${packageName`mocha-ui-exports-auto-describe`} index.spec.js`,
        { stderr: 'inherit' }
      )
    },
  },
  [
    {
      transform: test =>
        function () {
          return withLocalTmpDir(() => test.call(this))
        },
    },
  ]
)
