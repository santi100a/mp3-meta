console.clear();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { writeFileSync } = require('node:fs');

console.log('🚚 Importing module...');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cjsModule = require('../cjs/index.js');
const cjsExports = Object.keys(cjsModule);

const esmModuleContent = `import cjsModule from './cjs/index.js';
/*eslint no-empty-pattern: "warn"*/
export const { ${cjsExports
	.filter(i => i !== 'default')
	.join(', ')} } = cjsModule;
${cjsExports.includes('default') ? "export default cjsModule['default'];" : ''}
`;
console.log('📦 Writing wrapper...');
writeFileSync('./index.mjs', esmModuleContent);
console.log('✨ Prettifying...');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('node:child_process').execSync('npx prettier --write ./index.mjs');
console.log('✅ Finished!');
