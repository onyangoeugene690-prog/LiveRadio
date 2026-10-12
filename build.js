const fs = require('fs');
const babel = require('./babel.js');

let source = fs.readFileSync('script.jsx', 'utf8');
source = source.replace(/^\uFEFF/, '').replace(/^[\s\0\ufeff\ufffe]+/, '');
if (source.charCodeAt(0) > 127) {
  source = source.substring(source.indexOf('const'));
}

const output = babel.transform(source, {
  presets: [['react', { runtime: 'classic' }]]
}).code;

fs.writeFileSync('script.js', output, 'utf8');
console.log('Successfully compiled script.jsx to script.js with classic runtime! Output size:', output.length);
