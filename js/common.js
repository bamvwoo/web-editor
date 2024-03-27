import Editor from "./Editor.class.js";

window.onload = () => {
    const editor = new Editor("editor");

    const heading = editor.addComponent("Heading", {
        content: "Hello, World!"
    });

    // heading.setContent("Hello, World!");
    heading.setStyle({
        color: "red"
    });

    const column2 = editor.addComponent("Column", {
        size: 2
    });
    const column3 = editor.addComponent("Column", {
        size: 3
    });
}