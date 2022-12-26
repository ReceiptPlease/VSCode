
import { SnippetString , Selection , commands , window } from 'vscode'


const { log } = console;


export async function activate ( context ){

    log(`Activating ReceiptPlease Extension 1`);

    commands.registerCommand('ReceiptPlease.InsertLiquidTag',() => insertLiquidTag());
    commands.registerCommand('ReceiptPlease.InsertLiquidTag_Stripped',() => insertLiquidTag(true));
    commands.registerCommand('ReceiptPlease.InsertLiquidValue',() => insertLiquidValue());
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
