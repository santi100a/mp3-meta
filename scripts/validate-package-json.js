console.clear();

console.log('🚚 Importing package.json...');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const json = require('../package.json');

switch (typeof json.author) {
	case 'string':
		if (!json.author.trim()) throw new Error('❌ "author" invalid or missing.');
		break;
	case 'object':
		if (json.author === null)
			throw new Error('❌ "author" invalid or missing.');
		if (typeof json.author.name !== 'string' || !json.author.name.trim())
			throw new Error('❌ "author.name" invalid or missing.');
		if (
			typeof json.author.email !== 'undefined' &&
			(typeof json.author.email !== 'string' ||
				!json.author.email.trim() ||
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(json.author.email))
		)
			throw new Error('❌ "author.email" invalid or missing.');
		if (typeof json.author.url !== 'undefined')
			try {
				new URL(json.author.url);
			} catch (e) {
				throw new Error('❌ "author.url" invalid or missing.');
			}
		break;
	default:
		throw new Error('❌ "author" invalid or missing.');
}

if (typeof json.description !== 'string' || !json.description.trim())
	throw new Error('❌ "description" invalid or missing.');
else console.log('✅ Description: ok');
if (
	!json.keywords ||
	!(json.keywords instanceof Array) ||
	json.keywords.length < 1
)
	throw new Error('❌ "keywords" invalid or missing.');
else console.log('✅ Keywords: ok');

if (
	!json.repository ||
	json.repository === null ||
	typeof json.repository !== 'object'
)
	throw new Error('❌ "repository" invalid or missing.');
else console.log('\t ✅ Repository is object: ok');

if (json.repository.type !== 'git')
	throw new Error('❌ "repository.type" isn\'t Git.');
else console.log('\t ✅ Repo type: ok');

try {
	new URL(json.repository.url);
} catch (e) {
	throw new Error(
		''.concat(e.message).includes('Invalid URL') ||
		!''.concat(e.message).startsWith('https://')
			? '❌ "repository.url" is invalid.'
			: String(e)
	);
}
console.log('\t ✅ Repository URL is valid: ok');
console.log('✅ Repository: ok');
if (
	(typeof json.scripts === 'object' && json.scripts === null) ||
	typeof json.scripts !== 'object'
)
	throw new Error('❌ "scripts" invalid or missing.');
