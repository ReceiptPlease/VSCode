
import * as Paths from './Paths.js'
import * as Args from './Args.js'

import { copy , move } from 'FileSystem'
import { join } from 'Path'

import transpile from './ESBuild.js'


const { remove , run } = Deno;
const { clear , log } = console;


clear();

log(`Building Package - ${ ( Math.random() * 10 ** 4 ) | 0 }`);


await transpile();

await remove(Paths.Zip,{ recursive : true }).catch(() => {});
await remove(Paths.Package).catch(() => {});

await copy(Paths.Packaging,Paths.Zip);
await copy(Paths.Build,join(Paths.Zip,'extension'));
await move(join(Paths.Zip,'package.json'),join(Paths.Zip,'extension','package.json'));
await move(join(Paths.Zip,'README.md'),join(Paths.Zip,'extension','README.md'));
await move(join(Paths.Zip,'LICENSE'),join(Paths.Zip,'extension','LICENSE'));


if( Args.zip ){

    /*
     *  Zip the /Zip/ directory and
     *  save it as ReceiptPlease.vsix
     */

    const process = run({
        cmd : [ 'zip' , '-r' , Paths.Package , '.' ] ,
        cwd : Paths.Zip
    })

    log(await process.status());

    Deno.exit();
}


log('Done');

