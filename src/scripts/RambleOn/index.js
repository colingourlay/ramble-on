var hg = require('mercury');

var ch = require('../util').createPropsChannel;
var transform = require('./transform');

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
        twitter: 'ESqb2TH1c4ZsRPZ3QdquCT7jt'
    }, {
        oauth_proxy: 'https://auth-server.herokuapp.com/proxy'
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

    hello('twitter').login().then(delayedNext, onError);

    function next(response) {
        var tweet, data, apiPath;

        console.log(response);

        if (!tweets.length) { return done(); }

        tweet = tweets.shift();

        data = {
            message: tweet.text
        };

        apiPath = 'me/share';

        if (response.id_str) {
            data.id = response.id_str;
            apiPath = 'me/reply';
        }

        hello('twitter').api(apiPath, 'POST', data).then(delayedNext, onError);
    }

    function delayedNext(data) {
        setTimeout(next, 750, data);
    }

    function onError() {
        console.log('error', arguments);
    }

    function done(data) {
        console.log('done');
    }
}

RambleOn.render = require('./render');
