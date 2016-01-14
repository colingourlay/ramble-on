import styles from './App.css';
import {partial} from 'mercury';
import renderComposer from './Composer.render';
import renderHeader from './Header.render';
import renderTweets from './Tweets.render';
import {hyper} from '../util';

const h = hyper(styles);

export default function render(state) {
    return h('div.root', [
        renderHeader(),
        renderComposer(state),
        partial(renderTweets, state.tweets)
    ]);
}
