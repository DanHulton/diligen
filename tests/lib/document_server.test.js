/*eslint-env mocha */
"use strict";

const DocumentServer = require('../../lib/document_server');

describe('DocumentServer', () => {
	let server;

	beforeEach(() => {
		server = new DocumentServer(
			['abc', 'def', 'ghi', 'jkl'],
			8082,
			__dirname + '/../..'
		);

		// Don't actually start the listen server for tests
		server.server.listen = jest.fn();
	});

	describe('listen()', () => {
		it('should listen', () => {
			server.listen();
			expect(server.server.listen).toHaveBeenCalledWith(8082);

		});
	});

	describe('listener()', () => {
		it('should perform valid command', async () => {
			const res = {};
			server.showDocument = jest.fn();
			server.isAuthed = jest.fn(() => true);
			await server.listener({ url: '/documents/2' }, res);
			expect(server.showDocument).toHaveBeenCalledWith(res, "2");
		});

		it('should 404 on an invalid command', async () => {
			const res = {};
			server.respond = jest.fn();
			server.isAuthed = jest.fn(() => true);
			await server.listener({ url: '/notfound' }, res);
			expect(server.respond).toHaveBeenCalledWith(res, 404, '<h1>404: Page not found.</h1>');
		});
	});

	describe('isAuthed()', () => {
		it('should allow only authorized users', () => {
			expect(server.isAuthed({ headers: {} })).toBe(false);
			expect(server.isAuthed({ headers: { authorization: 'Basic YXNkZjpqa2w7' } })).toBe(false);
			expect(server.isAuthed({ headers: { authorization: 'Basic ZGlsaWdlbjpoYXJyeXBvdHRlcg==' } })).toBe(true);
		});
	});

	describe('respond()', () => {
		it('should respond as instructed', () => {
			const res = {
				writeHead: jest.fn(),
				write: jest.fn(),
				end: jest.fn(),
			};
			server.respond(res, 'code', 'content', 'contentType');
			expect(res.writeHead).toHaveBeenCalledWith('code', { 'Content-Type': 'contentType' });
			expect(res.write).toHaveBeenCalledWith('content');
			expect(res.end).toHaveBeenCalled();
		});
	});

	describe('getParts()', () => {
		it('should get the URL parts', () => {
			expect(server.getParts('/documents/3')).toEqual(['documents', '3']);
			expect(server.getParts('')).toEqual([]);
		});
	});

	describe('isValidCommand()', () => {
		it('should indicate valid commands', () => {
			expect(server.isValidCommand('')).toBe(true);
			expect(server.isValidCommand('documents')).toBe(true);
			expect(server.isValidCommand('resources')).toBe(true);
			expect(server.isValidCommand('notfound')).toBe(false);
		});
	});

	describe('doesFileExist()', () => {
		it('should indicate file existance', async () => {
			expect(await server.doesFileExist(__filename)).toBe(true);
			expect(await server.doesFileExist('asdf')).toBe(false);
		});
	});

	describe('getTemplate()', () => {
		it('should get existing templates', async () => {
			expect(await server.getTemplate('index.html')).toEqual(
				expect.stringContaining('<title>Diligen Document Highlighter - Index</title>')
			);
		});
	});

	describe('showIndex()', () => {
		it('should show the index file', async () => {
			const res = {};
			server.respond = jest.fn();
			await server.showIndex(res);
			expect(server.respond).toHaveBeenCalledWith(
				res,
				200,
				expect.stringContaining('<title>Diligen Document Highlighter - Index</title>')
			);
		});
	});

	describe('showDocument()', () => {
		it('should show a valid document', async () => {
			const res = {};
			server.respond = jest.fn();
			await server.showDocument(res, 2);
			expect(server.respond).toHaveBeenCalledWith(
				res,
				200,
				expect.stringContaining('def')
			);
		});

		it('should throw an error for invalid documents', async () => {
			await expect(server.showDocument({}, 'a')).rejects.toHaveProperty(
				'message',
				'404: Document not found.'
			);

			await expect(server.showDocument({}, '0')).rejects.toHaveProperty(
				'message',
				'404: Document not found.'
			);

			await expect(server.showDocument({}, '5')).rejects.toHaveProperty(
				'message',
				'404: Document not found.'
			);
		});
	});

	describe('showResource()', () => {
		it('should show a valid resource', async () => {
			const res = {};
			server.respond = jest.fn();
			await server.showResource(res, 'documents.js');
			expect(server.respond).toHaveBeenCalledWith(
				res,
				200,
				expect.stringContaining('"use strict";'),
				'text/javascript'
			);
		});

		it('should throw an error for invalid resources', async () => {
			await expect(server.showResource({}, 'notfound.js')).rejects.toHaveProperty(
				'message',
				'404: Resource not found.'
			);
		});
	});
});
