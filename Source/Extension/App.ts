
import { insertLiquidValue , insertLiquidTag } from './Liquid/Insert.ts';
import { ExtensionContext , commands } from 'vscode'
import { openSchema } from './Schema/Open.ts';
import * as Schema from './Schema/Schema.ts'


const { log } = console;


export function activate ( context : ExtensionContext ){

    log(`Activating ReceiptPlease Extension`);

    commands.registerCommand('ReceiptPlease.InsertLiquidTag_Stripped',() => insertLiquidTag(true));
    commands.registerCommand('ReceiptPlease.InsertLiquidTag',() => insertLiquidTag(false));

    commands.registerCommand('ReceiptPlease.InsertLiquidValue',insertLiquidValue);
    commands.registerCommand('ReceiptPlease.OpenSchema',openSchema);


    Schema.init(context);
}

export function deactive (){}

