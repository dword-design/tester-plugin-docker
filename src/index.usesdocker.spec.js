import { endent, property } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir'
import { execa } from 'execa'
import outputFiles from 'output-files'

export default tester(
  {
    works: async () => {
      await outputFiles({
        'index.dockerfile': endent`
          FROM node:12-alpine
          WORKDIR /app
        `,
        'index.spec.js': endent`
          import tester from '@dword-design/tester'
          import { execa } from 'execa'
          import { endent, property } from '@dword-design/functions'
          import { expect } from 'expect'
          import self from '../src/index.js'

          export default tester({
            works: async () => expect(
              (await execa('docker', ['run', '--rm', '-v', \`\${process.cwd()}:/app\`, 'self', 'ls'])).stdout
            )
              .toEqual(endent\`
                index.dockerfile
                index.spec.js
              \`)
          }, [self()])
        `,
      })
      expect(
        execa(
          'nyc',
          [
            '--cwd',
            process.cwd(),
            '--all',
            '--extension',
            '.dockerfile',
            'mocha',
            '--ui',
            'exports',
            '--timeout',
            10000,
            'index.spec.js',
          ],
          { all: true },
        )
          |> await
          |> property('all'),
      ).toMatch('Sending build context to Docker daemon')
    },
  },
  [testerPluginTmpDir()],
)
