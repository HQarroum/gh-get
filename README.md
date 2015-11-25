<p align="center">
 <img width="270" src="https://octodex.github.com/images/inspectocat.jpg" />
</p>

# gh-get
> Github swissknife command-line tool.

Current version: **1.0.0**

Lead Maintainer: [Halim Qarroum](mailto:hqm.post@gmail.com)

## Install

##### Using NPM

```bash
npm install -g gh-get
```

This tool uses the [image-to-ascii](https://github.com/IonicaBizau/image-to-ascii) library to render profile pictures in ASCII. If you'd like to enable this feature, you must install [Graphics Magick](http://www.graphicsmagick.org/) on your platform :

```bash
# Ubuntu
$ sudo apt-get install graphicsmagick

# Fedora
$ sudo dnf install GraphicsMagick

# OS X
$ brew install graphicsmagick

# Chocolatey (package manager for Windows)
# (Restart of cmd/PowerShell is required)
$ choco install graphicsmagick
```

## Features

 * Interactive command-line assistant
 * User profile page generation
 * Information and statistics about followers
 * Navigate user gists and repositories
 * Code syntax highlighting in the shell
 * Renders image files in ASCII
 * Search Github interactively through the command line

## Usage

The `gh-get` command-line tool allows you to perform several actions given the options you are providing. You can pass different options using the command-line interface, or using the interactive mode which is triggered when no arguments are given to `gh-get`.

Note that these interfaces are not mutually exclusive. By default, we use the command-line options with a higher precedence, but if your options are lacking an information we need to perform your request, the interactive interface will kick in and prompt you for the missing pieces of information.

### Command line interface

#### Profile page

The `gh-get` tool makes it possible to retrieve the profile page of a given user by specifying the username you'd like to retrieve the profile from :

```bash
gh-get profile:HQarroum
```

#### List user followers

To list the users currently following ``HQarroum``, you can type the following :

```bash
gh-get followers:HQarroum
```

#### List users followed by a given user

To list the users currently followed by ``HQarroum``, you can type :

```bash
gh-get following:HQarroum
```

#### Search interface

It is possible to search for users, repositories and code using the search identifier :

```bash
# Search for repositories named `gh-get` and limit results to 5
gh-get search:repositories/gh-get --limit 5

# Search for a user named `HQarroum`
gh-get search:users/HQarroum

# Search for code having the token `foo` and limit results to 100
gh-get search:code/foo --limit 100
```

