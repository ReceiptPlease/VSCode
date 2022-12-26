
import { parse } from 'Flags'


const { args } = Deno;


const flags = parse(args);


export const zip = 
    flags.zip === true;