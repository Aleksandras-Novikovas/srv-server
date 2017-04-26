"use strict";

const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);

const Middleware = require("srv-core").Middleware;

/**
 * Posted XML parsing middleware.
 * Parses POST'ed XML data (application/xml).
 * Parsed XML saved in <code>req.body</code>.
 *
 * @extends Middleware
 */
class XML extends Middleware {

    /**
     * Creates XML parsing middleware instance.
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
    }

    /**
     * Binds this middleware to router
     */
    bindToRouter() {
        // TODO: remove verify functions from body parser!!!
        this.router.use(bodyParser.xml({
            // Reject payload bigger than 1 MB
            limit: "1MB",
            xmlParseOptions: {
                explicitArray: false,
                explicitRoot: false
            },
            verify: function(req, res, buf) {
                req.rawBody = buf;
            }
        }));
    }

}

module.exports = XML;
