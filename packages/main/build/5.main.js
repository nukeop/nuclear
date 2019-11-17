exports.ids = [5];
exports.modules = {

/***/ "./node_modules/get-port/index.js":
/*!****************************************!*\
  !*** ./node_modules/get-port/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst net = __webpack_require__(/*! net */ \"net\");\n\nconst getAvailablePort = options => new Promise((resolve, reject) => {\n\tconst server = net.createServer();\n\tserver.unref();\n\tserver.on('error', reject);\n\tserver.listen(options, () => {\n\t\tconst {port} = server.address();\n\t\tserver.close(() => {\n\t\t\tresolve(port);\n\t\t});\n\t});\n});\n\nconst portCheckSequence = function * (ports) {\n\tif (ports) {\n\t\tyield * ports;\n\t}\n\n\tyield 0; // Fall back to 0 if anything else failed\n};\n\nmodule.exports = async options => {\n\tlet ports = null;\n\n\tif (options) {\n\t\tports = typeof options.port === 'number' ? [options.port] : options.port;\n\t}\n\n\tfor (const port of portCheckSequence(ports)) {\n\t\ttry {\n\t\t\treturn await getAvailablePort({...options, port}); // eslint-disable-line no-await-in-loop\n\t\t} catch (error) {\n\t\t\tif (error.code !== 'EADDRINUSE') {\n\t\t\t\tthrow error;\n\t\t\t}\n\t\t}\n\t}\n\n\tthrow new Error('No available ports found');\n};\n\nmodule.exports.makeRange = (from, to) => {\n\tif (!Number.isInteger(from) || !Number.isInteger(to)) {\n\t\tthrow new TypeError('`from` and `to` must be integer numbers');\n\t}\n\n\tif (from < 1024 || from > 65535) {\n\t\tthrow new RangeError('`from` must be between 1024 and 65535');\n\t}\n\n\tif (to < 1024 || to > 65536) {\n\t\tthrow new RangeError('`to` must be between 1024 and 65536');\n\t}\n\n\tif (to < from) {\n\t\tthrow new RangeError('`to` must be greater than or equal to `from`');\n\t}\n\n\tconst generator = function * (from, to) {\n\t\tfor (let port = from; port <= to; port++) {\n\t\t\tyield port;\n\t\t}\n\t};\n\n\treturn generator(from, to);\n};\n\n\n//# sourceURL=webpack:///./node_modules/get-port/index.js?");

/***/ })

};;