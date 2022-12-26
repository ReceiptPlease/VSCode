
import * as Paths from './Paths.js'
import { build } from 'https://deno.land/x/esbuild@v0.16.10/mod.js'
import { join } from 'Path'
import { emptyDir } from 'FileSystem'

const { clear , log } = console;

clear();


await emptyDir(Paths.Build);

const t = await build({
    entryPoints : [ join(Paths.Source,'App.ts') ] ,
    outdir : Paths.Build ,
    platform : 'node' ,
    format: 'cjs',
    target : [ 'node16' ] ,
    // bundle : true ,
    // packages : 'external' ,
    // external : [ 'vscode' ]
})

log(t);