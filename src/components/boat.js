import { DEFAULT_BOAT } from "../data/values.js";
import { app } from "../scripts.js";

const component = "r-boat-config";
const template = document.createElement("template");

template.innerHTML = `
<style>
#snippets-container {
	margin: 10px 20px;
}
</style>
<div class="collapsible">
	<button class="form-header">
		<span id="boat-name">Batel</span>
		<span class="arrow">▼</span>
	</button>
	<div id="collapsible-content">
		<div id="snippets-container">
			<select id="snippets"></select>
		</div>
		<form id="boat-form" style="margin-top: 0">
			<div>
				<label for="length">Eslora (mm)</label>
				<input type="number" id="length" name="length" placeholder="7000" />
				<span class="error" id="length-error"></span>
			</div>
			<div>
				<label for="bow">Línea de flotación de proa (mm)</label>
				<input type="number" id="bow" name="bow" placeholder="400" />
			</div>
			<div>
				<label for="stern">Línea de flotación de popa (mm)</label>
				<input type="number" id="stern" name="stern" placeholder="420" />
			</div>
			<div>
				<label for="weight">Peso (kg)</label>
				<input type="number" id="weight" name="weight" placeholder="65" />
				<span class="error" id="weight-error"></span>
			</div>
			<div>
				<label for="ballast">Lastre (kg)</label>
				<input type="number" step=".01" id="ballast" name="ballast" placeholder="6" />
			</div>
			<div>
				<label for="ballast-position">Position lastre (desde proa)</label>
				<input type="number" id="ballast-position" name="ballast-position" placeholder="2000" />
			</div>
			<div>
				<label for="ribs">Distancia de las cuadernas (desde proa)</label>
				<input type="text" id="ribs" name="ribs" placeholder="5590, 4480, 3370, 2260, 1150"/>
				<span class="error" id="ribs-error"></span>
			</div>
			<div>
				<label for="rowlocks">Distancia primer agujero (desde cuaderna proa)</label>
				<input type="text" id="rowlocks" name="rowlocks" placeholder="660, 720, 680, 700"/>
				<span class="error" id="rowlocks-error"></span>
			</div>
			<div>
				<label for="rowlock-gap">Separación entre agujeros (mm)</label>
				<input type="number" id="rowlock-gap" name="rowlock-gap" placeholder="20"/>
				<span class="error" id="rowlock-gap-error"></span>
			</div>
			<div>
				<label for="ratio-sweet-spot">Rango de ratio correcto</label>
				<input type="text" id="ratio-sweet-spot" name="ratio-sweet-spot" placeholder="30, 35" />
			</div>
		</form>
	</div>
</div>
<link rel="stylesheet" href="./src/styles.css">
`;

