
import { fromFileUrl , dirname , join } from 'Path'


const project = join(dirname(fromFileUrl(import.meta.url)),'..');


export const Packaging = 
    join(project,'Configs','Packaging');

export const Package =
    join(project,'Build','ReceiptPlease.vsix');

export const Build =
    join(project,'Build','Transpiled');

export const Zip =
    join(project,'Build','Zip');
