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

#### Example:
##### busyweb help =&rsaquo; print usage information

#### Commands:
##### deploy &lsaquo;build&rsaquo;
    deploy build to server. ARGS build: [ docker | canary | alpha | beta | staging | prod | production ] ( not supported yet )
    Alias: d
    Options:

##### docker config &lsaquo;EMBER_CONFIG.PATH:DOCKER_ENV&rsaquo; [...]
    injects docker config into built ember app
    Options:

##### ember 
    check ember-cli version
    Alias: em
    Options:
      -g, --global use global ember install
      -u, --update update ember if its out of date

##### local &lsaquo;task&rsaquo;
    util to help manage and maintain local dev environment. ARGS task: [ clean | update | install ]
    Alias: l
    Options:
      -r, --rebuild removes the lockfile and generates a new lockfile based on current package.json only on &lsaquo;install&rsaquo;

##### release &lsaquo;type&rsaquo;
    tag a new version to be released with a git tag. ARGS type: [ patch | docker | canary | alpha | beta | prod ]
    Alias: r
    Options:
      -l, --local prevents tag from pushing to upstream remote
      -u, --upstream &lsaquo;name&rsaquo; upstream remote name to push release tags, default: origin

##### template &lsaquo;type&rsaquo; &lsaquo;name&rsaquo;
    creates a new template file. (not supported yet)
    Alias: t
    Options:
      -d, --delete deletes a template file


<!--END_DOCS-->

## Contribute

Contributions are welcome. 
	1. Fork the repo and make the desired changes. 
	2. run `yarn run docs` to regenerate readme file.
	3. Then submit a PR request for review. 
