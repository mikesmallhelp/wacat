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
$ npm install -g wcat
$ wcat COMMAND
running command...
$ wcat (--version)
wcat/0.0.0 linux-x64 node-v16.17.1
$ wcat --help [COMMAND]
USAGE
  $ wcat COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`wcat hello PERSON`](#wcat-hello-person)
* [`wcat hello world`](#wcat-hello-world)
* [`wcat help [COMMANDS]`](#wcat-help-commands)
* [`wcat plugins`](#wcat-plugins)
* [`wcat plugins:install PLUGIN...`](#wcat-pluginsinstall-plugin)
* [`wcat plugins:inspect PLUGIN...`](#wcat-pluginsinspect-plugin)
* [`wcat plugins:install PLUGIN...`](#wcat-pluginsinstall-plugin-1)
* [`wcat plugins:link PLUGIN`](#wcat-pluginslink-plugin)
* [`wcat plugins:uninstall PLUGIN...`](#wcat-pluginsuninstall-plugin)
* [`wcat plugins:uninstall PLUGIN...`](#wcat-pluginsuninstall-plugin-1)
* [`wcat plugins:uninstall PLUGIN...`](#wcat-pluginsuninstall-plugin-2)
* [`wcat plugins update`](#wcat-plugins-update)

## `wcat hello PERSON`

Say hello

```
USAGE
  $ wcat hello PERSON -f <value>

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

_See code: [dist/commands/hello/index.ts](https://github.com/mikesmallhelp/wcat/blob/v0.0.0/dist/commands/hello/index.ts)_

## `wcat hello world`

Say hello world

```
USAGE
  $ wcat hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ wcat hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [dist/commands/hello/world.ts](https://github.com/mikesmallhelp/wcat/blob/v0.0.0/dist/commands/hello/world.ts)_

## `wcat help [COMMANDS]`

Display help for wcat.

```
USAGE
  $ wcat help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for wcat.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.19/src/commands/help.ts)_

## `wcat plugins`

List installed plugins.

```
USAGE
  $ wcat plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ wcat plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/index.ts)_

## `wcat plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ wcat plugins:install PLUGIN...

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
  $ wcat plugins add

EXAMPLES
  $ wcat plugins:install myplugin 

  $ wcat plugins:install https://github.com/someuser/someplugin

  $ wcat plugins:install someuser/someplugin
```

## `wcat plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ wcat plugins:inspect PLUGIN...

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
  $ wcat plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/inspect.ts)_

## `wcat plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ wcat plugins:install PLUGIN...

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
  $ wcat plugins add

EXAMPLES
  $ wcat plugins:install myplugin 

  $ wcat plugins:install https://github.com/someuser/someplugin

  $ wcat plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/install.ts)_

## `wcat plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ wcat plugins:link PLUGIN

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
  $ wcat plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/link.ts)_

## `wcat plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ wcat plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ wcat plugins unlink
  $ wcat plugins remove
```

## `wcat plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ wcat plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ wcat plugins unlink
  $ wcat plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/uninstall.ts)_

## `wcat plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ wcat plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ wcat plugins unlink
  $ wcat plugins remove
```

## `wcat plugins update`

Update installed plugins.

```
USAGE
  $ wcat plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/update.ts)_
<!-- commandsstop -->
# wcat
