var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Editor from "../js/Editor.js";
import Component from "../js/comp/Component.js";
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    const editor = new Editor("editor");
    const heading = yield editor.addComponent(Component.NAME_HEADING, {
        content: "Hello World!"
    });
    // await heading.setContent("Hello World! Again!");
    // heading.setStyle({
    //     color: "red"
    // });
    // heading.setStyle({
    //     "font-weight": "bold"
    // }, null, true);
    const column2 = yield editor.addComponent(Component.NAME_COLUMN, {
        size: 2
    });
    const column3 = yield editor.addComponent(Component.NAME_COLUMN, {
        size: 3
    });
    // column2.setStyle({
    //     "background-color": "yellow"
    // });
});
