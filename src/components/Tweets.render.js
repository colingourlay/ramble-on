import styles from './Tweets.css';
import renderTweet from './Tweet.render';
import {h} from 'mercury';

export default function renderTweets(tweets) {
    return h('div', {className: styles.root}, tweets.map(renderTweet.bind()));
}