customElements.define(
    component,
    class extends HTMLElement {
        SNIPPETS = {
            batel: [{ name: "Amilibia Proa Ancha", path: "amilibia_wide_bow.json" }],
            trainerilla: [],
            trainera: [],
        };

        /** @type {BoatConfig} */
        #boat = { ...DEFAULT_BOAT };
        #boatType = "Batel";

        /** @returns {BoatConfig} */
        get config() {
            return this.#boat;
        }

        /** @param {BoatConfig} boat */
        set config(boat) {
            this.#boat = { ...boat };
            this.#init();
        }

        /** @param {string} value */
        set boatType(value) {
            this.#clearErrors();
            this.#boatType = value;
            this.boatNameSpan.textContent = value;
            this.#initSnippets();
        }

        /** @returns {string} */
        get snippetPath() {
            return `./configs/${this.#boatType.toLowerCase()}/`;
        }

        constructor() {
            super();
            const root = this.attachShadow({ mode: "open" });
            root.append(template.content.cloneNode(true));
        }

        connectedCallback() {
            this.form = this.shadowRoot.querySelector("#boat-form");
            this.collapsibleContent = this.shadowRoot.querySelector("#collapsible-content");
            this.formHeader = this.shadowRoot.querySelector(".form-header");
            this.arrow = this.shadowRoot.querySelector(".arrow");
            this.boatNameSpan = this.shadowRoot.querySelector("#boat-name");
            this.snippetSelect = this.shadowRoot.querySelector("#snippets");

            this.lengthInput = this.shadowRoot.querySelector("#length");
            this.bowInput = this.shadowRoot.querySelector("#bow");
            this.sternInput = this.shadowRoot.querySelector("#stern");
            this.weightInput = this.shadowRoot.querySelector("#weight");
            this.ballastInput = this.shadowRoot.querySelector("#ballast");
            this.ballastPositionInput = this.shadowRoot.querySelector("#ballast-position");
            this.ribsInput = this.shadowRoot.querySelector("#ribs");
            this.rowlocksInput = this.shadowRoot.querySelector("#rowlocks");
            this.rowlockGapInput = this.shadowRoot.querySelector("#rowlock-gap");
            this.ratioSweetSpotInput = this.shadowRoot.querySelector("#ratio-sweet-spot");

            this.#init();

            this.form.addEventListener("change", () => this.#onChange());
            this.snippetSelect.addEventListener("input", (e) => this.#onChangeSnippet(e.target.value));

            this.formHeader.addEventListener("click", () => {
                if (
                    this.collapsibleContent.style.display &&
                    (this.collapsibleContent.style.display === "none" || this.collapsibleContent.style.display === "")
                ) {
                    this.collapsibleContent.style.display = "block";
                    this.arrow.style.transform = "rotate(180deg)";
                } else {
                    this.collapsibleContent.style.display = "none";
                    this.arrow.style.transform = "rotate(0deg)";
                }
            });
        }

        isValid() {
            var isValid = true;
            if (!this.#boat.weight || this.#boat.weight < 50 || this.#boat.weight > 300) {
                this.errors.weight.textContent = "El peso debe estar entre 50 y 300 kg";
                isValid = false;
            }
            if (!this.#boat.length || this.#boat.length < 6000 || this.#boat.length > 15000) {
                this.errors.length.textContent = "La distancia de la bancada debe estar entre 6000 y 15000 mm";
                isValid = false;
            }
            if (!this.#boat.rowlockGap || this.#boat.rowlockGap < 10 || this.#boat.rowlockGap > 100) {
                this.errors.rowlockGap.textContent = "La separación entre toletes debe estar entre 50 y 150 mm";
                isValid = false;
            }

            if (this.#boatType.toUpperCase() === "BATEL") {
                if (!this.#boat.ribs || this.#boat.ribs.length !== 5) {
                    this.errors.ribs.textContent = "Los bateles tienen 5 cuadernas";
                    isValid = false;
                }
                if (!this.#boat.rowlocks || this.#boat.rowlocks.length !== 4) {
                    this.errors.rowlocks.textContent = "Los bateles tienen 4 toletes";
                    isValid = false;
                }
            }
            if (this.#boatType.toUpperCase() === "TRAINERILLA") {
                if (!this.#boat.ribs || this.#boat.ribs.length !== 7) {
                    this.errors.ribs.textContent = "Las trainerillas tienen 7 cuadernas";
                    isValid = false;
                }
                if (!this.#boat.rowlocks || this.#boat.rowlocks.length !== 6) {
                    this.errors.rowlocks.textContent = "Las trainerillas tienen 6 toletes";
                    isValid = false;
                }
            }
            if (this.#boatType.toUpperCase() === "TRAINERA") {
                if (!this.#boat.ribs || this.#boat.ribs.length !== 8) {
                    this.errors.ribs.textContent = "Las traineras tienen 8 cuadernas";
                    isValid = false;
                }
                if (!this.#boat.rowlocks || this.#boat.rowlocks.length !== 7) {
                    this.errors.rowlocks.textContent = "Las traineras tienen 7 toletes";
                    isValid = false;
                }
            }

            this.formHeader.classList.toggle("error", !isValid);
            this.arrow.classList.toggle("error", !isValid);
            return isValid;
        }

        /** @param {boolean} [preserveSnippet] */
        #init(preserveSnippet = false) {
            this.lengthInput.value = this.#boat.length;
            this.bowInput.value = this.#boat.bowFloatingLine;
            this.sternInput.value = this.#boat.sternFloatingLine;
            this.weightInput.value = this.#boat.weight;
            this.ballastInput.value = this.#boat.ballast;
            this.ballastPositionInput.value = this.#boat.ballastPosition;
            this.ribsInput.value = this.#boat.ribs.join(", ");
            this.rowlocksInput.value = this.#boat.rowlocks.join(", ");
            this.rowlockGapInput.value = this.#boat.rowlockGap;
            this.ratioSweetSpotInput.value = this.#boat.sweetSpot.join(", ");

            this.errors = {
                length: this.shadowRoot.querySelector("#length-error"),
                weight: this.shadowRoot.querySelector("#weight-error"),
                ribs: this.shadowRoot.querySelector("#ribs-error"),
                rowlocks: this.shadowRoot.querySelector("#rowlocks-error"),
                rowlockGap: this.shadowRoot.querySelector("#rowlock-gap-error"),
            };

            if (!preserveSnippet) {
                this.collapsibleContent.style.display = "none";
                this.#initSnippets();
            }
        }

        #initSnippets() {
            this.snippetSelect.style.display = "block";

            if (this.SNIPPETS[this.#boatType.toLowerCase()].length === 0) {
                this.snippetSelect.style.display = "none";
                return;
            }

            const html = [`<option value="${-1}" selected disabled>Plantillas</option>`];
            this.SNIPPETS[this.#boatType.toLowerCase()].forEach((snippet, idx) => {
                html.push(`<option value="${idx}">${snippet.name}</option>`);
            });

            this.snippetSelect.innerHTML = html.join("");
        }

        #onChange() {
            this.#clearErrors();

            this.#boat.length = parseInt(this.lengthInput.value);
            this.#boat.bowFloatingLine = parseInt(this.bowInput.value);
            this.#boat.sternFloatingLine = parseInt(this.sternInput.value);
            this.#boat.weight = parseInt(this.weightInput.value);
            this.#boat.ballast = parseFloat(this.ballastInput.value);
            this.#boat.ballastPosition = parseInt(this.ballastPositionInput.value);
            this.#boat.ribs = this.ribsInput.value.split(",").map((num) => parseInt(num.trim()));
            this.#boat.rowlocks = this.rowlocksInput.value.split(",").map((num) => parseInt(num.trim()));
            this.#boat.rowlockGap = parseInt(this.rowlockGapInput.value);
            this.#boat.sweetSpot = this.ratioSweetSpotInput.value.split(",").map((num) => parseFloat(num.trim()));

            this.isValid();
        }

        /** @param {number} idx */
        async #onChangeSnippet(idx) {
            const path = this.snippetPath + this.SNIPPETS[this.#boatType.toLowerCase()][idx].path;
            const response = await fetch(path);
            const text = await response.text();

            this.#boat = JSON.parse(text);
            this.#init(true);

            app.onChangeSnippet(this.#boat);
        }

        #clearErrors() {
            Object.values(this.errors).forEach((error) => (error.textContent = ""));
            this.formHeader.classList.toggle("error", false);
            this.arrow.classList.toggle("error", false);
        }
    },
);
