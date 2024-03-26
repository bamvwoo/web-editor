import Editor from "./Editor.class.js";

window.onload = () => {
    const editor = new Editor("editor");

    const heading1 = editor.addComponent("Heading1");
    heading1.content = "Hello, World!";

    const column2 = editor.addComponent("Column2");
    const column3 = editor.addComponent("Column3");
}