const component = "r-draw";
const template = document.createElement("template");

template.innerHTML = `
<canvas id="weightCanvas" width="1000" height="300"></canvas>
`;

customElements.define(
    component,
    class extends HTMLElement {
        constructor() {
            super();
            const root = this.attachShadow({ mode: "open" });
            root.append(template.content.cloneNode(true));
        }

        connectedCallback() {
            const canvas = this.shadowRoot.getElementById("weightCanvas");
            const ctx = canvas.getContext("2d");

            const width = canvas.width;
            const height = canvas.height;

            // Define weight positions along the length
            const positions = [50, 150, 250, 350, 450]; // X positions of weights

            // Draw the main horizontal line
            ctx.beginPath();
            ctx.moveTo(20, height / 2);
            ctx.lineTo(width - 20, height / 2);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw vertical lines crossing the horizontal line
            positions.forEach((position) => {
                ctx.beginPath();
                ctx.moveTo(position, height / 2 - 20); // Extend above the line
                ctx.lineTo(position, height / 2 + 20); // Extend below the line
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        }
    },
);
