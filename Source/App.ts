
import { SnippetString , Selection , commands , window , ExtensionContext } from 'vscode'


const { log } = console;


import { TreeDataProvider , TreeItem } from 'vscode'
import { join } from 'node:path'
import * as VS from 'vscode'


class SchemaItem extends TreeItem {

    filePath : string ;

    constructor( context , label , filePath ){

        super(label);

        this.filePath = filePath;

        this.command = {
            "arguments" : [ context , filePath ] ,
            "command" : "ReceiptPlease.OpenSchema" ,
            "title" : "Open Schema"
        }
    }
}

import { readdir , readFile , writeFile } from 'node:fs/promises'


class SchemaTree implements TreeDataProvider<SchemaItem> {

    context : ExtensionContext ;

    constructor ( context : ExtensionContext ){
        this.context = context;
    }

    getTreeItem ( element ){
        return element;
    }

    async getChildren ( element ){

        const { customChildren } = element ?? {};

        if(customChildren)
            return customChildren

        const folder = VS.workspace.workspaceFolders?.at(0)?.uri.path

        if(folder){

            const sections = join(folder,'sections');

            log(folder);

            // log(await readdir(this.context.extensionPath));

            const items = await readdir(sections)
                .catch(() => []);

            const schemas = items
                .filter((name) => name.endsWith('.liquid'))
                .map((name) => {
                    return new SchemaItem(this.context,name.replace('.liquid',''),join(sections,name));
                });

            return schemas
        }

        return []
      }


}


export function activate ( context : ExtensionContext ){

    log(`Activating ReceiptPlease Extension`);

    commands.registerCommand('ReceiptPlease.InsertLiquidTag',() => insertLiquidTag());
    commands.registerCommand('ReceiptPlease.InsertLiquidTag_Stripped',() => insertLiquidTag(true));
    commands.registerCommand('ReceiptPlease.InsertLiquidValue',() => insertLiquidValue());
    commands.registerCommand('ReceiptPlease.OpenSchema',openSchema);

    window.registerTreeDataProvider('receipt_please.schema_browser',new SchemaTree(context));
}

export function deactive (){}


function insertLiquidValue (){

    const snippet = new SnippetString(`{{  }}`);

    window.activeTextEditor?.insertSnippet(snippet);

    if(window.activeTextEditor){
        const position = window.activeTextEditor
        ?.selection.start.translate({ characterDelta : 3 });

        window.activeTextEditor.selection = new Selection(position,position);
    }
}

function insertLiquidTag ( strip = false ){

    let tag = '{%';

    if(strip)
        tag += '-';

    tag += '  ';

    if(strip)
        tag += '-';

    tag += '%}';


    let characterDelta = 3;

    if(strip)
        characterDelta++;


    const snippet = new SnippetString(tag);

    window.activeTextEditor?.insertSnippet(snippet);

    if(window.activeTextEditor){
        const position = window.activeTextEditor?.selection.start.translate({ characterDelta });

        window.activeTextEditor.selection = new Selection(position,position);
    }
}


import { WebviewPanel , ViewColumn , Uri } from 'vscode'

let webview : WebviewPanel | null;
let viewPath : string;

async function openSchema ( context : ExtensionContext , filePath : string ){

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
