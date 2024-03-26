class Heading extends Component {
    constructor(id) {
        const props = {
            name: "Heading",
            className: "comp-heading",
            template: `
                <h1>Heading</h1>
                <h4>Subheading</h4>
            `
        }

        super(id, props);
    }
}