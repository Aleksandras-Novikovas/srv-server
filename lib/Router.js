"use strict";

const assert = require("assert");
const express = require("express");

const Exception = require("srv-core").Exception;
const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;
const Log = require("srv-log").Log;
const Util = require("srv-util").Util;

/**
 * Class creates router for Express application.
 */
class Router {

    /**
     * Class logger.
     *
     * @type {Log}
     */
    static get log() {
        return _log;
    }

    /**
     * Creates and configures router for express.
     * Uses <code>server.router.modules</code> configuration parameter
     * to read list of modules should be loaded and added to router.
     * Every module should be an instance of {@link Middleware} class and implement <code>bindToRouter</code>.
     *
     * @param {function} app - Express application
     * @param {function} callback - Callback executed when finished
     */
    static create(app, callback) {
        assert.equal(typeof app, "function", "argument 'app' must be function");
        assert.equal(typeof callback, "function", "argument 'callback' must be function");
        let routerModules = Config.getValue("server.router.modules");
        if (typeof routerModules === "string") {
            routerModules = [routerModules];
        }
        assert.equal(Array.isArray(routerModules), true, "Configuration for router modules should be an instance of Array");
        const router = express.Router();
        Util.arrayExecutor(routerModules, true, function(index, moduleName, cb) {
            if (!moduleName) {
                // Empty module name - skip it
                return cb();
            }
            Router.log.debug({moduleName: moduleName}, "Initializing router module");
            const moduleConfig = Config.getValue("server.router." + moduleName);
            if (!moduleConfig) {
                return cb(new Exception("Missing module '" + moduleName + "' configuration"));
            }
            if (!moduleConfig.module) {
                return cb(new Exception("Module is not specified in '" + moduleName + "' configuration"));
            }
            let ModuleClass;
            try {
                ModuleClass = require(moduleConfig.module);
            } catch (err) {
                return cb(new Exception("Failed to load module '" + moduleName + "'", err));
            }
            if (moduleConfig.class) {
                ModuleClass = ModuleClass[moduleConfig.class];
            }
            const moduleInstance = new ModuleClass(app, router);
            if (moduleInstance instanceof Middleware) {
                moduleInstance.bindToRouter();
                return cb();
            } else {
                return cb(new Exception("Loaded module '" + moduleName + "' is not instance of Middleware"));
            }
        }, function(err, result) {
            // err is always null
            // If last value in array is Exception - fail
            if (result[result.length - 1] instanceof Exception) {
                // Error occured while initializing router middleware modules
                return callback(result[result.length - 1]);
            }
            // Final middleware: respond with HTTP 404 (Not Found)
            router.use(function(req, res) {
                res.sendStatus(404);
            });
            return callback(null, router);
        });
    }
}

// Static value for Router.log
const _log = new Log(Router);

module.exports = Router;