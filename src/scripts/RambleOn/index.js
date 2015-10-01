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
var RATE_LIMIT_WINDOW = 15 * ONE_MINUTE;
var MAX_REQUESTS_PER_RATE_LIMIT_WINDOW = 15;

hello.init({
    twitter: TWITTER_API_KEYS[window.location.hostname]
}, {
    oauth_proxy: OAUTH_PROXY
});

// hello.on('auth', function () {
//     console.log('hello.auth', arguments);
// });

module.exports = RambleOn;

function RambleOn(initialState) {
    initialState = initialState || {};
    initialState.text = initialState.text || '';
    initialState.counterName = initialState.counterName || Object.keys(transform.COUNTERS)[0];
    initialState.decoratorName = initialState.decoratorName || Object.keys(transform.DECORATORS)[0];

    var state = hg.state({
        isPosting: hg.value(false),
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

    var boundTweetUpdater = updateTweets.bind(null, state);

    state.text(boundTweetUpdater);
    state.counterName(boundTweetUpdater);
    state.decoratorName(boundTweetUpdater);

    boundTweetUpdater();

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
    var initialLength = tweets.length;

    state.isPosting.set(true);

    hello('twitter')
    .login({force: false})
    .then(next, done);

    function next(response, isRetry) {
        var config = {
            apiPath: 'me/share',
            data: {}
        };

        if (!tweets.length) {
            return done(null, response);
        }

        config.data.message = encodeURIComponent(tweets.shift().text);

        if (response && response.id_str) {
            config.data.id = response.id_str;
            config.apiPath = 'me/reply';
        }

        hello('twitter')
        .api(config.apiPath, 'POST', config.data)
        .then(next, done);
    }

    function done(err, response) {

        if (err) {

            console.log('Error:', err);

            if (tweets.length + 1 >= initialLength) {
                alert('Failed to post any status updates.');
            } else {
                alert('Failed to post all status updates.');
            }

        } else {

            alert('Posted status updates!');

        }

        state.text.set('');
        state.isPosting.set(false);
    }
}

RambleOn.render = require('./render');
