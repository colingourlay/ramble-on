import styles from './Tweets.css';
import renderTweet from './Tweet.render';
import {hyper} from '../util';

const h = hyper(styles);

export default function render(tweets) {
    return h('div.root', [
        tweets.length ? h('h2.heading', 'Preview') : null,
        h('div', tweets.map(renderTweet.bind()))
    ]);
}
