export default function(instance) {
    const size = instance.size;

    let template = "";
    for (let i = 0; i < size; i++) {
        template += `<div></div>`;
    };

    return template;
}