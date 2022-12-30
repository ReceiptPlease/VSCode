

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


        function option ({ title , description , link , content , id }){
            return [
                `<label for = '${ id }'>` ,
                `<a href = '${ link }'>${ title }</a>` ,
                '<br>' ,
                `<small>${ description }</small>` ,
                `</label>` ,
                '<br>' ,
                content
            ].join('')
        }

        function text ({ title , description , link , id }){
            return option({
                title , description , link , id ,
                content : `<input type = text name = '${ id }' id = '${ id }'>`
            })
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

                        <h1> Schema Editor </h1>

                        <br>

                        ${
                            text({
                                description : 'seen in the customizer.' ,
                                title : 'Name' ,
                                link : 'https://shopify.dev/themes/architecture/sections/section-schema#name' ,
                                id : 'name'
                            })
                        }

                        <br>
                        <br>

                        ${
                            option({
                                description : 'used for the section body.' ,
                                title : 'Tag' ,
                                link : 'https://shopify.dev/themes/architecture/sections/section-schema#tag' ,
                                id : 'tag' ,

                                content : `
                                    <select id = tag name = tag>
                                        <option value = div>Div</option>
                                        <option value = aside>Aside</option>
                                        <option value = footer>Footer</option>
                                        <option value = header>Header</option>
                                        <option value = section>Section</option>
                                    </select>
                                `
                            })
                        }

                        <br>
                        <br>

                        ${
                            text({
                                description : 'the section body gets assigned.' ,
                                title : 'Class' ,
                                link : 'https://shopify.dev/themes/architecture/sections/section-schema#class' ,
                                id : 'class'
                            })
                        }

                        <br>
                        <br>

                        ${
                            option({
                                description : 'of how many times a template can use it.' ,
                                title : 'Limit' ,
                                link : 'https://shopify.dev/themes/architecture/sections/section-schema#limit' ,
                                id : 'limit' ,

                                content : `
                                    <select id = limit name = limit>
                                        <option value = unlimited>Unlimited</option>
                                        <option value = 1>1</option>
                                        <option value = 2>2</option>
                                    </select>
                                `
                            })
                        }

                        <br>
                        <br>

                        ${
                            text({
                                description : 'that can be added to this section.' ,
                                title : 'Max Blocks' ,
                                link : 'https://shopify.dev/themes/architecture/sections/section-schema#max_blocks' ,
                                id : 'max_blocks'
                            })
                        }

                        <br>
                        <br>

                        ${
                            option({
                                description : 'the merchant can use in the customizer.' ,
                                title : 'Settings' ,
                                link : 'https://shopify.dev/themes/architecture/sections/section-schema#settings' ,
                                id : 'settings' ,

                                content : `
                                    <div id = settings_addition>
                                        <div data-type = checkbox></div>
                                        <div data-type = checkbox></div>
                                        <div data-type = checkbox></div>
                                    </div>
                                    <div id = settings></div>
                                `
                            })
                        }

                        <br>
                        <br>

                    </div>
                </body>
            </html>
        `

    } catch ( error ){
        console.warn(error);
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
