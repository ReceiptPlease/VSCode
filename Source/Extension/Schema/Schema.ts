
import { ExtensionContext , workspace , window , TreeDataProvider , TreeItem } from 'vscode'
import { readdir } from 'node:fs/promises'
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

        const toSchema = ( filename ) => {

            const path = join(sections,filename);

            const label = filename
                .replace(/\.liquid$/,'')
                .split(/[_-]+/g)
                .filter(nonEmpty)
                .map(capitalize)
                .join(' ');

            return new SchemaItem(context,label,path);
        }


        return files
            .filter(isLiquid)
            .map(toSchema);
    }
}
