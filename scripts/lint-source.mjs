import { readdirSync, readFileSync } from 'node:fs';
const files=[];
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())walk(path);else if(/\.tsx?$/.test(path))files.push(path);}}
walk('src');
const rules=[[/\bdebugger\s*;/g,'debugger statement'],[/\beval\s*\(/g,'unsafe evaluation'],[/dangerouslySetInnerHTML/g,'unreviewed raw HTML'],[/href=["'](?:#|javascript:)["']/g,'inert or unsafe link'],[/console\.log\s*\(/g,'production console logging']];
const issues=[];
for(const file of files){const source=readFileSync(file,'utf8');for(const [rule,label] of rules){for(const match of source.matchAll(rule))issues.push(`${file}:${source.slice(0,match.index).split('\n').length} ${label}`);}for(const match of source.matchAll(/<button\b[^>]*>/g)){if(!/\btype=/.test(match[0])){const after=source.slice(match.index,source.indexOf('</button>',match.index));if(!/\btype=/.test(after))issues.push(`${file}: button missing explicit type`);}}}
if(issues.length)throw new Error(issues.join('\n'));
console.log(`Source lint passed for ${files.length} TypeScript modules: explicit button types, link safety, and no raw HTML/eval/debugger.`);
