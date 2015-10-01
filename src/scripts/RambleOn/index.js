var hg = require('mercury');
var window = require('global/window');

var ch = require('../util').createPropsChannel;
var transform = require('./transform');

var TWITTER_API_KEYS = {
    'ramble-on.surge.sh': 'moFWkRoBcJ4Z212YGljaYxWUr',
    'localhost': 'ESqb2TH1c4ZsRPZ3QdquCT7jt',
    '127.0.0.1': 'ESqb2TH1c4ZsRPZ3QdquCT7jt'
};
var OAUTH_PROXY = 'https://auth-server.herokuapp.com/proxy';
var ONE_MINUTE = 60 * 1000;
var POST_DELAY = ONE_MINUTE;
var RATE_LIMIT_WINDOW = 15 * ONE_MINUTE;
var MAX_RETRIES = 5;

module.exports = RambleOn;

function RambleOn(initialState) {
    initialState = initialState || {};
    initialState.text = initialState.text || '';
    initialState.counterName = initialState.counterName || Object.keys(transform.COUNTERS)[0];
    initialState.decoratorName = initialState.decoratorName || Object.keys(transform.DECORATORS)[0];

    var state = hg.state({
        text: hg.value(initialState.text),
        counterName: hg.value(initialState.counterName),
        decoratorName: hg.value(initialState.decoratorName),
        tweets: hg.value([]),
        channels: {
            setText: ch('text'),
            setCounterName: ch('counterName'),
            setDecoratorName: ch('decoratorName'),
            post: post
        }
    });

    var boundTweetUpdater = updateTweets.bind(null, state)

    state.text(boundTweetUpdater);
    state.counterName(boundTweetUpdater);
    state.decoratorName(boundTweetUpdater);

    // Trigger tweet updater, using initial state
    boundTweetUpdater();

    hello.init({
        twitter: TWITTER_API_KEYS[window.location.hostname]
    }, {
        oauth_proxy: OAUTH_PROXY
    });

    hello.on('auth', function () {
        console.log('hello.auth', arguments);
    });

    return state;
}

function updateTweets(state) {
    state.tweets.set(transform(state.text(), {
        counterName: state.counterName(),
        decoratorName: state.decoratorName()
    }));
}

function post(state) {
    var tweets = state.tweets();
    var retries = 0;
    var lastConfig;

    hello('twitter').login({force: false}).then(delayedNext, onError);
    // hello('twitter').login().then(delayedNext, onError);

    function next(response, isRetry) {
        var config = {
            apiPath: 'me/share',
            data: {}
        };

        if (!isRetry) {

            retries = 0;

            if (!tweets.length) { return done(); }

            config.data.message = tweets.shift().text;

            if (response.id_str) {
                config.data.id = response.id_str;
                config.apiPath = 'me/reply';
            }

            lastConfig = config;

        } else {

            retries++;

            if (retries >= MAX_RETRIES) {
                return done({error: new Error('Too many failed retries')});
            }

            config = lastConfig;

        }

        hello('twitter').api(config.apiPath, 'POST', config.data).then(delayedNext, onError);
    }

    function delayedNext(response) {
        console.log('Response:', response);

        if (response.authResponse || response.id) {
            console.log('Waiting for ' + POST_DELAY / ONE_MINUTE + ' minutes');
            return setTimeout(next, POST_DELAY, response);
        }

        console.log('Waiting for next window');
        return setTimeout(next, RATE_LIMIT_WINDOW, response, true);

    }

    function onError(err) {
        done(err.error.message);
    }

    function done(err) {
        if (err) {
            return console.log('failure, with error:' , err);
        }

        console.log('success');
    }
}

RambleOn.render = require('./render');
