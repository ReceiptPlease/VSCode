
<div align = center>

# Receipt Please <br> VSCode

*An extension for **[VSCode]** to*  
*improve **[Shopify]** development.*

<br>
<br>

</div>

## Features

*This is a prototype, thus not many features.*

<br>

-   Insert liquid tags

    <kbd>Ctrl</kbd> + <kbd>L</kbd>
    
    Without whitespace ( <kbd>Shift</kbd> )
    
    <br>
    
-   Insert liquid value

    <kbd>Ctrl</kbd> + <kbd>I</kbd>

<br>
<br>

## Building

*In development, no pre-built downloads.*

<br>

-   Install **Deno**

-   Transpile TS to JS

    ```sh
    deno task typescript
    ```

-   Build the extension

    ```sh
    deno task build
    ```
    
-   Install the `VSIX` zip found at

    ```
    Build/ReceiptPlease.vsix
    ```

<br>
<br>

## Plans

-   Move VSCE replacement code into separate project

-   More features ..

<br>


<!----------------------------------------------------------------------------->

[Shopify]: https://www.shopify.com/
[VSCode]: https://code.visualstudio.com/
