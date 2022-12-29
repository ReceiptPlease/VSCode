

import { ExtensionContext , window , WebviewPanel , ViewColumn , Uri } from 'vscode'
import { readFile , writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const { log } = console;


const schemePattern = /(?<=\{% *schema *%\})[\S\s]*(?=\{% *endschema *%\})/;



let view : WebviewPanel | null;
let viewPath : string;


export async function openSchema ( context : ExtensionContext , filePath : string ){

    try {

        if( ! view ){

            view = window.createWebviewPanel('ReceiptPlease.SchemaView','Schema',ViewColumn.One,{
                enableScripts : true
            });

            view.onDidDispose(() => {
                view = null;
            },null,context.subscriptions)
        }

        if( viewPath === filePath )
            return

        log('Opening Schema',filePath);

        viewPath = filePath;

        const { webview } = view;


        const content = await readFile(filePath,{ encoding : 'utf8' });


        const json = content.match(schemePattern)?.[0];


        if(json){

            const schema = JSON.parse(json);


            webview.postMessage({
                command : 'updateInterface' ,
                content : schema
            });

            webview.onDidReceiveMessage(async ( message ) => {

                const { command } = message;

                switch ( command ){
                case 'updateFile' : {

                    log('Update File',message);

                    const merged = merge(schema,message.content);

                    log('Merged',merged);

                    const json = `\n${ JSON.stringify(merged,null,4) }\n`;

                    const original = await readFile(filePath,{ encoding: 'utf8' });

                    const changed = original.replace(schemePattern,json);

                    await writeFile(filePath,changed);

                    return
                }
                }
            },null,context.subscriptions);
        }


        const { extensionPath } = context;

        const asset = ( ... path ) => {

            const location =
                join(extensionPath,'Assets', ... path);

            const uri = Uri
                .file(location);

            return webview
                .asWebviewUri(uri)
        }


        view.webview.html = `
            <html lang = en>
                <head>
                    <meta charset = 'UTF-8'>
                    <meta name = viewport content = 'width=device-width, initial-scale=1.0'>
                    <script type = module src = '${ asset('App.js') }'defer></script>
                    <link rel = stylesheet type = 'text/css' href = '${ asset('Style.css') }'>
                </head>
                <body>
                    <div id = Settings >

                        <h1>Schema Editor</h1>

                        <br>

                        <label for = name> <a href = 'https://shopify.dev/themes/architecture/sections/section-schema#name'>Name</a> <br> <small>seen in the customizer.</small> </label>

                        <br>

                        <input type = text id = name name = name>

                        <br>
                        <br>

                        <label for = max_blocks> <a href = 'https://shopify.dev/themes/architecture/sections/section-schema#max_blocks'>Max Blocks</a> <br> <small>that can be added to this section.</small> </label>

                        <br>

                        <input type = number id = max_blocks name = max_blocks min = 0 max = 50>

                        <br>

                    </div>
                </body>
            </html>
        `

    } catch ( e ){
        console.warn('eRR',e)
    }
}


function merge ( original , changes ){

    for ( const key in changes ){

        const value = changes[key];

        if( typeof value !== 'object' ){
            original[key] = value;
            continue
        }

        if( value === null ){
            delete original[key];
            continue
        }

        const object = original[key] ??= {};

        merge(object,value);
    }

    return original
}
