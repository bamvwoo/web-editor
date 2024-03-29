export default function(instance) {
    return `
        <h${instance.size}>${instance.content}</h${instance.size}>
    `;
}