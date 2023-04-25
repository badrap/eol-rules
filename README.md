# EOL Rule Database [![Validate, build and deploy](https://github.com/badrap/eol-rules/actions/workflows/main.yml/badge.svg)](https://github.com/badrap/eol-rules/actions/workflows/main.yml)

The collected rules are published to GitHub pages on every push to the `main` branch:

- https://badrap.github.io/eol-rules/eol-rules.json - A JSON collection of rules.

## Getting Started

This repository has a Dev Container setup that can be used with Visual Studio Code. Refer to the article ["Developing inside a Container"](https://code.visualstudio.com/docs/devcontainers/containers) to get started.

## Structure

Each target has their own .yaml file under the the [./targets](./targets) directory. The target's canonical identifier (_"target ID"_) is derived from the filename by removing the .yaml suffix.

A valid target ID follows these rules:

- It must have 1-32 characters.
- It must contain only hyphens and lowercase alphanumerics.
- It must start and end with an alphanumeric.
- It must not contain two consecutive hyphens.

## Target file validation

Target files are validated on every push by GitHub Actions. You can also run validation locally with the following command:

```sh
npm run validate
```

The validation uses the [./schema/target.schema.json](./schema/target.schema.json) file to check the basic structure of each target YAML file.

## Trying out the targets & rules

There are scripts for testing out the current set of targets and their rules, either with direct banner data or matching them to Shodan results.

### Testing direct banner data

```sh
npm -s run try:banner 'BANNER TEXT GOES HERE'
```

For example:

```sh
npm -s run try:banner 'Apache/2.2.22 (Debian)'
```

### Testing Shodan results

```sh
SHODAN_API_KEY='*****************' npm -s run try:shodan 192.168.0.0
```
