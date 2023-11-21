import {Args, Command} from '@oclif/core';
import {exec} from 'node:child_process';

export default class TestCommand extends Command {
  static args = {
    url: Args.string({description: 'Application url to test, for example: http://localhost:3000', required: true}),
  }

  static description = 'Test any web application, for example: wacat test http://localhost:3000'

  static examples = [
    `$ wacat test http://localhost:3000`,
  ]

  static flags = {}

  async run(): Promise<void> {
    const {args} = await this.parse(TestCommand);

    try {
      const { stdout } = await this.runCommand(`ROOT_URL='${args.url}' npx playwright test --project=chromium`);
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
