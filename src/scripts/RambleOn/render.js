var h = require('mercury').h;
var hg = require('mercury');

var transform = require('./transform');

module.exports = render;

function render(state) {
    return h('div.OneForty', [
        renderComposer(state),
        hg.partial(renderTweets, state.tweets)
    ]);
}

function renderComposer(state) {
    return h('div.Composer', [
        hg.partial(renderTextField, state.text, state.channels.setText),
        h('label.Composer-label--counterName', 'Counter'),
        hg.partial(renderCounterNameField, state.counterName, state.channels.setCounterName),
        h('label.Composer-label--decoratorName', 'Style'),
        hg.partial(renderDecoratorNameField, state.decoratorName, state.counterName, state.channels.setDecoratorName),
        hg.partial(renderPostAction, state.text, state.channels.post)
    ]);
}

function renderTextField(text, channel) {
    return h('textarea.Composer-field--text', {
        name: 'text',
        rows: 4,
        'ev-input': hg.sendValue(channel)
    }, text);
}

function renderCounterNameField(counterName, channel) {
    return h('select.Composer-field--counterName', {
        name: 'counterName',
        value: counterName,
        'ev-change': hg.sendChange(channel)
    }, Object.keys(transform.COUNTERS).map(function (key) {
        var counter = transform.COUNTERS[key];

        return h('option', {
            value: key,
            selected: key === counterName
        },  counter ? counter.replace('#', '1') : '-')
    }));
}

function renderDecoratorNameField(decoratorName, counterName, channel) {
    return h('select.Composer-field--decoratorName', {
        name: 'decoratorName',
        value: decoratorName,
        'ev-change': hg.sendChange(channel)
    }, Object.keys(transform.DECORATORS).map(function (key) {
        return h('option', {
            value: key,
            selected: key === decoratorName
        }, transform.example(counterName, key))
    }));
}

function renderPostAction(text, channel) {
    return (text.length ?
        h('button.Composer-action--post', {
            'ev-click': hg.send(channel)
        }, 'Post') :
        null
    );
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
