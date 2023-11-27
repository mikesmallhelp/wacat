import {Args, Command, Flags} from '@oclif/core';
import {exec} from 'node:child_process';


export default class TestCommand extends Command {
  static args = {
    url: Args.string({description: 'Application url to test, for example: http://localhost:3000', required: true}),
  }

  static description = 'Test any web application, for example: wacat test http://localhost:3000'

  static examples = [
    `$ wacat test http://localhost:3000`,
  ]

  static flags = {
    'error-texts': Flags.string({char: 'e', description: 'Path to the error texts file'}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(TestCommand);

    try {
      console.log(`ROOT_URL='${args.url}' ${flags['error-texts'] ? `PAGE_ERROR_TEXTS_FILE_PATH=${flags['error-texts']}` : ''} npx playwright test --project=chromium`);
      const { stdout } = await this.runCommand(`ROOT_URL='${args.url}' ${flags['error-texts'] ? `PAGE_ERROR_TEXTS_FILE_PATH=${flags['error-texts']}` : ''} npx playwright test --project=chromium`);
      this.log(`${stdout}`);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      this.log(`${error.stdout}`);
      this.error(`${error.message}`);
    }

    this.log(`Testing in url: ${args.url}`);
  }

  private runCommand(command: string): Promise<{ stderr: string, stdout: string }> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Error occurred: ${error.message} + stderr: ${stderr} + stdout: ${stdout}`));
        } else {
          resolve({ stderr, stdout });
        }
      });
    });
  }
}
