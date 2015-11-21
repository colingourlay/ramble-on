import styles from './App.css';
import {h, partial} from 'mercury';
import renderComposer from './Composer.render';
import renderHeader from './Header.render';
import renderTweets from './Tweets.render';

export default function render(state) {
    return h('div', {className: styles.root}, [
        renderHeader(),
        renderComposer(state),
        partial(renderTweets, state.tweets)
    ]);
}
