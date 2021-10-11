# Simple Encoder

A quick and simple User interface for video editors to build batch conversions powered by FFMPEG.

<br>

<p>
  Created with Electron React Boilerplate uses <a href="https://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="https://github.com/reactjs/react-router">React Router</a>, <a href="https://webpack.js.org/">Webpack</a> and <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a>.
</p>

<br>

<div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![Dependency Status][david-image]][david-url]
[![DevDependency Status][david-dev-image]][david-dev-url]
[![Github Tag][github-tag-image]][github-tag-url]

[![OpenCollective](https://opencollective.com/electron-react-boilerplate/backers/badge.svg)](#backers)
[![OpenCollective](https://opencollective.com/electron-react-boilerplate/sponsors/badge.svg)](#sponsors)
[![Good first issues open][good-first-issue-image]][good-first-issue-url]
[![StackOverflow][stackoverflow-img]][stackoverflow-url]

</div>

## Install Binaries

**Download Links**

[Windows](https://github.com/dustatron/simple-encoder/releases/download/0.3.0/Simple.Encoder.Setup.0.3.0.exe) - [Mac](https://github.com/dustatron/simple-encoder/releases/download/0.3.0/Simple.Encoder-0.3.0.dmg) - [Linux AppImage](https://github.com/dustatron/simple-encoder/releases/download/0.3.0/Simple.Encoder-0.3.0.AppImage) - [Linux deb](https://github.com/dustatron/simple-encoder/releases/download/0.3.0/simple-encoder_0.3.0_amd64.deb)

### Run on windows

1. Install ffmpeg on your computer
   - Download ffmpeg from [CODEX FFMPEG](https://www.gyan.dev/ffmpeg/builds/)
   - Copy ffmpeg.exe to a folder located at c:\Program Files\ffmpeg\

### Run on Mac

1. Make sure ffmpeg is installed on your computer
   - [Install with Home Brew](http://jollejolles.com/install-ffmpeg-on-mac-os-x/)
   - [Download directly](https://evermeet.cx/ffmpeg/)
2. The program will assume ffmpeg is located`'/usr/local/bin/ffmpeg'`

3. Download the DMG and copy `Simple Encoder` to your apps folder

### Run on Linux

1. [Install ffmpeg on your distro](https://www.tecmint.com/install-ffmpeg-in-linux/)
2. On ubuntu run `sudo apt install ffmpeg` in your terminal
3. Then download the deb or AppImage and give the file executable permission

### On First run

When running the app for the first time for to the settings tab and...

1. Set the destination folder
2. Make sure your ffmpeg path is set correctly

## Running the code locally

- **If you have installation or compilation issues with this project, please see [our debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400)**

First, clone the repo via git and install dependencies:

```bash
git clone --depth 1 --branch main https://github.com/electron-react-boilerplate/electron-react-boilerplate.git your-project-name
cd your-project-name
yarn
```

## Starting Development

Start the app in the `dev` environment:

```bash
yarn start
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

## Docs for React-Builder

See our [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)

## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)

[github-actions-status]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/workflows/Test/badge.svg
[github-actions-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/actions
[github-tag-image]: https://img.shields.io/github/tag/electron-react-boilerplate/electron-react-boilerplate.svg?label=version
[github-tag-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest
[stackoverflow-img]: https://img.shields.io/badge/stackoverflow-electron_react_boilerplate-blue.svg
[stackoverflow-url]: https://stackoverflow.com/questions/tagged/electron-react-boilerplate
[david-image]: https://img.shields.io/david/electron-react-boilerplate/electron-react-boilerplate.svg
[david-url]: https://david-dm.org/electron-react-boilerplate/electron-react-boilerplate
[david-dev-image]: https://img.shields.io/david/dev/electron-react-boilerplate/electron-react-boilerplate.svg?label=devDependencies
[david-dev-url]: https://david-dm.org/electron-react-boilerplate/electron-react-boilerplate?type=dev
[good-first-issue-image]: https://img.shields.io/github/issues/electron-react-boilerplate/electron-react-boilerplate/good%20first%20issue.svg?label=good%20first%20issues
[good-first-issue-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues?q=is%3Aopen+is%3Aissue+label%3A"good+first+issue"
