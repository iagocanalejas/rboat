import { app } from "../scripts.js";

const component = "r-results";
const template = document.createElement("template");

template.innerHTML = `
<style>
.results {
    max-width: min(60%, 400px);
    margin: 20px auto;
    padding: 20px;
    background: #1e1e1e;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    border: 1px solid #333;
    color: #ddd;
}
.results div {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #333;
}
.results div:last-child {
    border-bottom: none;
}
.results span {
    font-size: 14px;
    color: #bbb;
}
.results h2 {
    text-align: center;
    color: #ddd;
    font-size: 20px;
    margin-bottom: 15px;
}
.button {
    display: block;
    max-width: min(60%, 400px);
    width: min(60%, 400px);
    padding: 10px;
    margin: 20px auto;
    background: #444;
    color: #ddd;
    border: 1px solid #555;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition:
        background 0.2s ease,
        box-shadow 0.2s ease;
}

.button:hover {
    background: #666;
    box-shadow: 0 0 5px rgba(200, 200, 200, 0.2);
}

.button:active {
    background: #888;
}
</style>
<div id="results" class="results">
	<h2>Resultados</h2>
	<div id="center">
		<span>Centro de Gravedad (desde proa)</span>
		<span id="gravity-center-result">---</span>
	</div>
	<div id="ratio">
		<span>Ratio (mayor igual mas peso en proa)</span>
		<span id="ratio-result">---</span>
	</div>
</div>
<div><button id="calculate" class="button">Calcular</button></div>
<div><button id="save" class="button">Guardar</button></div>
`;

customElements.define(
    component,
    class extends HTMLElement {
        /** @type {BoatResult} */
        #result = undefined;
        /** {number[]} */
        #sweetSpot = undefined;

        /** @type {BoatResult} */
        get result() {
            return this.#result;
        }

        /** @param {BoatResult} value */
        set result(value) {
            this.#result = value;
            if (!this.#result) return;

            this.ratioResult.textContent = this.#result.ratio.toFixed(2);
            this.gravityCenterResult.textContent = this.#result.centerOfGravity.toFixed(2);

            if (this.#sweetSpot && this.#result.ratio > this.#sweetSpot[0] && this.#result.ratio < this.#sweetSpot[1]) {
                this.gravityCenterResult.style.color = "green";
                this.ratioResult.style.color = "green";
            }
        }

        /** @param {number[]} value */
        set sweetSpot(value) {
            this.#sweetSpot = undefined;
            this.gravityCenterResult.style.color = "";
            this.ratioResult.style.color = "";
            if (value && value.length === 2) {
                this.#sweetSpot = value;
            }
        }

        constructor() {
            super();
            const root = this.attachShadow({ mode: "open" });
            root.append(template.content.cloneNode(true));
        }

        connectedCallback() {
            this.ratioResult = this.shadowRoot.querySelector("#ratio-result");
            this.gravityCenterResult = this.shadowRoot.querySelector("#gravity-center-result");

            this.shadowRoot.querySelector("#calculate").addEventListener("click", () => app.calculate());
            this.shadowRoot.querySelector("#save").addEventListener("click", () => app.save());
        }
    },
);
