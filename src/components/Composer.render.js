import styles from './Composer.css';
import {h, partial, send, sendChange, sendValue} from 'mercury';
import {COUNTERS, DECORATORS, example} from '../util/transform';

export default function render(state) {
    return h('div', {className: styles.root}, [
        partial(renderText,
            state.isPosting,
            state.text,
            state.channels.setText),
        h('label', {className: styles.counterLabel}, 'Counter'),
        partial(renderCounter,
            state.isPosting,
            state.counterName,
            state.channels.setCounterName),
        h('label', {className: styles.decoratorLabel}, 'Style'),
        partial(renderDecorator,
            state.isPosting,
            state.decoratorName,
            state.counterName,
            state.channels.setDecoratorName),
        partial(renderPost,
            state.isPosting,
            state.text,
            state.channels.post)
    ]);
}

function renderText(isPosting, text, channel) {
    return h('textarea', {
        className: styles.text,
        name: 'text',
        rows: 4,
        value: text,
        disabled: isPosting,
        readOnly: isPosting,
        'ev-input': sendValue(channel)
    });
}

function renderCounter(isPosting, counterName, channel) {
    return h('select', {
        className: styles.counter,
        name: 'counterName',
        value: counterName,
        disabled: isPosting,
        'ev-change': sendChange(channel)
    }, Object.keys(COUNTERS).map(function (key) {
        var counter = COUNTERS[key];

        return h('option', {
            value: key,
            selected: key === counterName
        },  counter ? counter.replace('#', '1') : '-')
    }));
}

function renderDecorator(isPosting, decoratorName, counterName, channel) {
    return h('select', {
        className: styles.decorator,
        name: 'decoratorName',
        value: decoratorName,
        disabled: isPosting,
        'ev-change': sendChange(channel)
    }, Object.keys(DECORATORS).map(function (key) {
        return h('option', {
            value: key,
            selected: key === decoratorName
        }, example(counterName, key))
    }));
}

function renderPost(isPosting, text, channel) {
    return (text.length ?
        h('button', {
            className: styles.post,
            disabled: isPosting,
            'ev-click': send(channel)
        }, 'Post') :
        h('br')
    );
}
