import styles from './Composer.css';
import { partial, send, sendChange, sendValue } from 'mercury';
import { COUNTERS, DECORATORS, example } from '../util/transform';
import { hyper, pluralise } from '../util';
import humanize from 'humanize-duration';

const h = hyper(styles);

export default function render(state) {
    return h('div.root', [
        partial(
            renderText,
            state.isPosting,
            state.text,
            state.channels.setText
        ),
        h('label.counterLabel', 'Counter'),
        partial(
            renderCounter,
            state.isPosting,
            state.counterName,
            state.channels.setCounterName
        ),
        h('label.decoratorLabel', 'Style'),
        partial(
            renderDecorator,
            state.isPosting,
            state.decoratorName,
            state.counterName,
            state.channels.setDecoratorName
        ),
        partial(
            renderPost,
            state.isPosting,
            state.text,
            state.tweets,
            state.numTweetsPosted,
            state.channels.post
        ),
        partial(
            renderTiming,
            state.isPosting,
            state.tweets,
            state.timing,
            state.channels.setTiming
        )
    ]);
}

function renderText(isPosting, text, channel) {
    return h('textarea.text', {
        name: 'text',
        rows: 4,
        value: text,
        placeholder:
            '1. Write a bunch of stuff here            \n2. Tweak the formatting                  \n3. Hit the big post button                 \n4. Party 🎉',
        disabled: isPosting,
        readOnly: isPosting,
        'ev-input': sendValue(channel)
    });
}

function renderCounter(isPosting, counterName, channel) {
    return h(
        'select.counter',
        {
            name: 'counterName',
            value: counterName,
            disabled: isPosting,
            'ev-change': sendChange(channel)
        },
        Object.keys(COUNTERS).map(function(key) {
            var counter = COUNTERS[key];

            return h(
                'option',
                {
                    value: key,
                    selected: key === counterName
                },
                counter ? counter.replace('#', '1') : '-'
            );
        })
    );
}

function renderDecorator(isPosting, decoratorName, counterName, channel) {
    return h(
        'select.decorator',
        {
            name: 'decoratorName',
            value: decoratorName,
            disabled: isPosting,
            'ev-change': sendChange(channel)
        },
        Object.keys(DECORATORS).map(function(key) {
            return h(
                'option',
                {
                    value: key,
                    selected: key === decoratorName
                },
                example(counterName, key)
            );
        })
    );
}

function renderTiming(isPosting, tweets, timing, channel) {
    return tweets.length > 1
        ? h('div.timingContainer', [
              h(
                  'label.timingLabel',
                  `Wait ${humanize(timing, { round: true })} between posts`
              ),
              h('input.timing', {
                  name: 'timing',
                  type: 'range',
                  min: 0,
                  max: 600000,
                  step: timing < 60000 ? 5000 : 10000,
                  value: timing,
                  disabled: isPosting,
                  readOnly: isPosting,
                  'ev-input': sendChange(channel)
              })
          ])
        : h('');
}

function renderPost(isPosting, text, tweets, numTweetsPosted, channel) {
    const pTweets = pluralise('tweet', tweets.length);
    const reaction =
        tweets.length < 10
            ? ''
            : tweets.length < 15
              ? 'seriously?'
              : tweets.length < 20
                ? 'whoa there!'
                : tweets.length < 25 ? 'stop. just, stop.' : 'OH, COME ON!';

    return text.length
        ? h(
              'button.post',
              {
                  disabled: isPosting,
                  'ev-click': send(channel)
              },
              isPosting
                  ? `Posting ${numTweetsPosted + 1}${tweets.length > 1
                        ? ' of ' + tweets.length
                        : ''} ${pTweets}...`
                  : `Post ${tweets.length} ${pTweets}${reaction
                        ? ' (' + reaction + ')'
                        : ''}`
          )
        : h('br');
}
