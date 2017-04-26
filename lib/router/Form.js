"use strict";

const bodyParser = require("body-parser");

const Middleware = require("srv-core").Middleware;

/**
 * Posted forms parsing middleware.
 * Parses POST'ed forms (application/x-www-form-urlencoded).
 * Parsed form saved in <code>req.body</code>.
 *
 * @extends Middleware
 */
class Form extends Middleware {

    /**
     * Creates posted form parsing middleware instance.
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
        this.router.use(bodyParser.urlencoded({
            extended: true,
            verify: function(req, res, buf) {
                req.rawBody = buf;
            }
        }));
    }

}

module.exports = Form;
