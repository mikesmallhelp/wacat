import {Args, Command, Flags} from '@oclif/core'
import { exec } from 'child_process';

export default class Hello extends Command {
  static args = {
    url: Args.string({description: 'Application url to test', required: true}),
  }

  static description = 'Test application'

  static examples = [
    `$ wacat test http://localhost:3000
`,
  ]

  static flags = {
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Hello)

    exec(`ROOT_URL='${args.url}' npx playwright test --project=chromium`, (error, stdout, stderr) => {
      if (error) {
        this.error(`Error occurred: ${error.message}`);
      }
      this.log(`${stdout}`);
    });

    this.log(`Testing in url ${args.url}`)
  }
}
