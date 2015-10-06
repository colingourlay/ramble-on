import {
    autoLinkEntities,
    extractEntitiesWithIndices,
    getTweetLength,
    htmlEscape
} from 'twitter-text';

const NEW_LINES = /\n/g;
const ATS_OUTSIDE_LINKS = /@(<[a-zA-Z]+(>|.*?[^?]>))/g;
const LINK_OPENERS = /(<a)/g;

const DECORATORS = {
    none:     { before: '',    after:   '' },
    ellipsis: { before: '',    after:  '…' },
    ellipses: { before: '…',   after:  '…' },
    plus:     { before: '',    after: ' +' },
    pluses:   { before: '+ ',  after: ' +' }
};

const COUNTERS = {
    none:   '',
    dot:    '#. ',
    slash:  '#/ '
};

function transform(fullText, config) {
    config = typeof config === 'object' ? config : {};

    const counter = config.counter || COUNTERS[config.counterName] || COUNTERS[Object.keys(COUNTERS)[0]];
    const decorator = config.decorator || DECORATORS[config.decoratorName] || DECORATORS[Object.keys(DECORATORS)[0]];
    const tweets = [];

    if (!fullText.length) {
        return tweets;
    }

    const sections = fullText
        .split(/[\r\n]+[\r\n]+/g)
        .map((text) => { return {text: text.trim(), isPar: true}; })
        .filter((section) => section.text.length);

    while (sections.length) {
        ((section) => {
            const words = section.text.trim().split(' ');
            let tweetText = [
                counter.replace('#', tweets.length + 1),
                (!section.isPar ? decorator.before : ''),
                words.shift()
            ].join('');
            const textBudget = 140 -
                (section.isPar ? getTweetLength(decorator.before) : 0) -
                getTweetLength(decorator.after);

            if (tweetText.length > textBudget) {
                words.unshift(tweetText.substr(textBudget));
                tweetText = tweetText.substr(0, textBudget);
            }

            while (words.length && getTweetLength(tweetText + ' ' + words[0]) <= textBudget) {
                tweetText += ' ' + words.shift();
            }

            if (words.length) {
                sections.unshift({
                    text: words.join(' '),
                    isPar: false
                });
            }

            if (sections.length && !sections[0].isPar) {
                tweetText += decorator.after;
            }

            tweets.push({
                text: tweetText,
                html: fixHTML(autoLink(htmlEscape(tweetText))),
                length: getTweetLength(tweetText)
            });

        })(sections.shift());
    }

    return tweets;
}

function autoLink(text) {
    return autoLinkEntities(text, extractEntitiesWithIndices(text));
}

function fixHTML(html) {
    return html
        .replace(NEW_LINES, '<br>')
        .replace(ATS_OUTSIDE_LINKS, '$1@')
        .replace(LINK_OPENERS, '$1 target="blank"');
}

function example(counterName, decoratorName) {
    const c = COUNTERS[counterName];
    const d = DECORATORS[decoratorName];
    const b = d.before;
    const a = d.after;

    return [
        '[' + c.replace('#', '1') + 'start' + a + ']',
        '[' + c.replace('#', '2') + b + 'middle' + a + ']',
        '[' + c.replace('#', '3') + b + 'end]'
    ].join('');
}

transform.example = example;
transform.DECORATORS = DECORATORS;
transform.COUNTERS = COUNTERS;

export default transform;
