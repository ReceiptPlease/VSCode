
<br>

<div align = center>

[![Badge Stars]][#]   
[![Badge Release]][Releases]

<br>
<br>

# Receipt Please <br> VSCode

*An extension for **[VSCode]** to*  
*improve **[Shopify]** development.*

<br>
<br>

<img
    height = 400
    src = 'Resources/Screenshots/Schema Editor.png'
/>

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

-   Section schema editor

    *Work in progress*

<br>
<br>

## Building

*How to compile the extension yourself.*

<br>

-   Install **Deno**

-   Build & zip the extension

    ```sh
    deno task build --zip
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

[Releases]: https://github.com/ReceiptPlease/VSCode/releases
[Shopify]: https://www.shopify.com/
[VSCode]: https://code.visualstudio.com/

[#]: #


<!---------------------------------[ Badges ]---------------------------------->

[Badge Release]: https://img.shields.io/github/v/release/ReceiptPlease/VSCode?style=for-the-badge&logoColor=white&logo=GitHub&labelColor=2f76b9&color=28659e
[Badge Stars]: https://img.shields.io/github/stars/ReceiptPlease/VSCode?style=for-the-badge&logoColor=white&logo=Trustpilot&labelColor=FF66AA&color=cf538b
