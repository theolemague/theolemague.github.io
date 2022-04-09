# theolemague.github.io
This is my web page. This web page is an adaptation of [Brittany Chiang](https://brittanychiang.com)'s portfolio using [React](https://fr.reactjs.org/). The goals here were to learn the React framework and also to show my education and experience through a more interactive platform than a resume. Enjoy my project !
# Development
## Project
```
- index.js
- index.css
- App.js
- components/
- configs/
- assets/
```
The project is organized according to the React initializer. `index.js` and `index.css` are the main script and style files. `App.js` is the main component that links all the components in the `components/` directory. `configs/` contains all the json configs files. `assets/` contains all the assets used.
All the commands to start the project are shortcuted in the `package.json` scripts
## Install
```zsh
$ git clone https://github.com/theolemague/theolemague.github.io.git
...
$ cd theolemague.github.io
$ npm install
```
## Run the web page
```zsh
% npm run start
> site@0.1.0 start /Users/theolemague/Documents/github/theolemague.github.io
> react-scripts start

Compiled successfully!

You can now view site in the browser.
  Local:            http://localhost:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```
## Deployement
This website is deployed with `gh-pages`modules. The following command allow the current project to be deployed on the `gh-page` git branch.
```
% npm run deploy

> site@0.1.0 predeploy /Users/theolemague/Documents/github/theolemague.github.io
> npm run build
(...)
> gh-pages -d build

Published
```
# Result
Here the result (still in progress) : https://theolemague.github.io