
import * as Paths from './Paths.js'

import { copy , move } from 'FileSystem'
import { join } from 'Path'

await Deno.remove(Paths.Zip,{ recursive : true }).catch(() => {});
await Deno.remove(Paths.Package).catch(() => {});

await copy(Paths.Packaging,Paths.Zip);
await copy(Paths.Build,join(Paths.Zip,'extension'));
await move(join(Paths.Zip,'package.json'),join(Paths.Zip,'extension','package.json'));
await move(join(Paths.Zip,'README.md'),join(Paths.Zip,'extension','README.md'));
await move(join(Paths.Zip,'LICENSE'),join(Paths.Zip,'extension','LICENSE'));

const compressCommandProcess = Deno.run({
  cmd : [ "zip", "-r" , Paths.Package , '.' ] ,
  cwd : Paths.Zip
});

console.log(await compressCommandProcess.status());