import Heading from "../Heading";

export default function(instance: Heading): string {
    return `
        <h${instance.size}>${instance.content}</h${instance.size}>
    `;
}