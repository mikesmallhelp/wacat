import {Args, Command, Flags} from '@oclif/core';
import {exec} from 'node:child_process';

export default class TestCommand extends Command {
  static args = {
    url: Args.string({description: 'Application url to test, for example: http://localhost:3000', required: true}),
  }

  static description = 'Test any web application with wacat. The current version is 1.5.2.'

  static examples = [
    `$ wacat test http://localhost:3000`,
  ]

  static flags = {
    'broken-input-values': Flags.boolean({description: `Enable the generation of invalid or broken input values. 
                                                        This flag is effective only when the AI_GENERATED_INPUT_TEXTS environment variable is set.`}),
    'broken-input-values-percentage': Flags.integer({description: `Specify the percentage (0-100) of broken or invalid input values to use when the 
                                                                   --broken-input-values flag is enabled. For example, a value of 50 means that approximately 50% of 
                                                                   the inputs will be intentionally broken or invalid. The default value is 100%, meaning all 
                                                                   inputs will be broken or invalid unless a specific percentage is provided.`, max: 100, min: 0}),
    'bypass-ai-errors': Flags.boolean({description: 'Bypass the AI errors'}),
    'bypass-browser-console-errors': Flags.boolean({description: 'Bypass the browser console\'s errors'}),
    'bypass-http-errors': Flags.boolean({description: 'Bypass the HTTP errors'}),
    'conf': Flags.string({description: 'Path to the configuration file'}),
    'debug': Flags.boolean({description: 'Enable debug mode'}),
    'headless': Flags.boolean({description: 'Headless mode'}),
    'ignore-ai-generated-input-texts-in-test': Flags.boolean({description: `In the automatic tests don't generate input texts with the AI`}),
    'ignore-ai-in-test': Flags.boolean({description: 'In the automatic tests ignore OpenAI API key'}),
    'input-texts': Flags.string({description: 'Path to the input texts file'}),
    'only-links': Flags.boolean({description: 'Test only links'}),
    'random-input-texts-charset': Flags.string({description: 'Random input texts character set'}),
    'random-input-texts-max-length': Flags.integer({description: 'Random input texts max length', min: 1}),
    'random-input-texts-min-length': Flags.integer({description: 'Random input texts min length', min: 1}),
    'timeout': Flags.integer({description: 'A whole test run timeout in seconds', min: 1}),
    'wait': Flags.integer({description: 'A wait in milliseconds to wait a page load', min: 0})
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

    command += flags['broken-input-values'] ? `${prefix}BROKEN_INPUT_VALUES=true${suffix}` : '';
    command += flags['broken-input-values-percentage'] ? `${prefix}BROKEN_INPUT_VALUES_PERCENTAGE=${flags['broken-input-values-percentage']}${suffix}` : '';
    command += flags['bypass-ai-errors'] ? `${prefix}BYPASS_AI_ERRORS=true${suffix}` : '';
    command += flags['bypass-browser-console-errors'] ? `${prefix}BYPASS_BROWSER_CONSOLE_ERRORS=true${suffix}` : '';
    command += flags['bypass-http-errors'] ? `${prefix}BYPASS_HTTP_ERRORS=true${suffix}` : '';
    command += flags.conf ? `${prefix}CONFIGURATION_FILE_PATH=${flags.conf}${suffix}` : '';
    command += flags.debug ? `${prefix}DEBUG=true${suffix}` : '';
    command += flags['error-texts'] ? `${prefix}PAGE_ERROR_TEXTS_FILE_PATH=${flags['error-texts']}${suffix}` : '';
    command += flags['ignore-ai-generated-input-texts-in-test'] ? `${prefix}IGNORE_AI_GENERATED_INPUT_TEXTS_IN_TEST=true${suffix}` : '';
    command += flags['ignore-ai-in-test'] ? `${prefix}IGNORE_AI_IN_TEST=true${suffix}` : '';
    command += flags['input-texts'] ? `${prefix}INPUT_TEXTS_FILE_PATH=${flags['input-texts']}${suffix}` : '';
    command += flags['only-links'] ? `${prefix}ONLY_LINKS=true${suffix}` : '';
    command += flags['random-input-texts-charset'] ? `${prefix}RANDOM_INPUT_TEXTS_CHARSET=${flags['random-input-texts-charset']}${suffix}` : '';
    command += flags['random-input-texts-max-length'] ? `${prefix}RANDOM_INPUT_TEXTS_MAX_LENGTH=${flags['random-input-texts-max-length']}${suffix}` : '';
    command += flags['random-input-texts-min-length'] ? `${prefix}RANDOM_INPUT_TEXTS_MIN_LENGTH=${flags['random-input-texts-min-length']}${suffix}` : '';
    command += flags.timeout ? `${prefix}TIMEOUT=${flags.timeout}${suffix}` : '';
    command += flags.wait ? `${prefix}WAIT=${flags.wait}${suffix}` : '';

    command += 'npx playwright test --project=chromium';

    if (!flags.headless) {
      command += ' --headed'
    }

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
