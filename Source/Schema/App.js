

const
    html_max_blocks = document.getElementById('max_blocks') ,
    html_class = document.getElementById('class') ,
    html_name = document.getElementById('name') ,
    html_tag = document.getElementById('tag') ;



const { log } = console;

const api = acquireVsCodeApi();


html_max_blocks.oninput = update;
html_class.oninput = update;
html_name.oninput = update;
html_tag.onchange = update;


function update (){

    log('pstitng message');


    let max_blocks = parseInt(html_max_blocks.value);

    if( isNaN(max_blocks) )
        max_blocks = null;

    const name = html_name.value;


    let tag = html_tag.value;

    if( tag === 'div' )
        tag = null;


    let classes = html_class.value.trim();

    if( classes.length < 1 )
        classes = null;

    api.postMessage({
        command : 'updateFile' ,
        content : {
            max_blocks ,
            class : classes ,
            name ,
            tag
        }
    })
}


window.addEventListener('message',( event ) => {

    const { data } = event;

    switch ( data.command ){
    case 'updateInterface' :

        html_max_blocks.value = data.content.max_blocks;
        html_name.value = data.content.name;
        html_class.value = data.content.class ?? '';
        html_tag.value = data.content.tag ?? 'div';

        break;
    }
});
