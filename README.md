# Diligen Document Highlighter

Example document highlighter for Diligen.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Ensure you have at least at least the following versions of the following programs:
  * Node.js v8.9.1+

### Installing & Development

Run `npm install` from the project folder to ensure all NPM packages are installed.

Run `npm start` to start the service.

If you have `supervisor` installed globally, you can run `npm run dev` to ensure that modified sever code is reloaded automatically when changed.

If you plan on making changes to the client code (located in `client-src`), run `npm run develop-client` to ensure that changes to client code are automatically compiled when changed.

## Running tests

To test all files, run `npm test`.

## Deployment

The application is deployed to Heroku at: https://nameless-fortress-15271.herokuapp.com/.

Username and password should have been emailed to you.

## Author

[Dan Hulton](http://www.danhulton.com)