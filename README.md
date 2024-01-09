# wacat - Tests your web application against cat chaos!

Imagine, you leave your computer for a while and go to pick up a cup of coffee. Meanwhile your cat walks over your keyboard and causes some chaos. 

wacat (walking cat) application for example:

- goes to your web application root url
- visit every link in your application
- adds random inputs to your page's form inputs
- selects random values from dropdown menus
- pushes every buttons

Additionally wacat

- detects HTTP errors (for example HTTP 500 errors) between browser and server
- detects error strings from the web pages
  - you give error strings in a parameter file
- can read form inputs from external files (for example from resources like https://github.com/0xspade/Combined-Wordlists?tab=readme-ov-file)
- supports basic authentication
  - you give authentication configuration in a JSON file

wacat uses the [Playwright](https://playwright.dev/) tool internally.

## Warnings

Please test only your own web application or have a permit for testing someone else's application. Testing someone else's application's vulnerabilites without permit could be criminal. 

Application is designed so that it should not go outside of the host you are testing. But because this is my hobby project everything is possible and it's good to follow what the wacat application is doing and use ctrl + c if it goes to wrong page. Please also note that if your application uses authentication and your wacat authentication configuration is not correct or wacat is not working for your case, then your account could be locked or something like that. Also wacat could mess your applications's database etc. So it's good to test only in the test environment.

## Installation

### Install Node.js

[Install Node.js from here](https://nodejs.org/en)

### Clone wacat and install it

Clone the wacat repository, go to the wacat folder and run:

```
npm install && npx playwright install --with-deps && npm run build && npm i -g
```

Note: probably your password is asked, when you run previous command, because the Playwright tool is installed globally

## Running

### Basic running

Run the command in the wacat folder:

```
wacat test <your url>
```

For example a command:

```
wacat test https://wacat-test-application-mikesmallhelp.vercel.app/
```
tests a simple application in the url https://wacat-test-application-mikesmallhelp.vercel.app/. The application have pages:

![](doc/test-application-picture-1.png)

![](doc/test-application-picture-2.png)

![](doc/test-application-picture-3.png)

First the wacat application opens Chromium browser and goes to the root URL, which was given for the command: 

![](doc/chromium-opened.png)

The root page doesn't contain any input fields, dropdown menus or buttons. wacat simple collects links of the two sub pages and goes to them. In the sub pages wacat fills the form inputs and selects from the dropdown menus. Finally it pushes the buttons in the each sub page. Here is the command output:

```
wacat test https://mikesmallhelp-test-application.vercel.app/

Testing in url: https://mikesmallhelp-test-application.vercel.app/. Please wait...

Running 1 test using 1 worker
[chromium] › test.spec.ts:30:1 › test an application
In the page: https://mikesmallhelp-test-application.vercel.app/
In the page: https://mikesmallhelp-test-application.vercel.app/working-page
Fill the #0 input field a value: elq4npt0
#0 drop-down list. Select the option #1
Push the button #0
In the page: https://mikesmallhelp-test-application.vercel.app/working-page2
Fill the #0 input field a value: b8wzde2s
#0 drop-down list. Select the option #1
Push the button #0
  1 passed (7.4s)

```
Note that output contains "1 passed" so wacat didn't find any errors in the application.

### Detect HTTP errors

wacat can detect HTTP errors between browser and server. For example if the button in the example application below is pushed the HTTP 500 error occurs.

![](doc/http-500-picture-1.png)

![](doc/http-500-picture-2.png)

An example about this is:

```

wacat test https://mikesmallhelp-test-application-http-500-error.vercel.app/

Testing in url: https://mikesmallhelp-test-application-http-500-error.vercel.app/. Please wait...
undefined
 ›   Error: Error occurred: Command failed: ROOT_URL='https://mikesmallhelp-test-application-http-500-error.vercel.app/' npx playwright test --project=chromium
 ›    + stderr:  + stdout: 
 ›   Running 1 test using 1 worker
     [chromium] › test.spec.ts:29:1 › test an application
 ›   In the page: https://mikesmallhelp-test-application-http-500-error.vercel.app/
     In the page: https://mikesmallhelp-test-application-http-500-error.vercel.app/working-page
     Fill the #0 input field a value: 33g4z1kv
     #0 drop-down list. Select the option #1
     Push the button #0
     In the page: https://mikesmallhelp-test-application-http-500-error.vercel.app/api-returns-http-500
     Fill the #0 input field a value: 78nyp02h
     #0 drop-down list. Select the option #1
     Push the button #0
     Request to https://mikesmallhelp-test-application-http-500-error.vercel.app/api/http-500 resulted in status code 500
       1) [chromium] › test.spec.ts:29:1 › test an application ──────────────────────────────────────────
 ›   
 ›       AssertionError: Request to https://mikesmallhelp-test-application-http-500-error.vercel.app/api/http-500 resulted in status code 500
 ›
 ›         37 |         if (status >= 400) {
 ›         38 |             console.log(`Request to ${url} resulted in status code ${status}`);
 ›       > 39 |             fail(`Request to ${url} resulted in status code ${status}`);
 ›            |             ^
 ›         40 |         }
 ›         41 |     });
 ›         42 |
 ›
 ›           at Page.<anonymous> (/home/lenovo/projektit/wacat/e2e-tests/test.spec.ts:39:13)
 ›
       1 failed
 ›       [chromium] › test.spec.ts:29:1 › test an application

```

So wacat detects HTTP 500 error, prints the error log with the text "1 failed" and stops the execution.

### Detect error strings from a target application's pages

Here is an example application, which contains in one sub page an error text "Error occurred!":

![](doc/error-in-page.png)

We configure in our example that "Error occurred!" is detected by wacat. We want also that the error text "abc" is detected. We configure this in JSON file like this:

```
{
    "errorTexts": ["abc", "Error occurred!"]
}
```
Run command (--conf flag is used to pass the JSON file) and output is:

```
wacat test --conf example-files/configuration-error-texts.json https://mikesmallhelp-test-application-error-in-page.vercel.app

Testing in url: https://mikesmallhelp-test-application-error-in-page.vercel.app. Please wait...
undefined
 ›   Error: Error occurred: Command failed: ROOT_URL='https://mikesmallhelp-test-application-error-in-page.vercel.app' AUTHENTICATION_CONFIGURATION_FILE_PATH=example-files/configuration-error-texts.json
 ›    npx playwright test --project=chromium
 ›    + stderr:  + stdout: 
 ›   Running 1 test using 1 worker
     [chromium] › test.spec.ts:29:1 › test an application
 ›   In the page: https://mikesmallhelp-test-application-error-in-page.vercel.app/
     Check the page not contain the abc text
     Check the page not contain the Error occurred! text
     In the page: https://mikesmallhelp-test-application-error-in-page.vercel.app/working-page
     Check the page not contain the abc text
     Check the page not contain the Error occurred! text
     Fill the #0 input field a value: 4eqhz14r
     #0 drop-down list. Select the option #1
     Push the button #0
     Check the page not contain the abc text
     Check the page not contain the Error occurred! text
     In the page: https://mikesmallhelp-test-application-error-in-page.vercel.app/error-text-in-page
     Check the page not contain the abc text
     Check the page not contain the Error occurred! text
       1) [chromium] › test.spec.ts:29:1 › test an application ──────────────────────────────────────────
 ›   
 ›       Error: expect(received).not.toContain(expected) // indexOf
 ›
 ›       Expected substring: not "Error occurred!"
 ›       Received string:        "Test page - error-text-in-pageError occurred!{\"props\":{\"pageProps\":{}},\"page\":\"/error-text-in-page\",\"query\":{},\"buildId\":\"qQ0wdj-2mwRrndTkG4FBO\",\"nextExp
 ›   ort\":true,\"autoExport\":true,\"isFallback\":false,\"scriptLoader\":[]}"
 ›
 ›          96 |     for (const errorText of configuration.errorTexts) {
 ›          97 |         console.log(`Check the page not contain the ${errorText} text`);
 ›       >  98 |         expect(content).not.toContain(errorText);
 ›             |                             ^
 ›          99 |     }
 ›         100 | }
 ›         101 |
 ›
 ›           at checkPageForErrors (/home/lenovo/projektit/wacat/e2e-tests/test.spec.ts:98:29)
 ›           at handlePage (/home/lenovo/projektit/wacat/e2e-tests/test.spec.ts:84:5)
 ›           at visitLinks (/home/lenovo/projektit/wacat/e2e-tests/test.spec.ts:154:13)
 ›           at handlePage (/home/lenovo/projektit/wacat/e2e-tests/test.spec.ts:86:5)
 ›           at /home/lenovo/projektit/wacat/e2e-tests/test.spec.ts:47:5
 ›
       1 failed
 ›       [chromium] › test.spec.ts:29:1 › test an application
```

So wacat detects "Error occurred!" text in one sub page, reports error with a "1 failed" text and execution stops.

### Read input field texts from the file

Normally wacat fills the input fields with the random strings. It is possible to read input fields from the file, for example from the file example-files/input.texts, which contents are:

```
xaxa
ybyb
```
Wacat uses each input text from the file for the each input field in the target application. The run command is for a local file:

```
wacat test --input-texts example-files/input-texts.txt https://mikesmallhelp-test-application.vercel.app/ 
```
and for the remote file:

```
wacat test --input-texts https://raw.githubusercontent.com/mikesmallhelp/wacat/main/example-files/input-texts.txt https://mikesmallhelp-test-application.vercel.app/
```

Both commands should output following:

```
Testing in url: https://mikesmallhelp-test-application.vercel.app/. Please wait...

Running 1 test using 1 worker
[chromium] › test.spec.ts:31:1 › test an application
In the page: https://mikesmallhelp-test-application.vercel.app/
In the page: https://mikesmallhelp-test-application.vercel.app/working-page
Fill the #0 input field a value: xaxa
Fill the #0 input field a value: ybyb
#0 drop-down list. Select the option #1
Push the button #0
In the page: https://mikesmallhelp-test-application.vercel.app/working-page2
Fill the #0 input field a value: xaxa
Fill the #0 input field a value: ybyb
#0 drop-down list. Select the option #1
Push the button #0
  1 passed (13.7s)
```
In the output you can see that values from the input-texts.txt file are used. You can use for the testing different input text files, for example from the page https://github.com/0xspade/Combined-Wordlists?tab=readme-ov-file. But please note that currently wacat doesn't support very long files, maybe there is some memory problem. But you can currently split too long files and test like that.


