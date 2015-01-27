/**
 * This module uses jquery ajax to provide full interaction with CouchDB as a backend.
 *
 * @param {String} host - Base URL of CouchDB
 * @returns {Object}
 * @module
 */
module.exports = function (host) {
    host = host || 'http://localhost:5984';
    if (host.length) {
        if (host[host.length - 1] == '/') {
            host = host.substring(0, host.length - 1);
        }
    }
    host = host.replace('http://', '');

    /**
     * Encapsulates auth strategy e.g. session, token. Used in every HTTP request to couch.
     */
    var auth = null;

    var AUTH_METHOD = {
        BASIC: 'basic'
    };

    var MIME = {
        JSON: 'application/json'
    };

    var DEFAULT_ADMIN = 'mtford';


    /**
     * Encapsulates errors produced whilst interacting with CouchDB over HTTP.
     *
     * @param opts
     * @param {String} [opts.message] - Error message
     * @param {jqXHR} [opts.xhr] - jqXHR object
     * @param {Error} [opts.thrown] - An Error object
     * @constructor
     */
    function CouchError(opts) {
        _.extend(this, opts);
        Object.defineProperty(this, 'isHttpError', {
            get: function () {
                return !!this.xhr;
            }
        });
        Object.defineProperty(this, 'isThrownError', {
            get: function () {
                return !!this.thrown;
            }
        });
    }

    /**
     * Configure the ajax options to match the configured authorisation method.
     * @param opts
     * @param [_auth] - override the configured auth method
     * @private
     */
    function _configureAuth(opts, _auth) {
        var a = _auth || auth;
        if (a) {
            if (a.method == AUTH_METHOD.BASIC) {
                // Note: jQuery >=1.7 has username/password options. I do this simply for backwards
                // compatibility.
                opts.headers = opts.headers || {};
                opts.headers.Authorization = 'Basic ' + btoa(a.username + ':' + a.password);
            }
        }
    }

    function isString(str) {
        return typeof str == 'string' || str instanceof String;
    }

    /**
     * Send a HTTP request
     * @param {Object} opts - The usual jquery opts +
     * @param {Object} opts.path - Path to append to host
     * @param {Function} [cb]
     */
    var http = function (opts, cb) {
        cb = cb || function () {
            // Do nothing.
        };
        opts = _.extend({
            type: 'GET',
            dataType: 'json',
            contentType: MIME.JSON
        }, opts || {});
        if (opts.contentType == MIME.JSON) {
            var data = opts.data;
            if (data) {
                if (!isString(data)) {
                    opts.data = JSON.stringify(data);
                }
            }
        }
        _configureAuth(opts);
        var path = opts.path || '';
        if (opts.path != null) delete opts.path;
        if (!opts.url) {
            var protocol = 'http://';
            opts.url = protocol + host + (path.length ? (path[0] == '/' ? '' : '/') : '') + path;
        }
        console.log('ajax opts', opts);
        $.ajax(opts).done(function (data) {
            cb(null, data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (errorThrown instanceof Error) {
                cb(new CouchError({thrown: errorThrown}));
            }
            else {
                cb(new CouchError({message: errorThrown, xhr: jqXHR, status: jqXHR.status}));
            }
        });
    };

    /**
     * @param opts
     * @param opts.username
     * @param opts.password
     * @param cb
     */
    var createUser = function (opts, cb) {
        var username = opts.username,
            password = opts.password;
        var fullyQualifiedUsername = 'org.couchdb.user:' + username;
        http({
            path: '_users/' + fullyQualifiedUsername,
            type: 'PUT',
            data: {
                _id: fullyQualifiedUsername,
                name: username,
                type: 'user',
                roles: [],
                password: password
            }
        }, cb);
    };

    /**
     * The first time, an admin user can be created without any permissions. Subsequently, you must authenticate
     * as an another admin user
     * @param opts
     * @param opts.username
     * @param opts.password
     * @param cb
     */
    var createAdminUser = function (opts, cb) {
        var username = opts.username || DEFAULT_ADMIN,
            password = opts.password || DEFAULT_ADMIN;
        http({
            path: '_config/admins/' + username,
            type: 'PUT',
            data: '"' + password + '"'
        })
    };

    /**
     * @param authOpts
     * @param authOpts.username
     * @param authOpts.password
     * @param cb
     */
    var basicAuth = function (authOpts, cb) {
        var potentialAuth = {
            method: AUTH_METHOD.BASIC,
            username: authOpts.username,
            password: authOpts.password
        };
        var httpOpts = {
            path: '_session',
            type: 'POST',
            contentType: "application/x-www-form-urlencoded"
        };
        _configureAuth(httpOpts, potentialAuth);
        http(httpOpts, function (err, data) {
            if (!err) {
                if (data.ok) {
                    auth = potentialAuth;
                }
                else {
                    cb(new CouchError(data));
                }
            }
            else {
                cb(err);
            }
        });
    };

    /**
     * @param [opts]
     * @param [opts.username]
     * @param [opts.password]
     * @param cb
     */
    var deleteAllUsers = function (opts, cb) {
        var httpOpts = {
            path: '_users/',
            type: 'DELETE'
        };
        _configureAuth(httpOpts, {
            method: AUTH_METHOD.BASIC,
            username: opts.username || DEFAULT_ADMIN,
            password: opts.password || DEFAULT_ADMIN
        });
        http(httpOpts, cb)
    };

    function optsOrCallback(optsOrCb, cb) {
        var opts;
        if (optsOrCb instanceof Function) {
            cb = optsOrCb;
            opts = {};
        }
        else {
            opts = optsOrCb;
        }
        return {opts: opts, cb: cb};
    }

    var API = {
        info: _.partial(http, {path: ''}),
        createUser: createUser,
        basicAuth: basicAuth,
        resetAuth: function () {
            auth = null;
        },
        admin: {
            createAdminUser: createAdminUser,
            deleteAllUsers: deleteAllUsers,
            /**
             * Clear out the database. Useful during testing.
             * @param [optsOrCb]
             * @param [optsOrCb.username]
             * @param [optsOrCb.password]
             * @param cb
             */
            reset: function (optsOrCb, cb) {
                var __ret = optsOrCallback(optsOrCb, cb);
                var opts = __ret.opts;
                cb = __ret.cb;
                deleteAllUsers(opts, cb);
            }
        },
        HTTP_STATUS: {
            UNAUTHORISED: 401
        }
    };

    Object.defineProperty(API, 'auth', {
        get: function () {
            return auth;
        }
    });

    return API
};