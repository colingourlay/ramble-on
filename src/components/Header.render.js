import { hyper } from '../util';
import styles from './Header.css';

const h = hyper(styles);

export default function render() {
  return h('div.root', [
    h('h1.heading', 'Ramble On'),
    h('div.about', ['A tweet linking thing by ', h('a', { href: 'http://twitter.com/collypops' }, '@collypops')])
  ]);
}
