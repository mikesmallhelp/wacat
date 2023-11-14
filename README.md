oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g wacat
$ wacat COMMAND
running command...
$ wacat (--version)
wacat/0.0.0 linux-x64 node-v16.17.1
$ wacat --help [COMMAND]
USAGE
  $ wacat COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`wacat hello PERSON`](#wacat-hello-person)
* [`wacat hello world`](#wacat-hello-world)
* [`wacat help [COMMANDS]`](#wacat-help-commands)
* [`wacat plugins`](#wacat-plugins)
* [`wacat plugins:install PLUGIN...`](#wacat-pluginsinstall-plugin)
* [`wacat plugins:inspect PLUGIN...`](#wacat-pluginsinspect-plugin)
* [`wacat plugins:install PLUGIN...`](#wacat-pluginsinstall-plugin-1)
* [`wacat plugins:link PLUGIN`](#wacat-pluginslink-plugin)
* [`wacat plugins:uninstall PLUGIN...`](#wacat-pluginsuninstall-plugin)
* [`wacat plugins:uninstall PLUGIN...`](#wacat-pluginsuninstall-plugin-1)
* [`wacat plugins:uninstall PLUGIN...`](#wacat-pluginsuninstall-plugin-2)
* [`wacat plugins update`](#wacat-plugins-update)

## `wacat hello PERSON`

Say hello

```
USAGE
  $ wacat hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/mikesmallhelp/wacat/blob/v0.0.0/dist/commands/hello/index.ts)_

## `wacat hello world`

Say hello world

```
USAGE
  $ wacat hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ wacat hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [dist/commands/hello/world.ts](https://github.com/mikesmallhelp/wacat/blob/v0.0.0/dist/commands/hello/world.ts)_

## `wacat help [COMMANDS]`

Display help for wacat.

```
USAGE
  $ wacat help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for wacat.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.19/src/commands/help.ts)_

## `wacat plugins`

List installed plugins.

```
USAGE
  $ wacat plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ wacat plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/index.ts)_

## `wacat plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ wacat plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ wacat plugins add

EXAMPLES
  $ wacat plugins:install myplugin 

  $ wacat plugins:install https://github.com/someuser/someplugin

  $ wacat plugins:install someuser/someplugin
```

## `wacat plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ wacat plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ wacat plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/inspect.ts)_

## `wacat plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ wacat plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ wacat plugins add

EXAMPLES
  $ wacat plugins:install myplugin 

  $ wacat plugins:install https://github.com/someuser/someplugin

  $ wacat plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/install.ts)_

## `wacat plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ wacat plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ wacat plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/link.ts)_

## `wacat plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ wacat plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ wacat plugins unlink
  $ wacat plugins remove
```

## `wacat plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ wacat plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ wacat plugins unlink
  $ wacat plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/uninstall.ts)_

## `wacat plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ wacat plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ wacat plugins unlink
  $ wacat plugins remove
```

## `wacat plugins update`

Update installed plugins.

```
USAGE
  $ wacat plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/update.ts)_
<!-- commandsstop -->
# wacat
