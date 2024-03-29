import Editor from "./Editor.js";

window.onload = async () => {
    const editor = new Editor("editor");

    const heading = await editor.addComponent("Heading", {
        content: "Hello, World!"
    });

    // heading.setContent("Hello, World!");
    heading.setStyle({
        color: "red"
    });

    const column2 = await editor.addComponent("Column", {
        size: 2
    });
    const column3 = await editor.addComponent("Column", {
        size: 3
    });
}