var http = require('http')
    , https = require('https')
    , querystring = require('querystring')
    , _ = require('underscore')
    , jsdom = require("jsdom");

var ALGOLIA_API_KEY = '8ece23f8eb07cd25d40262a1764599b1'
    , ALGOLIA_APP_ID = 'UJ5WYC0L7X'
    , ALGOLIA_PATH = '/1/indexes/Item_production/query'
    , ALGOLIA_HOSTNAME = 'uj5wyc0l7x-dsn.algolia.io'
    , HN_ITEM_URL = 'news.ycombinator.com/item?id='
    , HN_HOSTNAME = 'hacker-news.firebaseio.com'
    , HN_API_USER_PATH = '/v0/user/$USERNAME.json'
    , HN_USER = 'user'
    , HN_ITEM = 'item'
    , JQUERY_LOC = 'http://code.jquery.com/jquery.js';

function getUserData(userId, cb) {
    var options = {
        hostname: HN_HOSTNAME,
        path: HN_API_USER_PATH.replace('$USERNAME', userId),
        method: 'GET'
    };
    https.request(options, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            cb(null, JSON.parse(data));
        });
    }).end();
}

/**
 * Search HN via Algolia.
 * TODO: Maybe this will be exposed via real HN API one day...?
 * @param opts
 * @param cb
 */
function search(opts, cb) {
    /*
     Params as accepted by the Algolia API.
     Algolia is a start-up that powers Hacker News Search API.
     I pulled this stuff by intercepting the network requests in chrome.
     */
    var params = {
        query: 'whos hiring',
        hitsPerPage: 25,
        page: 0,
        getRankingInfo: 1,
        minWordSizefor1Typo: 5,
        minWordSizefor2Typos: 9,
        tagFilters: ["story"],
        numericFilters: [],
        advancedSyntax: true,
        queryType: 'prefixNone'
    };

    _.extend(params, opts || {});

    if (!params.query) {
        cb('Must pass query')
    }
    else {
        // POST data
        var data = JSON.stringify({
            "params": querystring.stringify(params),
            "apiKey": ALGOLIA_API_KEY,
            "appID": ALGOLIA_APP_ID
        });

        // HTTP Options
        var options = {
            hostname: ALGOLIA_HOSTNAME,
            path: ALGOLIA_PATH,
            method: 'POST',
            headers: {
                'X-Algolia-API-Key': ALGOLIA_API_KEY,
                'X-Algolia-Application-Id': ALGOLIA_APP_ID,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        var req = http.request(options, function (res) {
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                cb(null, JSON.parse(data));
            });
        });

        req.write(data);
        req.end();
    }
}

/**
 * Scrape root comments from HN thread.
 * The HN API only returns identifiers of each comment, which means you'd have to send another HTTP request for
 * every single comment! Much faster just to scrape the web page instead however less robust.
 * TODO: Once the HN API matures maybe this will be easier.
 * @param itemId A HN item identifier. Thankfully the objectId returned from Algolia is the same thing :)
 * @param cb
 */
function getRootComments(itemId, cb) {
    var item = 'http://www.corsproxy.com/' + HN_ITEM_URL + itemId;
    console.log('item', item);
    jsdom.env(
        item,
        [JQUERY_LOC],
        function (errors, window) {
            var commentCells = window.$('td.default');
            var comments = [];
            _.each(commentCells, function (commentCell) {
                commentCell = window.$(commentCell);
                var parent = commentCell.parent();
                // HN uses an img element of varying length to add nesting to comments... ew!
                var imgWidth = window.$(parent.children()[0]).find('img').attr('width');
                var rootComment = imgWidth == 0;
                if (rootComment) {
                    var userId, commentId;
                    var links = commentCell.find('.comhead').find('a');
                    if (links.length == 2) {
                        _.each(links, function (link) {
                            link = window.$(link);
                            var href = link.attr('href');
                            var id = href.split('?')[1].split('=')[1];
                            if (href.substring(0, HN_USER.length) == HN_USER) {
                                userId = id;
                            }
                            else if (href.substring(0, HN_ITEM.length) == HN_ITEM) {
                                commentId = id;
                            }
                        });

                        var lines = [];

                        _.each(commentCell.find('span.comment').children(), function (e) {
                            if (e._tagName == 'p' || e._tagName == 'font') {
                                e = window.$(e);
                                var subParagraphs = e.find('p');
                                var text;
                                if (subParagraphs.length) {
                                    _.each(subParagraphs, function (p) {
                                        p = window.$(p);
                                        lines.push(p.text());
                                    });
                                }
                                else if ((text = e.text()).length) {
                                    lines.push(text);
                                }
                            }

                        });

                        // Remove last paragraph which is always 'reply'
                        //lines.splice(lines.length-1, 1);
                        var lastIndex = (lines.length - 1);
                        if (lines[lastIndex].trim() == 'reply') {
                            delete lines[lastIndex];
                        }

                        console.log('lines', lines);

                        //var text = _.map(paragraphs, function (x) {return window.$(x).text()}).join('\n');
                        //noinspection JSUnusedAssignment
                        var comment = {
                            text: lines.join('\n'),
                            id: commentId,
                            user: {
                                id: userId
                            }
                        };
                        comments.push(comment);
                    }
                    else {
                        console.warn('Unable to parse comhead element');
                    }
                }
            });
            cb(null, comments);
        }
    );
}

module.exports = {
    getRootComments: getRootComments,
    search: search,
    getUserData: getUserData
};


//getRootComments('8611198', function (err, comments) {
//    if (err) {
//        console.error(err);
//    }
//    else {
//        console.log('comments', comments);
//    }
//});

//search({
//    query: 'hiring'
//}, function (err, res) {
//    if (err) {
//        console.error(err);
//    }
//    else {
//        console.log('res', res);
//    }
//});
//
//
//getUserData('mtford', function (err, user) {
//    if (err) {
//        console.error(err);
//    }
//    else {
//        console.log('user', user);
//    }
//});