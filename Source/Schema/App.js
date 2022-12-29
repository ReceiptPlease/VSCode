

const
    html_max_blocks = document.getElementById('max_blocks') ,
    html_name = document.getElementById('name') ;



const { log } = console;

const api = acquireVsCodeApi();


html_max_blocks.oninput = update;
html_name.oninput = update;


function update (){

    log('pstitng message');


    let max_blocks = parseInt(html_max_blocks.value);

    if( isNaN(max_blocks) )
        max_blocks = null;

    const name = html_name.value;

    api.postMessage({
        command : 'updateFile' ,
        content : {
            max_blocks ,
            name
        }
    })
}


window.addEventListener('message',( event ) => {

    const { data } = event;

    switch ( data.command ){
    case 'updateInterface' :

        html_max_blocks.value = data.content.max_blocks;
        html_name.value = data.content.name;

        break;
    }
});
