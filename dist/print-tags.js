"use strict";
var coloring_lib_1 = require("@santi100/coloring-lib");
module.exports = function printTags(tags, monochrome) {
    var _a, _b, _c, _d, _e, _f, _g;
    console.log(monochrome ? 'Song Name:' : (0, coloring_lib_1.colorize)('Song Name:', 'bold'), (_a = tags.title) !== null && _a !== void 0 ? _a : '<unknown>');
    console.log(monochrome ? 'Album:' : (0, coloring_lib_1.colorize)('Album:', 'bold'), (_b = tags.album) !== null && _b !== void 0 ? _b : '<unknown>');
    console.log(monochrome ? 'Artist:' : (0, coloring_lib_1.colorize)('Artist:', 'bold'), (_c = tags.artist) !== null && _c !== void 0 ? _c : '<unknown>');
    console.log(monochrome ? 'Genre:' : (0, coloring_lib_1.colorize)('Genre:', 'bold'), (_d = tags.genre) !== null && _d !== void 0 ? _d : '<unknown>');
    console.log(monochrome ? 'Composer(s):' : (0, coloring_lib_1.colorize)('Composer(s):', 'bold'), (_e = tags.composer) !== null && _e !== void 0 ? _e : '<unknown>');
    console.log(monochrome ? 'Year:' : (0, coloring_lib_1.colorize)('Year:', 'bold'), (_f = tags.year) !== null && _f !== void 0 ? _f : '<unknown>');
    console.log(monochrome ? 'Language:' : (0, coloring_lib_1.colorize)('Language:', 'bold'), (_g = tags.language) !== null && _g !== void 0 ? _g : '<unknown>');
    console.log(monochrome ? 'Has Album Cover:' : (0, coloring_lib_1.colorize)('Has Album Cover:', 'bold'), tags.image ? 'yes' : 'no');
    console.log(monochrome ? 'Has Lyrics:' : (0, coloring_lib_1.colorize)('Has Lyrics:', 'bold'), tags.unsynchronisedLyrics ? 'yes' : 'no');
};
