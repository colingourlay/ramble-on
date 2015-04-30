var h = require('mercury').h;
var hg = require('mercury');

var transform = require('./transform');

module.exports = render;

function render(state) {
    return h('div.OneForty', [
        hg.partial(renderComposer, state.text, state.decoratorName, state.channels),
        hg.partial(renderTweets, state.tweets)
    ]);
}

function renderComposer(text, decoratorName, channels) {
    return h('div.Composer', [
        h('select.Composer-decoratorName', {
            name: 'decoratorName',
            value: decoratorName,
            'ev-change': hg.sendChange(channels.setConnectorName)
        }, Object.keys(transform.DECORATORS).map(function (name) {
            var decorator = transform.DECORATORS[name];
            var label = [decorator.before, 'TEXT', decorator.after].join('');

            return h('option', {
                value: name,
                selected: name === decoratorName
            }, transform.example(name))
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
    var numOfCount = (index + 1) + '/' + tweets.length;
    var numOfCountModifier = (tweets.length > 99) ?
        '.Tweet-numOfCount--tripleDigit' : (tweets.length > 9) ?
        '.Tweet-numOfCount--doubleDigit' : '';
    var charactersRemaining = 140 - tweet.length;
    var charactersRemainingModifier = ((charactersRemaining < 10) ?
        '.Tweet-charactersRemaining--singleDigit' : (charactersRemaining < 100) ?
            '.Tweet-charactersRemaining--doubleDigit' : '');

    return h('div.Tweet', [
        h('div.Tweet-text', {
            innerHTML: tweet.html
        }),
        h('strong.Tweet-numOfCount' + numOfCountModifier, [
            numOfCount
        ]),
        h('strong.Tweet-charactersRemaining' + charactersRemainingModifier, [
            String(charactersRemaining)
        ])
    ]);
}
