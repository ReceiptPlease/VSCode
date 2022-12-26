
import * as Paths from './Paths.js'

import { emptyDir } from 'FileSystem'
import { build , stop } from 'ESBuild'
import { join } from 'Path'


const { log } = console;


export default async function transpile (){

    await emptyDir(Paths.Build);

    const process = await build({
        entryPoints : [ join(Paths.Source,'App.ts') ] ,
        platform : 'node' ,
        outdir : Paths.Build ,
        target : [ 'node16' ] ,
        format : 'cjs'
    })

    log(process);

    stop();
}
