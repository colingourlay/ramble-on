var hg = require('mercury');

var ch = require('../util').createPropsChannel;
var transform = require('./transform');

var CONNECTORS = require('./constants').CONNECTORS;

module.exports = OneForty;

function OneForty() {
    var state = hg.state({
        text: hg.value(''),
        connectorName: hg.value('ellipses'),
        tweets: hg.value([]),
        channels: {
            setText: ch('text'),
            setConnectorName: ch('connectorName')
        }
    });

    var boundTweetUpdater = updateTweets.bind(null, state)

    state.text(boundTweetUpdater);
    state.connectorName(boundTweetUpdater);

    return state;
}

function updateTweets(state) {
    state.tweets.set(transform(state.text(), CONNECTORS[state.connectorName()]));
}

OneForty.render = require('./render');
