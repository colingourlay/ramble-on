import { state, value } from 'mercury';
import window from 'global/window';

import { createPropsChannel, pluralise } from '../util';
import transform, { COUNTERS, DECORATORS } from '../util/transform';
import render from './App.render';

const TWITTER_API_KEYS = {
  'ramble-on.surge.sh': 'moFWkRoBcJ4Z212YGljaYxWUr',
  localhost: 'ESqb2TH1c4ZsRPZ3QdquCT7jt',
  '127.0.0.1': 'ESqb2TH1c4ZsRPZ3QdquCT7jt'
};
const OAUTH_PROXY = 'https://auth-server.herokuapp.com/proxy';

hello.init(
  {
    twitter: TWITTER_API_KEYS[window.location.hostname]
  },
  {
    oauth_proxy: OAUTH_PROXY
  }
);

function App(initialState) {
  initialState = initialState || {};
  initialState.text = initialState.text || '';
  initialState.counterName = initialState.counterName || Object.keys(COUNTERS)[0];
  initialState.decoratorName = initialState.decoratorName || Object.keys(DECORATORS)[0];
  initialState.timing = initialState.timing || 1000;

  const model = state({
    isPosting: value(false),
    text: value(initialState.text),
    counterName: value(initialState.counterName),
    decoratorName: value(initialState.decoratorName),
    timing: value(initialState.timing),
    tweets: value([]),
    numTweetsPosted: value(-1),
    channels: {
      setText: createPropsChannel('text'),
      setCounterName: createPropsChannel('counterName'),
      setDecoratorName: createPropsChannel('decoratorName'),
      setTiming: createPropsChannel('timing'),
      post: post
    }
  });

  window.addEventListener('beforeunload', e => {
    let val = model.isPosting() ? false : null;
    console.log('val', val);
    e.returnValue = val;
    return val;
  });

  const boundTweetUpdater = updateTweets.bind(null, model);

  model.text(boundTweetUpdater);
  model.counterName(boundTweetUpdater);
  model.decoratorName(boundTweetUpdater);
  model.timing(boundTweetUpdater);

  boundTweetUpdater();

  return model;
}

function updateTweets(model) {
  model.tweets.set(
    transform(model.text(), {
      counterName: model.counterName(),
      decoratorName: model.decoratorName()
    })
  );
}

function post(model) {
  const tweets = model.tweets();
  const timing = Math.max(model.timing(), 1000);
  const pTweets = pluralise('tweet', tweets.length);
  let initialTweetUrl;

  model.isPosting.set(true);

  hello('twitter')
    .login({ force: false })
    .then(next, done);

  function next(response) {
    const config = { data: {} };

    model.numTweetsPosted.set(model.numTweetsPosted() + 1);

    if (response && model.numTweetsPosted() === 1) {
      initialTweetUrl = `http://twitter.com/${response.user.screen_name}/status/${response.id_str}`;
    }

    if (model.numTweetsPosted() >= tweets.length) {
      return done(null, response);
    }

    config.data.message = encodeURIComponent(tweets[model.numTweetsPosted()].text);

    if (response && response.id_str) {
      config.apiPath = 'me/reply';
      config.data.id = response.id_str;
    } else {
      config.apiPath = 'me/share';
    }

    setTimeout(() => {
      hello('twitter')
        .api(config.apiPath, 'POST', config.data)
        .then(next, done);
    }, model.numTweetsPosted() > 0 ? timing : 0);
  }

  function done(err, response) {
    if (err) {
      console.log('Error:', err);

      if (model.numTweetsPosted() < 1) {
        alert('Failed to post any tweets.');
      } else {
        alert('Failed to post all tweets.');
      }
    }

    model.numTweetsPosted.set(-1);
    model.isPosting.set(false);

    if (!err) {
      model.text.set('');
      alert(`Posted ${tweets.length} ${pTweets}!`);
      window.open(initialTweetUrl);
    }
  }
}

export default App;
export { render };
