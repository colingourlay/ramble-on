import styles from './Composer.css';
import {h, partial, send, sendChange, sendValue} from 'mercury';
import {COUNTERS, DECORATORS, example} from '../util/transform';
import {pluralise} from '../util';

export default function render(state) {
    return h('div', {className: styles.root}, [
        partial(renderText,
            state.isPosting,
            state.text,
            state.channels.setText),
        h('label', {className: styles.counterLabel}, 'Counter'),
        partial(renderCounter,
            state.isPosting,
            state.counterName,
            state.channels.setCounterName),
        h('label', {className: styles.decoratorLabel}, 'Style'),
        partial(renderDecorator,
            state.isPosting,
            state.decoratorName,
            state.counterName,
            state.channels.setDecoratorName),
        partial(renderPost,
            state.isPosting,
            state.text,
            state.tweets,
            state.numTweetsPosted,
            state.channels.post)
    ]);
}

function renderText(isPosting, text, channel) {
    return h('textarea', {
        className: styles.text,
        name: 'text',
        rows: 4,
        value: text,
        placeholder: '1) Write a bunch of stuff here            \n2) Choose your formatting              \n3) Post a chain of tweets                  \n4) Party 🎉',
        disabled: isPosting,
        readOnly: isPosting,
        'ev-input': sendValue(channel)
    });
}

function renderCounter(isPosting, counterName, channel) {
    return h('select', {
        className: styles.counter,
        name: 'counterName',
        value: counterName,
        disabled: isPosting,
        'ev-change': sendChange(channel)
    }, Object.keys(COUNTERS).map(function (key) {
        var counter = COUNTERS[key];

        return h('option', {
            value: key,
            selected: key === counterName
        },  counter ? counter.replace('#', '1') : '-')
    }));
}

function renderDecorator(isPosting, decoratorName, counterName, channel) {
    return h('select', {
        className: styles.decorator,
        name: 'decoratorName',
        value: decoratorName,
        disabled: isPosting,
        'ev-change': sendChange(channel)
    }, Object.keys(DECORATORS).map(function (key) {
        return h('option', {
            value: key,
            selected: key === decoratorName
        }, example(counterName, key))
    }));
}

function renderPost(isPosting, text, tweets, numTweetsPosted, channel) {
    const pTweets = pluralise('tweet', tweets.length);
    const reaction = tweets.length < 10 ? '' :
        tweets.length < 15 ? 'seriously?' :
        tweets.length < 20 ? 'whoa there!' :
        tweets.length < 25 ? 'stop. just, stop.' :
        'OH, COME ON!';


    return text.length ? h('button', {
        className: styles.post,
        disabled: isPosting,
        'ev-click': send(channel)
    }, isPosting ? `Posting ${numTweetsPosted+1}${tweets.length > 1 ? ' of ' + tweets.length : ''} ${pTweets}...` :
        `Post ${tweets.length} ${pTweets}${reaction ? ' (' + reaction +')' : ''}`
    ) : h('br');
}
