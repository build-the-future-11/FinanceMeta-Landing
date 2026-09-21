import {readFileSync,writeFileSync} from 'node:fs';
import {Resvg} from '@resvg/resvg-js';
// Intentional design edit: review and retain the output in public/. Standard builds
// use this checked-in PNG, avoiding differences in installed system fonts.
writeFileSync('public/social-preview.png',new Resvg(readFileSync('public/social-preview.svg'),{font:{defaultFontFamily:'Georgia'}}).render().asPng());
