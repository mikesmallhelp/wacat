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

    exec('npx playwright test --project=chromium', (error, stdout, stderr) => {
      if (error) {
        this.error(`Virhe komentoa suorittaessa: ${error.message}`);
        return;
      }
      // Tulosta komennon tulostus
      this.log(`Komento suoritettu: ${stdout}`);
      // Jatka muun toiminnallisuuden kanssa, esim. this.log(`Testataan sovellusta urlissa ${args.url} `)
    });

    this.log(`Testataan sovellusta urlissa ${args.url} 13.11.2023 17:17`)
  }
}
