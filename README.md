# wacat - Tests your web application against cat chaos!

Imagine, you leave your computer for a while and go to pick up cup of coffee. Meanwhile your cat walks over your keyboard and causes some chaos. wacat application

- goes to your application root url
- visit every link in your web application
- adds random inputs to your HTML form inputs
- selects random values from dropdown menus
- pushes every buttons

wacat uses the [Playwright](https://playwright.dev/) tool internally.

wacat = walking cat

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


