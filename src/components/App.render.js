import styles from './App.css';
import {h, partial} from 'mercury';
import renderComposer from './Composer.render';
import renderTweets from './Tweets.render';

export default function render(state) {
    return h('div', {className: styles.root}, [
        renderComposer(state),
        partial(renderTweets, state.tweets)
    ]);
}
