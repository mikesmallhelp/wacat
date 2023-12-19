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
npm run build && npm i -g
```

## Running

### Basic running

Run the command in the wacat folder:

```
wacat test <your url>
```

For example the command:

```
wacat test https://wacat-test-application-mikesmallhelp.vercel.app/
```
tests a simple application in the url https://wacat-test-application-mikesmallhelp.vercel.app/. The application have pages:

![the main page](doc/test-application-picture-1.png)

![the first sub page](doc/test-application-picture-2.png)

![the second sub page](doc/test-application-picture-3.png)

