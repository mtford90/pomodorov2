/**
 * @param {String} baseURL - Base URL of CouchDB
 * @returns {Object}
 */
module.exports = function (baseURL) {
    baseURL = baseURL || 'http://127.0.0.1:5984';
    if (baseURL.length) {
        if (baseURL[baseURL.length - 1] == '/') {
            baseURL = baseURL.substring(0, baseURL.length - 1);
        }
    }
    console.log(baseURL);
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
        })
    }

    /**
     * Send a HTTP request
     * @param {Object} opts - The usual jquery opts +
     * @param {Object} opts.path - Path to append to baseURL
     * @param {Function} [cb]
     */
    var http = function (opts, cb) {
        cb = cb || function () {};
        opts = _.extend({
            type: 'GET'
        }, opts || {});
        var path = opts.path || '';
        opts.url = baseURL + (path.length ? (path[0] == '/' ? '' : '/') : '') + path;
        console.log('ajax opts', opts);
        $.ajax(opts).done(function (data) {
            cb(null, data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (errorThrown) {
                cb(new CouchError({thrown: errorThrown}));
            }
            else {
                cb(new CouchError({message: textStatus, xhr: jqXHR}));
            }
        });
    };

    return {
        info: _.partial(http, {path: ''})
    }
};