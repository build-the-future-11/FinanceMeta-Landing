import {writeFileSync,readFileSync} from 'node:fs';
import {editorialExplainers} from '../src/content/editorial.ts';
// Only card metadata is imported into the shared client catalog.
const metadata=editorialExplainers.map(({slug,title,dek,reviewedAt,readMinutes})=>({slug,title,dek,reviewedAt,readMinutes}));
writeFileSync('src/content/editorial-index.json',JSON.stringify(metadata,null,2)+'\n');
const png=readFileSync('public/social-preview.png');
if(png.readUInt32BE(16)!==1200||png.readUInt32BE(20)!==630)throw new Error('Expected a 1200 × 630 social card.');
console.log(`Prepared ${metadata.length} article summaries; verified the committed PNG social card.`);
