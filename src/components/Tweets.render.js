import { hyper } from '../util';
import renderTweet from './Tweet.render';
import styles from './Tweets.css';

const h = hyper(styles);

export default function render(tweets) {
  return h('div.root', [tweets.length ? h('h2.heading', 'Preview') : null, h('div', tweets.map(renderTweet.bind()))]);
}
