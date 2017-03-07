# Film Search 2000
[![CircleCI](https://circleci.com/gh/craigbilner/fp-film-search.svg?style=svg)](https://circleci.com/gh/craigbilner/fp-film-search)

A frameworkless FP approach to a search box and list thing

## Stack

It's the "hands-off" stack, no transpiling, just [rollup](http://rollupjs.org/) for bundling, [jest](https://facebook.github.io/jest/) for testing, [flow](https://flowtype.org/) for typing and a smidgen of JS that is heavily "inspired" by [elm](http://elm-lang.org/) and [redux](https://github.com/reactjs/redux). Watching is courtesy of [chokidar](https://github.com/kimmobrunfeldt/chokidar-cli) with a bit of [jsdom](https://github.com/tmpvar/jsdom) 'n' [sinon](http://sinonjs.org/) for E2E integration testing.

## Output

A text box that you can type into which makes film stuff appear in some flex-box type wrapped list underneath

## Health warning ⚠️️

Just a learning experiment to try out a different tech stack and "do it Vanilla" so won't work if you don't have fetch and service workers...and it's pretty minimalist and doesn't show a spinner when it's thinking ;-)
