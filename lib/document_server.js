"use strict";

const http = require('http');
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

// In a secure app, we'd of course put this in a .gitignore'd .env file or something safer
const AUTH_USERNAME = 'diligen';
const AUTH_PASSWORD = 'harrypotter';

const TEMPLATES_PATH = '/templates/';
const RESOURCES_PATH = '/resources/';

const CONTENT_TYPES = {
	'.js': 'text/javascript',
	'.css': 'text/css',
};

class DocumentServer
{
	/**
	 * Create an instance of the doucment server.
	 *
	 * @param {array} documents - The documents to serve.
	 * @param {integer} port - The port to listen on.
	 * @param {string} serverPath - The path the server started up on.
	 */
	constructor(documents, port, serverPath)
	{
		this.documents = documents;
		this.port = port;
		this.serverPath = serverPath;

		this.server = http.createServer(this.listener.bind(this));
		this.commands = {
			'': 'showIndex',
			'documents': 'showDocument',
			'resources': 'showResource',
		};
	}

	/**
	 * Begin listening for connections.
	 */
	listen()
	{
		this.server.listen(this.port);
		console.log(`Listening on http://localhost:${this.port}`);
	}

	/**
	 * Listens to incoming HTTP connections.
	 *
	 * @param {Request} req - The HTTP request.
	 * @param {Response} res - The HTTP response.
	 */
	async listener(req, res)
	{
		const urlParts = this.getParts(req.url);
		const command = urlParts[0];
		const param = urlParts[1];

		if ( ! this.isAuthed(req)) {
			return this.requestAuth(res);
		}

		try {
			if (this.isValidCommand(command)) {
				await this[this.commands[command]](res, param);
			}
			else {
				throw new Error("404: Page not found.");
			}
		}
		catch (error) {
			this.respond(res, 404, `<h1>${error.message}</h1>`);
		}
	}

	/**
	 * Determine if the user is authorized to view.
	 *
	 * @param {Request} req - The HTTP request.
	 *
	 * @return {boolean}
	 */
	isAuthed(req)
	{
		if ('undefined' === typeof req.headers.authorization) {
			return false;
		}

		console.log(req.headers.authorization);

		const authEncoded = req.headers.authorization.split(' ')[1];
		console.log(authEncoded);
		const authBuffer = new Buffer(authEncoded, 'base64');
		const plainAuth = authBuffer.toString();

		return `${AUTH_USERNAME}:${AUTH_PASSWORD}` === plainAuth;
	}

	/**
	 * Display an authorization request form.
	 *
	 * @param {Response} res - The HTTP response.
	 */
	requestAuth(res)
	{
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
		res.end('<html><body>Authorization required.</body></html>');
	}

	/**
	 * Respond to a connection.
	 *
	 * @param {Response} res - The HTTP response.
	 * @param {integer} code - The response code.
	 * @param {string} content - The content to reply with.
	 * @param {string} contentType - The type of content we're writing.
	 */
	respond(res, code, content, contentType = 'text/html')
	{
		res.writeHead(code, { 'Content-Type': contentType });
		res.write(content);
		res.end();
	}

	/**
	 * Get the parts of the provided URL.
	 *
	 * @param {string} url - The URL to get the parts of.
	 *
	 * @return {array}
	 */
	getParts(url)
	{
		let parts = url.split('/');
		parts.shift();
		return parts;
	}

	/**
	 * Determine if the provided command is valid for this server.
	 *
	 * @param {string} command - The command to check.
	 *
	 * @return boolean
	 */
	isValidCommand(command)
	{
		return this.commands.hasOwnProperty(command);
	}

	/**
	 * Check to see if a file exists.
	 *
	 * @param {string} file - The file to check.
	 *
	 * @return {boolean}
	 */
	async doesFileExist(file)
	{
		try {
			const access = promisify(fs.access);
			await access(file);
			return true;
		}
		catch (error) {
			return false;
		}
	}

	/**
	 * Load a template from the templates folder.
	 *
	 * @return {string}
	 */
	async getTemplate(template)
	{
		const readFile = promisify(fs.readFile);
		const file = await readFile(this.serverPath + TEMPLATES_PATH + template);
		return file.toString();
	}

	/**
	 * Get the index page.
	 *
	 * @param {Response} res - The HTTP response.
	 *
	 * @return {string}
	 */
	async showIndex(res)
	{
		console.log('Displaying index page.');

		this.respond(res, 200, await this.getTemplate('index.html'));
	}

	/**
	 * Get the requested document.
	 *
	 * @param {Response} res - The HTTP response.
	 * @param {integer} index - The requested document's index.
	 *
	 * @return {string}
	 */
	async showDocument(res, index)
	{
		console.log(`Displaying document: '${index}'.`);

		if (parseInt(index) != index || index < 1 || index > this.documents.length) {
			throw new Error("404: Document not found.");
		}

		const doc = this.documents[index - 1];
		const template = await this.getTemplate('documents.html');

		this.respond(res, 200, template.replace(/{content}/, doc));
	}

	/**
	 * Get a resource from the resources folder.
	 *
	 * @param {Response} res - The HTTP response.
	 * @param {string} resource - The resource to get.
	 *
	 * @return {string}
	 */
	async showResource(res, resource)
	{
		console.log(`Displaying resource: '${resource}'.`);

		const file = this.serverPath + RESOURCES_PATH + resource;
		if ( ! await this.doesFileExist(file)) {
			throw new Error("404: Resource not found.");
		}

		const ext = path.extname(resource);
		const contentType = CONTENT_TYPES.hasOwnProperty(ext)
			? CONTENT_TYPES[ext]
			: 'text/html';

		const readFile = promisify(fs.readFile);
		const data = await readFile(file);

		this.respond(res, 200, data, contentType);
	}
}

module.exports = DocumentServer;