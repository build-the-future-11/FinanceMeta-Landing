import { catalog } from '../.site-build/prerender.js';
import { validateCatalog } from '../src/lib/content-validation.ts';
const errors=validateCatalog(catalog);
if(errors.length)throw new Error(`Content validation failed:\n${errors.join('\n')}`);
console.log('Content relationships, release evidence, dates and external URL contracts verified.');
