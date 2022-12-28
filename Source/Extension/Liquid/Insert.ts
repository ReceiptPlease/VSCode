
import { SnippetString , Selection , window } from 'vscode'


export function insertLiquidValue (){

    const snippet = new SnippetString(`{{  }}`);

    window.activeTextEditor?.insertSnippet(snippet);

    if(window.activeTextEditor){
        const position = window.activeTextEditor
        ?.selection.start.translate({ characterDelta : 3 });

        window.activeTextEditor.selection = new Selection(position,position);
    }
}

export function insertLiquidTag ( strip = false ){

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
