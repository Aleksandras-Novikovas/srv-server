"use strict";

const bunyanMiddleware = require("bunyan-middleware");

const Middleware = require("srv-core").Middleware;
const Log = require("srv-log").Log;

/**
 * Request logger middleware.
 *
 * @extends Middleware
 */
class RequestLog extends Middleware {

    /**
     * Creates request logger middleware instance.
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
        this.router.use(bunyanMiddleware({
            // Hackish (undocumented) way to acquire underlying logger
            logger: new Log()._log,
            logName: "reqId",
            requestStart: true
        }));
    }

}

module.exports = RequestLog;
