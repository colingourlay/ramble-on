import styles from './Header.css';
import {h} from 'mercury';

export default function render() {
    return h('div', {className: styles.root}, [
        h('h1', {className: styles.heading}, 'Ramble On'),
        h('div', {className: styles.about}, [
            'A tweet linking thing by ',
            h('a', {className: styles.link, href: 'http://twitter.com/collypops'}, '@collypops')
        ])
    ]);
}
