var debounce = require('debounce');
var document = require('global/document');
var domready = require('domready');
var hg = require('mercury');

var RambleOn = require('./RambleOn');

domready(function () {
    var state = RambleOn({
        text: localStorage.getItem('RambleOn_text'),
        counterName: localStorage.getItem('RambleOn_counterName'),
        decoratorName: localStorage.getItem('RambleOn_decoratorName')
    });

    state.text(debounce(function (text) {
        localStorage.setItem('RambleOn_text', text);
    }, 500));

    state.counterName(function (counterName) {
        localStorage.setItem('RambleOn_counterName', counterName);
    });

    state.decoratorName(function (decoratorName) {
        localStorage.setItem('RambleOn_decoratorName', decoratorName);
    });

    hg.app(document.body, state, RambleOn.render);
});
