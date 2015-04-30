var hg = require('mercury');

var ch = require('../util').createPropsChannel;
var transform = require('./transform');

module.exports = RambleOn;

function RambleOn(initialState) {
    initialState = initialState || {};
    initialState.text = initialState.text || '';
    initialState.decoratorName = initialState.decoratorName || Object.keys(transform.DECORATORS)[0];

    var state = hg.state({
        text: hg.value(initialState.text),
        decoratorName: hg.value(initialState.decoratorName),
        tweets: hg.value([]),
        channels: {
            setText: ch('text'),
            setConnectorName: ch('decoratorName')
        }
    });

    var boundTweetUpdater = updateTweets.bind(null, state)

    state.text(boundTweetUpdater);
    state.decoratorName(boundTweetUpdater);

    // Trigger tweet updater, using initial state
    boundTweetUpdater();

    return state;
}

function updateTweets(state) {
    state.tweets.set(transform(state.text(), transform.DECORATORS[state.decoratorName()]));
}

RambleOn.render = require('./render');
