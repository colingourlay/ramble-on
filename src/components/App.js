import {state, value} from 'mercury';
import window from 'global/window';

import {createPropsChannel} from '../util';
import transform from '../util/transform';

const TWITTER_API_KEYS = {
    'ramble-on.surge.sh': 'moFWkRoBcJ4Z212YGljaYxWUr',
    'localhost': 'ESqb2TH1c4ZsRPZ3QdquCT7jt',
    '127.0.0.1': 'ESqb2TH1c4ZsRPZ3QdquCT7jt'
};
const OAUTH_PROXY = 'https://auth-server.herokuapp.com/proxy';
const ONE_MINUTE = 60 * 1000;
const RATE_LIMIT_WINDOW = 15 * ONE_MINUTE;
const MAX_REQUESTS_PER_RATE_LIMIT_WINDOW = 15;

hello.init({
    twitter: TWITTER_API_KEYS[window.location.hostname]
}, {
    oauth_proxy: OAUTH_PROXY
});

// hello.on('auth', () => {
//     console.log('hello.auth', arguments);
// });

function App(initialState) {
    initialState = initialState || {};
    initialState.text = initialState.text || '';
    initialState.counterName = initialState.counterName || Object.keys(transform.COUNTERS)[0];
    initialState.decoratorName = initialState.decoratorName || Object.keys(transform.DECORATORS)[0];

    const model = state({
        isPosting: value(false),
        text: value(initialState.text),
        counterName: value(initialState.counterName),
        decoratorName: value(initialState.decoratorName),
        tweets: value([]),
        channels: {
            setText: createPropsChannel('text'),
            setCounterName: createPropsChannel('counterName'),
            setDecoratorName: createPropsChannel('decoratorName'),
            post: post
        }
    });

    const boundTweetUpdater = updateTweets.bind(null, model);

    model.text(boundTweetUpdater);
    model.counterName(boundTweetUpdater);
    model.decoratorName(boundTweetUpdater);

    boundTweetUpdater();

    return model;
}

function updateTweets(model) {
    model.tweets.set(transform(model.text(), {
        counterName: model.counterName(),
        decoratorName: model.decoratorName()
    }));
}

function post(model) {
    const tweets = model.tweets();
    const initialLength = tweets.length;

    model.isPosting.set(true);

    hello('twitter')
    .login({force: false})
    .then(next, done);

    function next(response, isRetry) {
        const config = {
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

        model.text.set('');
        model.isPosting.set(false);
    }
}

App.render = require('./App.render');

export default App;
