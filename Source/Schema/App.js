
const create = ( type = 'div' ) =>
    document.createElement(type);

const byId = ( id ) =>
    document.getElementById(id);


const capitalize = ( word ) =>
    word.charAt(0).toUpperCase() + word.slice(1);

const nonEmpty = ( string ) =>
    string.length > 0;

const prettify = ( text ) => text
    .split(/[_-]+/g)
    .filter(nonEmpty)
    .map(capitalize)
    .join(' ');


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

log('API',api);


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


    log('Settings',settings);


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

        const setting = { type };

        settings.push(setting);
        makeSettings(setting);
    })

window.addEventListener('message',( event ) => {

    const { data } = event;

    switch ( data.command ){
    case 'updateInterface' :

        log('Interface Update',data.content);

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

    'checkbox' : checkbox ,
    'number' : number ,
    'radio' : radio ,
    'video_url' : video_url ,


    'article' : simple ,
    'blog' : simple ,
    'collection' : simple ,
    'html' : simple ,
    'image_picker' : simple ,
    'link_list' : simple ,
    'page' : simple ,

    'video' : simple ,
    'url' : url ,
    'richtext' : richtext ,
    'product_list' : product_list
}


function settingTemplate ( setting ){

    console.log('Settings',settings);

    const item = create();

    {
        const remove = create('div');
        remove.innerText = '❌';
        item.appendChild(remove);

        remove.addEventListener('click',() => {
            settings.splice(settings.indexOf(setting));
            item.remove();
            update();
        })
    }

    {
        const header = create('h2');
        header.innerHTML = `<img src = '${ document.querySelector(`img[ data-type = '${ setting.type }' ]`).src }'><a href = 'https://shopify.dev/themes/architecture/settings/input-settings#${ setting.type }'>${ prettify(setting.type) }</a>`;
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

    return item
}


function checkbox ( setting ){

    const item = settingTemplate(setting);

    item.appendChild(create('br'));
    item.appendChild(create('br'));

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

    html_settings.appendChild(item);
}

function number ( setting ){

    const item = settingTemplate(setting);

    item.appendChild(create('br'));
    item.appendChild(create('br'));

    const label = create('label');
    label.innerHTML = `<a> Default </a> <br> state to be set to.`;

    const input = create('input');
    input.type = 'number';
    input.value = setting.default ?? 0;

    input.addEventListener('input',() => {
        settings.default = input.value;
        update();
    })

    item.appendChild(label);
    item.appendChild(create('br'));
    item.appendChild(input);

    html_settings.appendChild(item);
}

function simple ( setting ){

    const item = settingTemplate(setting);

    html_settings.appendChild(item);
}

function video_url ( setting ){

    const item = settingTemplate(setting);

    item.appendChild(create('br'));
    item.appendChild(create('br'));

    {
        const label = create('label');
        label.innerHTML = `<a> Accept </a> <br> links from these platforms.`;
        item.appendChild(label);
        item.appendChild(create('br'));

        setting.accept ??= [];

        const { accept } = setting;

        for ( const platform of [ 'youtube' , 'vimeo' ] ){

            const wrapper = create();
            wrapper.className = 'sidebyside';

            const input = create('input');
            input.type = 'checkbox';
            input.checked = accept.includes(platform);

            input.onchange = () => {

                const values = new Set(setting.accept);

                if(input.checked)
                    values.add(platform);
                else
                    values.delete(platform);

                setting.accept = [ ... values ];

                update();
            }

            const label = create('label');
            label.innerHTML = prettify(platform);

            wrapper.appendChild(input);
            wrapper.appendChild(label);

            item.appendChild(wrapper);
        }
    }

    {
        item.appendChild(create('br'));
        item.appendChild(create('br'));

        const label = create('label');
        label.innerHTML = `<a> Placeholder </a> <br> for the video Url.`;

        const input = create('input');
        input.type = 'text';
        input.value = setting.placeholder ?? '';

        input.addEventListener('input',() => {
            settings.placeholder = input.value;
            update();
        })

        item.appendChild(label);
        item.appendChild(create('br'));
        item.appendChild(input);
    }



    html_settings.appendChild(item);
}

function url ( setting ){

    const item = settingTemplate(setting);

    item.appendChild(create('br'));
    item.appendChild(create('br'));

    {
        item.appendChild(create('br'));
        item.appendChild(create('br'));

        const label = create('label');
        label.innerHTML = `<a> Default </a> <br> url to use.`;

        const input = create('select');
        input.innerHTML = `
            <option value = '/collections'>/collections</option>
            <option value = '/collections/all'>/collections/all</option>
        `;
        input.selected = setting.default ?? '/collections';

        input.addEventListener('change',() => {
            settings.default = input.selected;
            update();
        })

        item.appendChild(label);
        item.appendChild(create('br'));
        item.appendChild(input);
    }



    html_settings.appendChild(item);
}

function richtext ( setting ){

    const item = settingTemplate(setting);

    item.appendChild(create('br'));
    item.appendChild(create('br'));

    {
        item.appendChild(create('br'));
        item.appendChild(create('br'));

        const label = create('label');
        label.innerHTML = `<a> Default </a> <br> content to display.`;

        const input = create('textarea');
        input.cols = 16;
        input.rows = 4;
        input.value = setting.default ?? '';

        input.addEventListener('change',() => {
            settings.default = input.value;
            update();
        })

        item.appendChild(label);
        item.appendChild(create('br'));
        item.appendChild(input);
    }



    html_settings.appendChild(item);
}

function product_list ( setting ){

    const item = settingTemplate(setting);

    item.appendChild(create('br'));
    item.appendChild(create('br'));

    {
        item.appendChild(create('br'));
        item.appendChild(create('br'));

        const label = create('label');
        label.innerHTML = `<a> Limit </a> <br> of collections to include ( 1 - 50 ).`;

        const input = create('input');
        input.type = 'text';
        input.value = setting.limit ?? '';

        input.addEventListener('change',() => {

            let { value } = input;

            value = parseInt(value);


            if( Number.isFinite(value) ){

                if( value < 1 )
                    value = 1;

                if( value > 50 )
                    value = 50;

                input.value = value;

            } else {
                value = null;
            }

            settings.limit = value;
            update();
        })

        item.appendChild(label);
        item.appendChild(create('br'));
        item.appendChild(input);
    }



    html_settings.appendChild(item);
}


function radio ( setting ){

    const item = settingTemplate(setting);


    item.appendChild(create('br'));
    item.appendChild(create('br'));

    {
        const label = create('label');
        label.innerHTML = `<a> Options </a> <br> the merchant can choose from.`;

        const input = create('select');
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
        input.value = setting.default ?? 0;

        input.addEventListener('input',() => {
            settings.default = input.value;
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
        Settings[type](setting);
    else
        unknown(setting);
}
