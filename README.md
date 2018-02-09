# cli

Command line to for node and emberjs shorcut commands

## Install

```
npm i -g @busy-web/cli
```

## Docs

<!--START_DOCS-->

#### Usage: 
##### busyweb &lsaquo;command&rsaquo; [options]

#### OPTIONS:
##### --boring Hide title and version information and remove empty new lines
##### --debug Turn debug mode on

#### Example:
##### busyweb help => print usage information

#### Commands:
##### deploy &lsaquo;build&rsaquo;
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

##### docker &lsaquo;config&rsaquo; &lsaquo;EMBER_CONFIG.PATH:DOCKER_ENV...&rsaquo;
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

##### env:config &lsaquo;EMBER_CONFIG.PATH:ENV_VAR...&rsaquo;
    injects ENV variables into and ember app config/environment
    Alias: env:c
    Options:
      -p, --path <path> path/to/folder where file config changes are. ( default: Current Working Directory )
      -f, --file <name> filename to replace config settings for. ( default: index.html )
      -r, --require throw error if config or ENV settings do not exist. ( default: false )
      -an, --allow-null allow null values to be set from ENV to APP config

##### release &lsaquo;type&rsaquo;
    tag a new version to be released with a git tag. ARGS type: [ patch | docker | canary | alpha | beta | prod ]
    Alias: r
    Options:
      -undefined, --no-commit prevent version from committing and creating a new tag
      -t, --tag [name] tag the version and push to remote [name], default: origin
      -p, --push [name] push changes to remote [name], default: origin

##### release:prune &lsaquo;version&rsaquo; [type]
    Prune a release type by version
    Alias: r:p
    Options:
      -undefined, --dry shows the tags that would be deleted but doesnt do anything
      -a, --all delete all tags matching the version and type
      -m, --mod <number> mod number to prune the tags with, default: 5
      -r, --remote [name] flag to prune remote tags for [name], default: origin
      -p, --prod production tags can only be deleted with --prod option applied.

##### template &lsaquo;type&rsaquo; &lsaquo;name&rsaquo;
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
