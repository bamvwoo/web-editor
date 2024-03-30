import Editor from "../js/Editor.js";
import Component from "../js/comp/Component.js";

window.onload = async () => {
    const editor :Editor = new Editor("editor");

    const heading :Component = await editor.addComponent(Component.NAME_HEADING, {
        content: "Hello World!"
    });

    await heading.setContent("Hello World! Again!");

    // heading.setStyle({
    //     color: "red"
    // });

    // heading.setStyle({
    //     "font-weight": "bold"
    // }, null, true);

    const column2 :Component = await editor.addComponent(Component.NAME_COLUMN, {
        size: 2
    });
    
    const column3 :Component = await editor.addComponent(Component.NAME_COLUMN, {
        size: 3
    });

    // column2.setStyle({
    //     "background-color": "yellow"
    // });
}