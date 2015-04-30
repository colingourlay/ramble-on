var twitter = require('twitter-text');
var tweetLength = twitter.getTweetLength;

var NEW_LINES = /\n/g;
var ATS_OUTSIDE_LINKS = /@(<[a-zA-Z]+(>|.*?[^?]>))/g;
var LINK_OPENERS = /(<a)/g;

var DECORATORS = {
    none:     { before: '',    after:   '' },
    ellipsis: { before: '',    after:  '…' },
    ellipses: { before: '…',   after:  '…' },
    plus:     { before: '',    after: ' +' },
    pluses:   { before: '+ ',  after: ' +' }
};

var COUNTERS = {
    none:   '',
    dot:    '#. ',
    slash:  '#/ ',
};

function transform(fullText, config) {
    var config = typeof config === 'object' ? config : {};
    var counter = config.counter || COUNTERS[config.counterName] || COUNTERS[Object.keys(COUNTERS)[0]];
    var decorator = config.decorator || DECORATORS[config.decoratorName] || DECORATORS[Object.keys(DECORATORS)[0]];
    var tweets = [];

    if (!fullText.length) { return tweets; }

    var sections = fullText
        .split(/[\r\n]+[\r\n]+/g)
        .map(function (text) {
            return {
                text: text.trim(),
                isPar: true
            };
        })
        .filter(function (section) {
            return section.text.length;
        });

    while (sections.length) {
        (function (section) {
            var words = section.text.trim().split(' ');
            var tweetText = [
                counter.replace('#', tweets.length + 1),
                (!section.isPar ? decorator.before : ''),
                words.shift()
            ].join('');
            var textBudget = 140 -
                (section.isPar ? tweetLength(decorator.before) : 0) -
                tweetLength(decorator.after);

            if (tweetText.length > textBudget) {
                words.unshift(tweetText.substr(textBudget));
                tweetText = tweetText.substr(0, textBudget);
            }

            while (words.length && tweetLength(tweetText + ' ' + words[0]) <= textBudget) {
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
                html: fixHTML(autoLink(twitter.htmlEscape(tweetText))),
                length: tweetLength(tweetText)
            });

        })(sections.shift());
    }

    return tweets;
}

function autoLink(text) {
    var entities = twitter.extractEntitiesWithIndices(text);

    return twitter.autoLinkEntities(text, entities);
}

function fixHTML(html) {
    return html
        .replace(NEW_LINES, '<br>')
        .replace(ATS_OUTSIDE_LINKS, '$1@')
        .replace(LINK_OPENERS, '$1 target="blank"');
}

function example(counterName, decoratorName) {
    var c = COUNTERS[counterName];
    var d = DECORATORS[decoratorName];
    var b = d.before;
    var a = d.after;

    return [
        '[' + c.replace('#', '1') + 'start' + a + ']',
        '[' + c.replace('#', '2') + b + 'middle' + a + ']',
        '[' + c.replace('#', '3') + b + 'end]'
    ].join('');
}

transform.example = example;
transform.DECORATORS = DECORATORS;
transform.COUNTERS = COUNTERS;

module.exports = transform;
