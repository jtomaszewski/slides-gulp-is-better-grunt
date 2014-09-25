// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke'),
  cube = require('bespoke-theme-cube'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  bullets = require('bespoke-bullets'),
  scale = require('bespoke-scale'),
  hash = require('bespoke-hash'),
  progress = require('bespoke-progress'),
  state = require('bespoke-state');


var jtChain = function(deck){
  deck.on("next", function(event){
    var jtChainCount = + (event.slide.dataset.jtChain || 0);
    var jtSlideChainIndex = + (event.slide.dataset.jtChainIndex || 0);

    if (jtChainCount > 0) {
      if (jtChainCount > jtSlideChainIndex) {
        event.slide.dataset.jtChainIndex = jtSlideChainIndex + 1;
        event.slide.classList.add("jt-chain-" + (jtSlideChainIndex + 1));
        return false;
      }
    }
  });

  deck.on("prev", function(event){
    var jtChainCount = + (event.slide.dataset.jtChain || 0);
    var jtSlideChainIndex = + (event.slide.dataset.jtChainIndex);

    if (jtChainCount > 0) {
      if (jtSlideChainIndex > 0) {
        event.slide.dataset.jtChainIndex = jtSlideChainIndex - 1;
        event.slide.classList.remove("jt-chain-" + jtSlideChainIndex);
        return false;
      }
    }
  });
};


// Bespoke.js
bespoke.from('article', [
  cube(),
  keys(),
  touch(),
  jtChain,
  bullets('.bullet, .bullets > *'),
  scale(),
  hash(),
  progress(),
  state(),
]);

// Prism syntax highlighting
// This is actually loaded from "bower_components" thanks to
// debowerify: https://github.com/eugeneware/debowerify
require('prism');
