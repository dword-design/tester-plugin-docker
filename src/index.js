import execa from 'execa'

export default () => ({
  afterEach: () => execa.command('docker image rm self', { stderr: 'inherit' }),
  beforeEach: () =>
    execa.command('docker build -t self .', { stderr: 'inherit' }),
})
