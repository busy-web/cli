# cli

Command line to for node and emberjs shorcut commands

## Install

```
npm i -g @busy-web/cli
```

## Docs

<!--START_DOCS-->

#### Usage: 
&rsaquo;&rsaquo;busyweb &lsaquo;command&rsaquo; [options]

#### OPTIONS:
&rsaquo;&rsaquo;-b, --boring Hide title and version information and remove empty new lines

#### Example:
&rsaquo;&rsaquo;busyweb help =&rsaquo; print usage information

#### Commands:
&rsaquo;&rsaquo;deploy &lsaquo;build&rsaquo;
    deploy build to server. ARGS build: [ docker | canary | alpha | beta | staging | prod | production ] ( not supported yet )
    Alias: d

&rsaquo;&rsaquo;dev:clean 
    remove packages, and build files
    Alias: dev:c

&rsaquo;&rsaquo;dev:install 
    clean project install fresh packages
    Alias: dev:i
    Options:
      -r, --rebuild removes the lockfile and generates a new lockfile based on current package.json only on <install>

&rsaquo;&rsaquo;dev:update 
    install missing packages
    Alias: dev:up

&rsaquo;&rsaquo;dev:upgrade 
    update packages and regenerate yarn.lock file
    Alias: dev:u

&rsaquo;&rsaquo;docker &lsaquo;config&rsaquo; &lsaquo;EMBER_CONFIG.PATH:DOCKER_ENV...&rsaquo;
    DEPRECATED: Please use `env:config` inplace of `docker config`
    injects docker config into built ember app

&rsaquo;&rsaquo;ember:init 
    installs new files from the current installed version of ember-cli. (ember:update should be ran first)
    Alias: em:i
    Options:
      -d, --diff use git difftool to merge files after init

&rsaquo;&rsaquo;ember:update [version]
    update ember-cli locally or globally
    Alias: em:up
    Options:
      -g, --global update global ember install
      -d, --dry performs a dry run where no update will be performed

&rsaquo;&rsaquo;env:config &lsaquo;EMBER_CONFIG.PATH:ENV_VAR...&rsaquo;
    injects ENV variables into and ember app config/environment
    Alias: env:c
    Options:
      -p, --path <path> path/to/folder where file config changes are. ( default: Current Working Directory )
      -f, --file <name> filename to replace config settings for. ( default: index.html )
      -r, --require throw error if config or ENV settings do not exist. ( default: false )

&rsaquo;&rsaquo;release &lsaquo;type&rsaquo;
    tag a new version to be released with a git tag. ARGS type: [ patch | docker | canary | alpha | beta | prod ]
    Alias: r
    Options:
      -l, --local prevents tag from pushing to upstream remote
      -u, --upstream <name> upstream remote name to push release tags, default: origin

&rsaquo;&rsaquo;template &lsaquo;type&rsaquo; &lsaquo;name&rsaquo;
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
