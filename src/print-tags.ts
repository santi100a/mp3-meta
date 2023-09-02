import NodeID3 = require('node-id3');
import { colorize } from '@santi100/coloring-lib';
export = function printTags(tags: NodeID3.Tags, monochrome: boolean) {
	console.log(
		monochrome ? 'Song Name:' : colorize('Song Name:', 'bold'),
		tags.title ?? '<unknown>'
	);
	console.log(
		monochrome ? 'Album:' : colorize('Album:', 'bold'),
		tags.album ?? '<unknown>'
	);
	console.log(
		monochrome ? 'Artist:' : colorize('Artist:', 'bold'),
		tags.artist ?? '<unknown>'
	);
	console.log(
		monochrome ? 'Genre:' : colorize('Genre:', 'bold'),
		tags.genre ?? '<unknown>'
	);
	console.log(
		monochrome ? 'Composer(s):' : colorize('Composer(s):', 'bold'),
		tags.composer ?? '<unknown>'
	);
	console.log(
		monochrome ? 'Year:' : colorize('Year:', 'bold'),
		tags.year ?? '<unknown>'
	);
	console.log(
		monochrome ? 'Language:' : colorize('Language:', 'bold'),
		tags.language ?? '<unknown>'
	);
	console.log(
		monochrome ? 'Has Album Cover:' : colorize('Has Album Cover:', 'bold'),
		tags.image ? 'yes' : 'no'
	);
	console.log(
		monochrome ? 'Has Lyrics:' : colorize('Has Lyrics:', 'bold'),
		tags.unsynchronisedLyrics ? 'yes' : 'no'
	);
};
