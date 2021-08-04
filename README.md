# theolemague.github.io
This is my web page. This actual web page is created using React (https://fr.reactjs.org/).



## Run the web page
To start the project, the npm command is required (This command will run the `react-scripts start`see the package.json in "scripts")
```zsh
% npm start

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
