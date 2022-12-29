

const { log } = console;

const api = acquireVsCodeApi();

const element = document.getElementById('max_blocks');

if(element)
    element.oninput = update;

function update (){

    log('pstitng message');


    let max_blocks =  parseInt(document.getElementById('max_blocks')?.value);

    if( isNaN(max_blocks) )
        max_blocks = null;

    api.postMessage({
        command : 'updateFile' ,
        content : {
            max_blocks
        }
    })
}

window.addEventListener('message',( event ) => {

    const { data } = event;

    switch ( data.command ){
    case 'updateInterface' :

        const element = document.getElementById('max_blocks');

        if(element)
            element.value = data.content.max_blocks;

        break;
    }
});
