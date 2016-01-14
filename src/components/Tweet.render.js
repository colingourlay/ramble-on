import styles from './Tweet.css';
import {hyper} from '../util';

const h = hyper(styles);

export default function render(tweet, index, tweets) {
    const count = (index + 1) + '/' + tweets.length;
    const countStyleName = (tweets.length > 99) ?
        'countTriple' : (tweets.length > 9) ?
        'countDouble' : 'count';
    const remaining = 140 - tweet.length;
    const remainingStyleName = (remaining < 10) ?
        'remainingSingle' : (remaining < 100) ?
        'remainingDouble' : 'remaining';

    return h('div.root', [
        h('div.text', {innerHTML: tweet.html}),
        h(`strong.${countStyleName}`, [count]),
        h(`strong.${remainingStyleName}`, [String(remaining)])
    ]);
}
