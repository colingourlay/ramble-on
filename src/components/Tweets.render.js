import styles from './Tweets.css';
import renderTweet from './Tweet.render';
import {h} from 'mercury';

export default function render(tweets) {
    return h('div', {className: styles.root}, [
        tweets.length ? h('h2', {className: styles.heading}, 'Preview') : null,
        h('div', tweets.map(renderTweet.bind()))
    ]);
}
