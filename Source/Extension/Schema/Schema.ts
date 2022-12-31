
import { ExtensionContext , workspace , window , TreeDataProvider , TreeItem } from 'vscode'
import { readdir , readFile } from 'node:fs/promises'
import { join } from 'node:path'


const { log } = console;


export function init ( context : ExtensionContext ){

    window.registerTreeDataProvider('receipt_please.schema_browser',new SchemaTree(context));

}


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



const isLiquid = ( filename ) =>
    filename.endsWith('.liquid');

const capitalize = ( word ) =>
    word.charAt(0).toUpperCase() + word.slice(1);

const nonEmpty = ( string ) =>
    string.length > 0;


const schemePattern = /(?<=\{% *schema *%\})[\S\s]*(?=\{% *endschema *%\})/;


async function hasSchema ( path ){

    const content = await readFile(path,{ encoding : 'utf8' });

    return schemePattern.test(content)
}


class SchemaTree implements TreeDataProvider<SchemaItem> {

    context : ExtensionContext ;

    constructor ( context : ExtensionContext ){
        this.context = context;
    }

    getTreeItem ( element ){
        return element;
    }

    async getChildren (){

        const folder = workspace.workspaceFolders?.at(0)?.uri.path

        if( ! folder )
            return []


        const sections = join(folder,'sections');

        const files = await readdir(sections)
            .catch(() => []);


        const { context } = this;


        const children : SchemaItem [] = [];

        for ( const file of files ){

            if( ! isLiquid(file) )
                continue

            const path = join(sections,file);

            const isSchema = await hasSchema(path);

            if( ! isSchema )
                continue

            const label = file
                .replace(/\.liquid$/,'')
                .split(/[_-]+/g)
                .filter(nonEmpty)
                .map(capitalize)
                .join(' ');

            const item = new SchemaItem(context,label,path);

            children.push(item);
        }

        return children
    }
}
