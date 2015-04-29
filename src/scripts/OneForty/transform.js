var twitter = require('twitter-text');

module.exports = transform;

var NEW_LINES = /\n/g;
var ATS_OUTSIDE_LINKS = /@(<[a-zA-Z]+(>|.*?[^?]>))/g;
var LINK_OPENERS = /(<a)/g;

function transform(fullText, connector) {
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
            var tweetText = (section.isPar ? '' : connector.prefix) + words.shift();
            var textBudget = 140 -
                (section.isPar ? twitter.getTweetLength(connector.prefix) : 0) -
                twitter.getTweetLength(connector.suffix);

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
                tweetText += connector.suffix;
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
