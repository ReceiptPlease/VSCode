
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

        const folder = workspace.workspaceFolders?.at(0)?.uri.path

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


