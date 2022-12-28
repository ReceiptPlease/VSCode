
import * as Paths from './Paths.js'

import { emptyDir } from 'FileSystem'
import { build , stop } from 'ESBuild'
import { join } from 'Path'


const { log } = console;


export default async function transpile (){

    await emptyDir(Paths.Build);

    const process = await build({
        entryPoints : [ join(Paths.Source,'Extension','App.ts') ] ,
        platform : 'node' ,
        outdir : Paths.Build ,
        target : [ 'node16' ] ,
        format : 'cjs' ,
        bundle : true ,
        external : [
            'vscode' ,
            'node:path' ,
            'ndoe:fs/promises'
        ]
    })

    log(process);

    stop();
}
