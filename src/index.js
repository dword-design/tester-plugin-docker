import { last, split } from '@dword-design/functions'
import { execa } from 'execa'
import { findUp } from 'find-up'
import fs from 'fs-extra'

export default () => ({
  async after() {
    const dockerfileLines =
      fs.readFile(this.dockerfilePath, 'utf8') |> await |> split('\n')
    await fs.outputFile(
      '.nyc_output/docker.js',
      JSON.stringify({
        [this.dockerfilePath]: {
          all: true,
          b: {},
          branchMap: {},
          f: {},
          fnMap: {},
          path: this.dockerfilePath,
          s: {
            0: 0,
          },
          statementMap: {
            0: {
              end: {
                column: (dockerfileLines |> last).length,
                line: dockerfileLines.length - 1,
              },
              start: {
                column: 0,
                line: 0,
              },
            },
          },
        },
      }),
    )
  },
  async before() {
    this.dockerfilePath = await findUp('index.dockerfile')
    await execa(
      'docker',
      ['build', '--file', this.dockerfilePath, '--tag', 'self', '.'],
      { stdio: 'inherit' },
    )
  },
})
