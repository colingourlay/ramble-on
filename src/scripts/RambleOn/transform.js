var twitter = require('twitter-text');

module.exports = transform;

var NEW_LINES = /\n/g;
var ATS_OUTSIDE_LINKS = /@(<[a-zA-Z]+(>|.*?[^?]>))/g;
var LINK_OPENERS = /(<a)/g;

var DECORATORS = {
    none:     { before: '',    after:   '' },
    ellipsis: { before: '',    after:  '…' },
    ellipses: { before: '…',   after:  '…' },
    plus:     { before: '',    after: ' +' },
    pluses:   { before: '+ ',  after: ' +' },
    slash:    { before: '',    after: ' /' },
    slashes:  { before: '/ ',  after: ' /' },
    numDot:   { before: '#. ', after:   '' },
    numSlash: { before: '#/ ', after:   '' }
};

function transform(fullText, decorator) {
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
            var before = decorator.before.replace('#', tweets.length + 1);
            var after = decorator.after.replace('#', tweets.length + 1);
            var words = section.text.trim().split(' ');
            var tweetText = (!section.isPar || decorator.before.indexOf('#') > -1 ? before : '') + words.shift();
            var textBudget = 140 -
                (section.isPar ? twitter.getTweetLength(before) : 0) -
                twitter.getTweetLength(after);

            if (tweetText.length > textBudget) {
                words.unshift(tweetText.substr(textBudget));
                tweetText = tweetText.substr(0, textBudget);
            }

            while (words.length && twitter.getTweetLength(tweetText + ' ' + words[0]) <= textBudget) {
                tweetText += ' ' + words.shift();
            }

            if (words.length) {
                sections.unshift({
                    text: words.join(' '),
                    isPar: false
                });
            }

            if (sections.length && !sections[0].isPar) {
                tweetText += after;
            }

            tweets.push({
                text: tweetText,
                html: fixHTML(autoLink(twitter.htmlEscape(tweetText))),
                length: twitter.getTweetLength(tweetText)
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

function example(decoratorName) {
    var d = DECORATORS[decoratorName];
    var b = d.before;
    var a = d.after;

    return [
        '[' + (b.indexOf('#') < 0 ? '' : b.replace('#', 1)) + 'start' + a.replace('#', '1') + ']',
        '[' + b.replace('#', '2') + 'middle' + a.replace('#', '2') + ']',
        '[' + b.replace('#', '3') + 'end]',
    ].join(' ');
}

transform.example = example;

transform.DECORATORS = DECORATORS;
