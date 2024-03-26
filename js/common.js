window.onload = () => {
    const editor = new Editor("editor");

    editor.addComponent("Heading");
}

const createUniqueId = () => {
    return Number(Math.random()).toString(32).substring(2);
}