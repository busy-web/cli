# cli

Command line to for node and emberjs shorcut commands

## Install

```
npm i -g @busy-web/cli
```

## Docs

<!--START_DOCS-->

### Usage: 
#### busyweb <command> [options]

### Example:
#### busyweb help => print usage information

### Commands:
#### deploy <docker|canary|alpha|beta|staging|prod|production>
    deploy build to server
    Alias: d
    Options:

#### docker <action> <ember-setting>:<docker-setting> ...
    injects docker config into built ember app
    Options:

#### ember 
    check ember-cli version
    Alias: em
    Options:
      -g, --global use global ember install
      -u, --update update ember if its out of date

#### local <clean|update|install>
    util to help manage and maintain local dev environment
    Alias: l
    Options:
      -r, --rebuild removes the lockfile and generates a new lockfile based on current package.json only on <install>

#### release <patch|docker|canary|alpha|beta|prod>
    tag a new version to be released with a git tag
    Alias: r
    Options:
      -l, --local prevents tag from pushing to upstream remote
      -u, --upstream <name> upstream remote name to push release tags, default: origin

#### template <type> <name>
    creates a new template file
    Alias: t
    Options:
      -d, --delete deletes a template file


<!--END_DOCS-->

## Contribute

Contributions are welcome. 
	1. Fork the repo and make the desired changes. 
	2. run `yarn run docs` to regenerate readme file.
	3. Then submit a PR request for review. 
