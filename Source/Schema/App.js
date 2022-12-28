

const { log } = console;

const api = acquireVsCodeApi();

const element = document.getElementById('max_blocks');

if(element)
    element.oninput = update;

function update (){

    log('pstitng message');

    api.postMessage({
        command : 'updateFile' ,
        content : {
            max_blocks : parseInt(document.getElementById('max_blocks')?.value)
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
