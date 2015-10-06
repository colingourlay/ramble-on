import styles from './Tweet.css';
import {h} from 'mercury';

export default function renderTweet(tweet, index, tweets) {
    const count = (index + 1) + '/' + tweets.length;
    const countStyleName = (tweets.length > 99) ?
        'countTriple' : (tweets.length > 9) ?
        'countDouble' : 'count';
    const remaining = 140 - tweet.length;
    const remainingStyleName = (remaining < 10) ?
        'remainingSingle' : (remaining < 100) ?
        'remainingDouble' : 'remaining';

    return h('div', {className: styles.root}, [
        h('div', {className: styles.text, innerHTML: tweet.html}),
        h('strong', {className: styles[countStyleName]}, [count]),
        h('strong', {className: styles[remainingStyleName]}, [String(remaining)])
    ]);
}
