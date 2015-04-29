var document = require('global/document');
var domready = require('domready');
var hg = require('mercury');

var OneForty = require('./OneForty');

domready(function () {
    var state = OneForty();

    hg.app(document.body, state, OneForty.render);

    // state.text.set(TEST_TEXT);
});

var TEST_TEXT = (function(){/*So we come to it. The vote.

Well, you come to it. I'm excluded from casting a ballot in the independence referendum (for reasons I'm happy to accept). This is the sad thing though: after all of the campaigning and all of the research I've done, I still don't have a fucking clue which side I'd land on. And that's our collective fault.

The Better Together campaign has been one of scaremongering, highlighting uncertainty and faced by the 'haves' who seem utterly disconnected with the average Scot.

The Yes campaign has presented itself as one of hope, but in reality, its just another scare campaign, that appeals not to the minds of the Scottish people (to which I give greater credit than most), but their hearts. And that's a dangerous thing. They've co-opted patriotism, which has a ridiculously powerful sway on those have not the time nor the inclination to put serious thought to the matter at hand, turning the decision into an apparent 'no brainer'.

We find ourselves in an emotional battle, rather than a rational one. A battle where the loudest voices win out, not the voices of the people that actually count, or have genuine concerns about Scotland's future.

My Facebook timeline has been overwhelmed by Yes content, but I have to remember that we live in bubbles, surrounded by friends and family of like-mind, so there will be people just like me who's timelines have but a whisper of Yes, and overwhelming support for the no vote.

You may then think, OK, let's go down the pub (you're probably there right now, celebrating Referendum Eve); meet people outside of the bubble; see what they think.

You might think you'll get a nice cross section of the people, but remember what I said about Yes co-opting patriotism. The side affect of that is that No voters are less inclined to voice their opinions in these spaces, for fear of being labeled "not a real Scot", being bullied, or suffering worse.

The thing is, voters on both sides care about Scotland. They care deeply. I know I do. The saddest thing in all of this is that that emotional arguments have become so prevalent, that many have given up the quest for real concrete information about how this decision will affect Scotland. We have not been holding our politicians to account. We've let them spew their sound bites without forcing them to back up their claims.

Of course, I'm not claiming that you're not educated on the matter. I'm saying that there should have been much more information available before now, mere hours before the vote. We've known this has been happening for over two years, and where are we? No wonder hearts are being still being swayed back and forth, and campaigns like Better Together are pathetically counting on celebrities to win votes.

I've seen the defacement of Better Together posters by (I'm assuming) Yes campaigners. I've watched David Cameron order the Scottish flag to be flown over 10 Downing Street as an awkward love note because he doesn't have the words to convince Scotland to stay a part of the UK. It's just saddening and frustrating.

This is a big decision. Its less than a day away. And we're not ready to make it. At this point, whatever happens, I hope that we're not too stubborn or angry to get behind Scotland and its people and make it prosper.

All I'll say is, put oil out of the equation. Whether we have little left or an untapped fuck-ton off the west coast, it doesn't matter. It's finite. Scotland's future is, has been and always will be secured by the ingenuity and entrepreneurial abilities of the Scottish people. Sustainable, long term wealth isn't discovered or inherited, it's made.

You can do it, with or without the UK. So when this vote is over, get over it, get together, fuck the politicians both sides of the border, and make Scotland the country you want it to be.
*/}).toString().slice(14,-3);
