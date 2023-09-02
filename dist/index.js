"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var node_id3_1 = require("node-id3");
var commander_1 = require("commander");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
// @ts-expect-error TS7016
var file_type_cjs_1 = require("file-type-cjs");
var colorize_1 = require("@santi100/coloring-lib/cjs/colorize");
var printTagsFunction = require("./print-tags");
var program = new commander_1.Command('mp3meta')
    .description('Add tags to an MP3 file.')
    .option('-r, --read-tags <tagfile>', 'read tags from JSON file <tagfile>')
    .option('-d, --dump-tags <file>', 'dump JSON tags into <file>')
    .option('-c, --dump-cover <image>', 'dump album cover into <image>')
    .option('-p, --print-tags', 'print tags to screen')
    .requiredOption('-i, --input <input-file>', 'input filename')
    .option('-o, --output <outfile>', 'output filename')
    .option('-m, --monochrome', 'do not use ANSI colors')
    .option('-l, --lyrics-file <textfile>', 'file where lyrics are located')
    .option('-L, --language <lang>', "song's language")
    .option('-D, --debug', 'show error stacktraces')
    .option('-s, --song-name <name>', 'song name')
    .option('--album <album>', 'album name')
    .option('--album-cover <image>', 'album cover image file')
    .option('--artist <artist>', "song's artist")
    .option('--genre <genre>', "song's genre")
    .option('--composers <composers...>', "song's composer(s)")
    .option('--year <year>', "song's release year", function validate(val) {
    var n = Number(val);
    if (isNaN(n))
        fail(new TypeError('Year must be a valid number'));
    if (n.toString().includes('.'))
        fail(new TypeError('Year must be an integer'));
    if (n.toString().startsWith('-'))
        fail(new TypeError('Year must not be negative'));
    if (n === 0)
        fail(new TypeError('Year cannot be zero'));
    return n;
})
    .parse(process.argv);
