# cli

Command line to for node and emberjs shorcut commands

## Install

```
npm i -g @busy-web/cli
```

## Docs

<!--START_DOCS-->

#### Usage: 
##### busyweb <command> [options]

#### OPTIONS:
##### -b, --boring Hide title and version information and remove empty new lines

#### Example:
##### busyweb help => print usage information

#### Commands:
##### deploy <build>
    deploy build to server. ARGS build: [ docker | canary | alpha | beta | staging | prod | production ] ( not supported yet )
    Alias: d

##### dev:clean 
    remove packages, and build files
    Alias: dev:c

##### dev:install 
    clean project install fresh packages
    Alias: dev:i
    Options:
      -r, --rebuild removes the lockfile and generates a new lockfile based on current package.json only on <install>

##### dev:update 
    install missing packages
    Alias: dev:up

##### dev:upgrade 
    update packages and regenerate yarn.lock file
    Alias: dev:u

##### docker <config> <EMBER_CONFIG.PATH:DOCKER_ENV...>
    DEPRECATED: Please use `env:config` inplace of `docker config`
    injects docker config into built ember app

##### ember:init 
    installs new files from the current installed version of ember-cli. (ember:update should be ran first)
    Alias: em:i
    Options:
      -d, --diff use git difftool to merge files after init

##### ember:update [version]
    update ember-cli locally or globally
    Alias: em:up
    Options:
      -g, --global update global ember install
      -d, --dry performs a dry run where no update will be performed

##### env:config <EMBER_CONFIG.PATH:ENV_VAR...>
    injects ENV variables into and ember app config/environment
    Alias: env:c
    Options:
      -p, --path <path> path/to/folder where file config changes are. ( default: Current Working Directory )
      -f, --file <name> filename to replace config settings for. ( default: index.html )
      -r, --require throw error if config or ENV settings do not exist. ( default: false )

##### release <type>
    tag a new version to be released with a git tag. ARGS type: [ patch | docker | canary | alpha | beta | prod ]
    Alias: r
    Options:
      -l, --local prevents tag from pushing to upstream remote
      -u, --upstream <name> upstream remote name to push release tags, default: origin

##### template <type> <name>
    creates a new template file. (not supported yet)
    Alias: t
    Options:
      -d, --delete deletes a template file


<!--END_DOCS-->

## Contribute

Contributions are welcome. 
1. Fork the repo and make the desired changes. 
2. `yarn run docs` to regenerate readme file.
3. Then submit a PR request for review. 
