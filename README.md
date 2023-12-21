# wacat - Tests your web application against cat chaos!

Imagine, you leave your computer for a while and go to pick up cup of coffee. Meanwhile your cat walks over your keyboard and causes some chaos. wacat application

- goes to your application root url
- visit every link in your web application
- adds random inputs to your HTML form inputs
- selects random values from dropdown menus
- pushes every buttons

wacat = walking cat

## Installation

### Install Node.js

[Install Node.js from here](https://nodejs.org/en)

### Clone wacat and install it

Clone the wacat repository, go to the wacat folder and run:

```
npm install && npx playwright install --with-deps && npm run build && npm i -g
```

Note: probably your password is asked, when you run previous command

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

![the main page](doc/test-application-picture-1.png)

![the first sub page](doc/test-application-picture-2.png)

![the second sub page](doc/test-application-picture-3.png)

First the command finds two sub pages and goes to them. Then it fills the form inputs and selects from the dropdown menus of the each page. Finally it pushes the buttons in the each page. Here is the command output:

```
wacat test https://mikesmallhelp-test-application.vercel.app/

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

Testing in url: https://mikesmallhelp-test-application.vercel.app/
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
In the output you can see that values from the input-texts.txt file are used.


