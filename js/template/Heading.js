export default function(instance) {
    console.log(instance);
    return `
        <h${instance.size}>${instance.content}</h${instance.size}>
    `;
}