var _a = program.opts(), readTags = _a.readTags, dumpTags = _a.dumpTags, dumpCover = _a.dumpCover, lyricsFile = _a.lyricsFile, language = _a.language, printTags = _a.printTags, songName = _a.songName, input = _a.input, output = _a.output, monochrome = _a.monochrome, debug = _a.debug, artist = _a.artist, album = _a.album, albumCover = _a.albumCover, genre = _a.genre, composers = _a.composers, year = _a.year;
(function main() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return __awaiter(this, void 0, void 0, function () {
        var buf, tags, object, json, tagFile, tags_1, newFile, imageBuffer, originalMeta, originalImage, lyricsText, _r, cover, _s, meta, _t, _u, newFile;
        var _v, _w;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.normalize)(input))];
                case 1:
                    buf = _x.sent();
                    tags = (0, node_id3_1.read)(buf);
                    if (!printTags) return [3 /*break*/, 2];
                    printTagsFunction(tags, monochrome);
                    return [3 /*break*/, 21];
                case 2:
                    if (!dumpTags) return [3 /*break*/, 4];
                    object = __assign({}, tags);
                    json = JSON.stringify(object);
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.normalize)(dumpTags), Buffer.from(json)).then(function () {
                            return console.log((0, colorize_1["default"])('\u2713 Operation succeeded.', 'green'));
                        })];
                case 3:
                    _x.sent();
                    return [3 /*break*/, 21];
                case 4:
                    if (!readTags) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, promises_1.readFile)(readTags, 'utf8')];
                case 5:
                    tagFile = _x.sent();
                    tags_1 = JSON.parse(tagFile);
                    newFile = (0, node_id3_1.write)(tags_1, buf);
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.normalize)(output), newFile).then(function () {
                            return console.log((0, colorize_1["default"])('\u2713 Operation succeeded.', 'green'));
                        })];
                case 6:
                    _x.sent();
                    return [3 /*break*/, 21];
                case 7:
                    if (!dumpCover) return [3 /*break*/, 9];
                    imageBuffer = typeof tags.image === 'object'
                        ? tags.image.imageBuffer
                        : Buffer.from("".concat((_a = tags.image) === null || _a === void 0 ? void 0 : _a.toString()));
                    console.log('Album Cover Description:', (_c = (_b = tags.image) === null || _b === void 0 ? void 0 : _b.description) !== null && _c !== void 0 ? _c : '<no description>');
                    console.log('Album Cover Data Type:', (_e = (_d = tags.image) === null || _d === void 0 ? void 0 : _d.mime) !== null && _e !== void 0 ? _e : '<unknown>');
                    console.log('Album Cover Type ID:', (_g = (_f = tags.image) === null || _f === void 0 ? void 0 : _f.type.id) !== null && _g !== void 0 ? _g : '<unknown>');
                    console.log('Album Cover Type Name:', (_j = (_h = tags.image) === null || _h === void 0 ? void 0 : _h.type.name) !== null && _j !== void 0 ? _j : '<unknown>');
                    return [4 /*yield*/, (0, promises_1.writeFile)(dumpCover, imageBuffer).then(function () {
                            return console.log((0, colorize_1["default"])('\u2713 Operation succeeded.', 'green'));
                        })];
                case 8:
                    _x.sent();
                    return [3 /*break*/, 21];
                case 9:
                    if (output === undefined)
                        fail(new Error("required option '-o, --output <outfile>' not specified"));
                    originalMeta = (0, node_id3_1.read)(buf);
                    originalImage = originalMeta.image
                        ? Buffer.from(originalMeta.image.imageBuffer)
                        : undefined;
                    if (!lyricsFile) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.normalize)(lyricsFile), 'utf8')];
                case 10:
                    _r = _x.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _r = '';
                    _x.label = 12;
                case 12:
                    lyricsText = _r;
                    if (!albumCover) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, promises_1.readFile)(albumCover)];
                case 13:
                    _s = _x.sent();
                    return [3 /*break*/, 15];
                case 14:
                    _s = Buffer.from('');
                    _x.label = 15;
                case 15:
                    cover = _s;
                    _t = [__assign({}, originalMeta)];
                    _v = { artist: artist !== null && artist !== void 0 ? artist : originalMeta.artist, album: album !== null && album !== void 0 ? album : originalMeta.album };
                    if (!albumCover) return [3 /*break*/, 18];
                    _w = {};
                    return [4 /*yield*/, (0, promises_1.readFile)(albumCover)];
                case 16:
                    _w.imageBuffer = _x.sent();
                    return [4 /*yield*/, (0, file_type_cjs_1.fromBuffer)(cover)];
                case 17:
                    _u = (_w.mime = (_l = (_k = (_x.sent())) === null || _k === void 0 ? void 0 : _k.mime) !== null && _l !== void 0 ? _l : 'application/octet-stream',
                        _w.description = '',
                        _w.type = {
                            id: 0
                        },
                        _w);
                    return [3 /*break*/, 19];
                case 18:
                    _u = originalImage === null || originalImage === void 0 ? void 0 : originalImage.toString();
                    _x.label = 19;
                case 19:
                    meta = __assign.apply(void 0, _t.concat([(_v.image = _u, _v.genre = genre !== null && genre !== void 0 ? genre : originalMeta.genre, _v.composer = (_m = composers === null || composers === void 0 ? void 0 : composers.join(', ')) !== null && _m !== void 0 ? _m : originalMeta.composer, _v.year = year !== null && year !== void 0 ? year : originalMeta.year, _v.unsynchronisedLyrics = (_o = originalMeta.unsynchronisedLyrics) !== null && _o !== void 0 ? _o : {
                            language: language,
                            text: lyricsText
                        }, _v.language = (_p = originalMeta.language) !== null && _p !== void 0 ? _p : language, _v.title = (_q = originalMeta.title) !== null && _q !== void 0 ? _q : songName, _v)]));
                    newFile = (0, node_id3_1.write)(meta, buf);
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.normalize)(output), newFile).then(function () {
                            return console.log((0, colorize_1["default"])('\u2713 Operation succeeded.', 'green'));
                        })];
                case 20:
                    _x.sent();
                    _x.label = 21;
                case 21: return [2 /*return*/];
            }
        });
    });
})()["catch"](fail);
function fail(err, statusCode) {
    if (statusCode === void 0) { statusCode = 1; }
    var str = '';
    if (!debug)
        str = typeof err === 'object' ? err.message : err;
    else
        str = typeof err === 'object' ? String(err.stack) : err;
    var lines = str.split('\n');
    var prefix = monochrome ? 'ERR! ' : (0, colorize_1["default"])('ERR! \u2718 ', 'red');
    var errorLines = lines.map(function (line) {
        return prefix.concat(monochrome ? line : (0, colorize_1["default"])(line, 'red'));
    });
    console.error(errorLines.join('\n'));
    process.exit(statusCode);
}
