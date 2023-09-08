import { write, read, type Tags } from 'node-id3';
import { Command } from 'commander';
import { readFile, writeFile } from 'node:fs/promises';
import { normalize } from 'node:path';
// @ts-expect-error TS7016
import { fromBuffer } from 'file-type-cjs';
import colorize from '@santi100/coloring-lib/cjs/colorize';
import printTagsFunction = require('./print-tags');

type ImageObject = {
	mime: string;
	type: { id: number; name?: string };
	description: string;
	imageBuffer: Buffer;
};

const program = new Command('mp3meta')
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
	.option(
		'--year <year>',
		"song's release year",
		function validate(val: string) {
			const n = Number(val);
			if (isNaN(n)) fail(new TypeError('Year must be a valid number'));
			if (n.toString().includes('.'))
				fail(new TypeError('Year must be an integer'));
			if (n.toString().startsWith('-'))
				fail(new TypeError('Year must not be negative'));
			if (n === 0) fail(new TypeError('Year cannot be zero'));
			return n;
		}
	)
	.parse(process.argv);

const {
	readTags,
	dumpTags,
	dumpCover,
	lyricsFile,
	language,
	printTags,
	songName,
	input,
	output,
	monochrome,
	debug,
	artist,
	album,
	albumCover,
	genre,
	composers,
	year
} = program.opts();

(async function main() {
	const buf = await readFile(normalize(input));
	const tags = read(buf);
	if (printTags) {
		printTagsFunction(tags, monochrome);
	} else if (dumpTags) {
		const object = { ...tags };
		const json = JSON.stringify(object);
		await writeFile(normalize(dumpTags), Buffer.from(json)).then(() =>
			console.log(colorize('\u2713 Operation succeeded.', 'green'))
		);
	} else if (readTags) {
		const tagFile = await readFile(readTags, 'utf8');
		const tags = JSON.parse(tagFile);
		const newFile = write(tags, buf);
		await writeFile(normalize(output), newFile).then(() =>
			console.log(colorize('\u2713 Operation succeeded.', 'green'))
		);
	} else if (dumpCover) {
		const imageBuffer =
			typeof tags.image === 'object'
				? tags.image.imageBuffer
				: Buffer.from(`${tags.image?.toString()}`);
		console.log(
			'Album Cover Description:',
			(tags.image as ImageObject)?.description ?? '<no description>'
		);
		console.log(
			'Album Cover Data Type:',
			(tags.image as ImageObject)?.mime ?? '<unknown>'
		);
		console.log(
			'Album Cover Type ID:',
			(tags.image as ImageObject)?.type.id ?? '<unknown>'
		);
		console.log(
			'Album Cover Type Name:',
			(tags.image as ImageObject)?.type.name ?? '<unknown>'
		);
		await writeFile(dumpCover, imageBuffer).then(() =>
			console.log(colorize('\u2713 Operation succeeded.', 'green'))
		);
	} else {
		if (output === undefined)
			fail(new Error("required option '-o, --output <outfile>' not specified"));
		const originalMeta = read(buf);
		const originalImage = originalMeta.image
			? Buffer.from((originalMeta.image as ImageObject).imageBuffer)
			: undefined;
		const lyricsText = lyricsFile
			? await readFile(normalize(lyricsFile), 'utf8')
			: '';
		const cover = albumCover ? await readFile(albumCover) : Buffer.from('');
		const meta: Tags = {
			...originalMeta,
			artist: artist ?? originalMeta.artist,
			album: album ?? originalMeta.album,
			image: albumCover
				? {
						imageBuffer: await readFile(albumCover),
						mime: (await fromBuffer(cover))?.mime ?? 'application/octet-stream',
						description: '',
						type: {
							id: 0
						}
				  }
				: originalImage?.toString(),
			genre: genre ?? originalMeta.genre,
			composer: composers?.join(', ') ?? originalMeta.composer,
			year: year ?? originalMeta.year,
			unsynchronisedLyrics: originalMeta.unsynchronisedLyrics ?? {
				language,
				text: lyricsText
			},
			language: originalMeta.language ?? language,
			title: originalMeta.title ?? songName
		};
		const newFile = write(meta, buf);
		await writeFile(normalize(output), newFile).then(() =>
			console.log(colorize('\u2713 Operation succeeded.', 'green'))
		);
	}
})().catch(fail);

function fail(err: Error | string, statusCode = 1): never {
	let str = '';
	if (!debug) str = typeof err === 'object' ? err.message : err;
	else str = typeof err === 'object' ? String(err.stack) : err;
	const lines = str.split('\n');
	const prefix = monochrome ? 'ERR! ' : colorize('ERR! \u2718 ', 'red');
	const errorLines = lines.map(line =>
		prefix.concat(monochrome ? line : colorize(line, 'red'))
	);
	console.error(errorLines.join('\n'));
	process.exit(statusCode);
}
