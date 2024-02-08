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
    'conf': Flags.string({char: 'a', description: 'Path to the configuration file'}),
    'debug': Flags.boolean({char: 'd', description: 'Enable debug mode'}),
    'error-texts': Flags.string({char: 'e', description: 'Path to the error texts file'}),
    'input-texts': Flags.string({char: 'e', description: 'Path to the input texts file'}),
    'only-links': Flags.boolean({char: 'd', description: 'Test only links'})
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(TestCommand);

    try {
      const command = this.buildCommand(args, flags);
      
      this.log(`\nTesting in url: ${args.url}. Please wait...\n`);

      if (flags.debug) {
        this.log(`\nThe Playwright command: ${command}\n`);
      }

      const { stdout } = await this.runCommand(command);
      this.log(`${stdout}`);
    } catch (error: any) {  // eslint-disable-line @typescript-eslint/no-explicit-any
      this.error(`\n${error.message}`);
    }
  }

  private buildCommand(args: any, flags: any): string { // eslint-disable-line @typescript-eslint/no-explicit-any
    const isWindows = process.platform === "win32";
    const prefix = isWindows ? 'set ' : '';
    const suffix = isWindows ? ' && ' : ' ';
   
    let command = isWindows ? `${prefix}ROOT_URL=${args.url}${suffix}` : `${prefix}ROOT_URL='${args.url}'${suffix}`;
    command += flags['error-texts'] ? `${prefix}PAGE_ERROR_TEXTS_FILE_PATH=${flags['error-texts']}${suffix}` : '';
    command += flags['input-texts'] ? `${prefix}INPUT_TEXTS_FILE_PATH=${flags['input-texts']}${suffix}` : '';
    command += flags.conf ? `${prefix}AUTHENTICATION_CONFIGURATION_FILE_PATH=${flags.conf}${suffix}` : '';
    command += flags['only-links'] ? `${prefix}ONLY_LINKS=true${suffix}` : '';
    command += 'npx playwright test --project=chromium';

    return command;
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
