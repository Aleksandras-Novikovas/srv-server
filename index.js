"use strict";

const HTTPServer = require("./lib/HTTPServer");
const HTTPSServer = require("./lib/HTTPSServer");

module.exports = {
    HTTPServer: HTTPServer,
    HTTPSServer: HTTPSServer
};
