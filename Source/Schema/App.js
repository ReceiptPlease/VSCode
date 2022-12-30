
const create = ( type = 'div' ) =>
    document.createElement(type);

const byId = ( id ) =>
    document.getElementById(id);



const
    html_settings_addition = byId('settings_addition') ,
    html_max_blocks = byId('max_blocks') ,
    html_settings = byId('settings') ,
    html_class = byId('class') ,
    html_limit = byId('limit') ,
    html_name = byId('name') ,
    html_tag = byId('tag') ;


let settings;


const { log } = console;

const api = acquireVsCodeApi();


html_max_blocks.oninput = update;
html_class.oninput = update;
html_limit.onchange = update;
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

    let limit = html_limit.value;

    if( limit === 'unlimited' )
        limit = null;

    api.postMessage({
        command : 'updateFile' ,
        content : {
            max_blocks ,
            class : classes ,
            limit ,
            name ,
            tag
        }
    })
}


for ( const element of html_settings_addition.childNodes )
    element.addEventListener('click',() => {

        const { type } = element.dataset;

        log('clicked',type);
    })

window.addEventListener('message',( event ) => {

    const { data } = event;

    switch ( data.command ){
    case 'updateInterface' :

        const { content } = data;

        html_max_blocks.value = content.max_blocks ?? '';
        html_limit.value = content.limit ?? 'unlimited';
        html_class.value = content.class ?? '';
        html_name.value = content.name;
        html_tag.value = content.tag ?? 'div';


        html_settings.innerHTML = '';

        settings = content.settings ?? [];

        for ( const setting of settings )
            makeSettings(setting);

        break;
    }
});


const Settings = {
    'checkbox' : checkbox
}

function checkbox ( setting ){

    const item = create();

    {
        const remove = create('div');
        remove.innerText = 'x';
        item.appendChild(remove);

        remove.addEventListener('click',() => {
            settings.splice(settings.indexOf(settings));
            item.remove();
            update();
        })
    }

    {
        const header = create('h2');
        header.innerText = 'Checkbox';
        item.appendChild(header);
    }

    {
        const label = create('label');
        label.innerHTML = `<a> Id </a> <br> to identify the setting.`;

        const input = create('input');
        input.type = 'text';
        input.value = setting.id ?? '';

        input.addEventListener('input',() => {
            settings.id = input.value;
            update();
        })

        item.appendChild(label);
        item.appendChild(create('br'));
        item.appendChild(input);
    }

    item.appendChild(create('br'));
    item.appendChild(create('br'));

    {
        const label = create('label');
        label.innerHTML = `<a> Label </a> <br> to display in the customizer.`;

        const input = create('input');
        input.type = 'text';
        input.value = setting.label ?? '';

        input.addEventListener('input',() => {
            settings.label = input.value;
            update();
        })

        item.appendChild(label);
        item.appendChild(create('br'));
        item.appendChild(input);
    }

    item.appendChild(create('br'));
    item.appendChild(create('br'));

    {
        const label = create('label');
        label.innerHTML = `<a> Default </a> <br> state to be set to.`;

        const input = create('input');
        input.type = 'checkbox';
        input.value = setting.default ?? false;

        input.addEventListener('input',() => {
            settings.default = input.value;
            update();
        })

        item.appendChild(label);
        item.appendChild(create('br'));
        item.appendChild(input);
    }

    item.appendChild(create('br'));
    item.appendChild(create('br'));

    {
        const label = create('info');
        label.innerHTML = `<a> Info </a> <br> that describes the settings.`;

        const input = create('input');
        input.type = 'text';
        input.value = setting.info ?? '';

        input.addEventListener('input',() => {

            let { value } = input;

            if( value.length < 1 )
                value = null;

            settings.info = value;
            update();
        })

        item.appendChild(label);
        item.appendChild(create('br'));
        item.appendChild(input);
    }


    html_settings.appendChild(item);
}

function unknown ( setting ){

    const item = create();

    item.innerText = `Setting type not implemented : ${ setting.type }`;

    html_settings.appendChild(item);
}

function makeSettings ( setting ){

    const { type } = setting;

    if( type in Settings )
        Settings[type](settings);
    else
        unknown(setting);
}
