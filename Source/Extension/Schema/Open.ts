

import { ExtensionContext , window , WebviewPanel , ViewColumn , Uri } from 'vscode'
import { readFile , writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const { log } = console;

let webview : WebviewPanel | null;
let viewPath : string;

export async function openSchema ( context : ExtensionContext , filePath : string ){

    try {

        if( ! webview ){

            webview = window.createWebviewPanel('ReceiptPlease.SchemaView','Schema',ViewColumn.One,{
                enableScripts : true
            });

            webview.onDidDispose(() => {
                webview = null;
            },null,context.subscriptions)
        }

        if( viewPath === filePath )
            return

        log('Opening Schema',filePath);

        viewPath = filePath;

        const toLocal = ( path ) =>
            webview?.webview.asWebviewUri(Uri.file(path)) ?? '';


        const content = await readFile(filePath, { encoding: 'utf8' });

        const schemePattern = /(?<=\{% *schema *%\})[\S\s]*(?=\{% *endschema *%\})/;

        const json = content.match(schemePattern)?.[0];

        let data = '';

        if(json){

            const schema = JSON.parse(json);

            log(schema);

            data = `
                <label for = max_blocks>Maximum number of blocks ( 0 - 50 ):</label>
                <input type = number id = max_blocks name = max_blocks min = 0 max = 50>
            `

            log('data',data)

            webview.webview.postMessage({
                command : 'updateInterface' ,
                content : schema
            });

            webview.webview.onDidReceiveMessage(async ( message ) => {

                const { command } = message;

                switch ( command ){
                case 'updateFile' : {

                    log('Update File',message);

                    const merged = deepExtend(schema,message.content);

                    log('Merged',merged);

                    const json = `\n${ JSON.stringify(merged,null,4) }\n`;

                    const original = await readFile(filePath,{ encoding: 'utf8' });

                    const changed = original.replace(schemePattern,json);

                    await writeFile(filePath,changed);

                    return
                }
                }
            },null,context.subscriptions);

            log('done');
        } else {
            console.warn('NO JSON')
        }


        const script = toLocal(join(context.extensionPath,'Assets','App.js'));
        const style = toLocal(join(context.extensionPath,'Assets','Style.css'));

        log('links',script,style);

        webview.webview.html = `
            <html lang = en>
                <head>
                    <meta charset = 'UTF-8'>
                    <meta name = viewport content = 'width=device-width, initial-scale=1.0'>
                    <script type = module src = '${ script }'defer></script>
                    <link rel = stylesheet type = 'text/css' href = '${ style }'>
                </head>
                <body>
                    <div id = Settings >
                        ${ data }
                    </div>
                </body>
            </html>
        `

    } catch ( e ){
        console.warn('eRR',e)
    }
}


function deepExtend ( original , changes ){
    for (var property in changes) {
       if (typeof changes[property] === "object" &&
       changes[property] !== null ) {
        original[property] = original[property] || {};
         arguments.callee(original[property], changes[property]);
       } else {
        original[property] = changes[property];
       }
    }

    return original
}
