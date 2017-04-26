"use strict";

const bodyParser = require("body-parser");

const Middleware = require("srv-core").Middleware;

/**
 * Posted JSON parsing middleware.
 * Parses POST'ed JSON data (application/json).
 * Parsed JSON saved in <code>req.body</code>.
 *
 * @extends Middleware
 */
class JSON extends Middleware {

    /**
     * Creates JSON parsing middleware instance.
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
        this.router.use(bodyParser.json({
            verify: function(req, res, buf) {
                req.rawBody = buf;
            }
        }));
    }

}

module.exports = JSON;
