var h = require('mercury').h;
var hg = require('mercury');

var CONNECTORS = require('./constants').CONNECTORS;

module.exports = render;

function render(state) {
    return h('div.OneForty', [
        hg.partial(renderComposer, state.text, state.connectorName, state.channels),
        hg.partial(renderTweets, state.tweets)
    ]);
}

function renderComposer(text, connectorName, channels) {
    return h('div.Composer', [
        h('select.Composer-connectorName', {
            name: 'connectorName',
            value: connectorName,
            'ev-change': hg.sendChange(channels.setConnectorName)
        }, Object.keys(CONNECTORS).map(function (name) {
            var connector = CONNECTORS[name];
            var label = [connector.prefix, 'TEXT', connector.suffix].join('');

            return h('option', {
                value: name,
                selected: name === connectorName
            }, label)
        })),
        h('textarea.Composer-text', {
            name: 'text',
            rows: 4,
            'ev-input': hg.sendValue(channels.setText)
        }, text)
    ]);
}

function renderTweets(tweets) {
    return h('div.Tweets', tweets.map(renderTweet.bind()));
}

function renderTweet(tweet, index, tweets) {
    var charactersRemaining = 140 - tweet.length;
    var charactersRemainingModifier = (charactersRemaining < 0) ?
        '.Tweet-charactersRemaining--negative' : (charactersRemaining < 10) ?
        '.Tweet-charactersRemaining--singleDigit' : (charactersRemaining < 100) ?
            '.Tweet-charactersRemaining--doubleDigit' : '';

    return h('div.Tweet', [
        h('div.Tweet-text', {
            innerHTML: tweet.html
        }),
        h('span.Tweet-numOfCount', {
            title: (index + 1) + '/' + tweets.length
        }),
        h('strong.Tweet-charactersRemaining' + charactersRemainingModifier, {
            title: String(charactersRemaining)
        })
    ]);
}
