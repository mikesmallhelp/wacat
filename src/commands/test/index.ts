import {Args, Command, Flags} from '@oclif/core'

export default class Hello extends Command {
  static args = {
    url: Args.string({description: 'Application url to test', required: true}),
  }

  static description = 'Test application'

  static examples = [
    `$ wcat test http://localhost:3000
`,
  ]

  static flags = {
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Hello)

    this.log(`Testataan sovellusta urlissa ${args.url} `)
  }
}
