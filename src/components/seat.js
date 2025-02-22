import { app } from "../scripts.js";
import { DEFAULT_SEAT } from "../data/values.js";

const component = "r-seat";
const template = document.createElement("template");

template.innerHTML = `
<div class="collapsible">
	<button class="form-header">
		<span id="name"></span>
		<span class="arrow">▼</span>
	</button>
	<form>
		<div class="input-form">
			<label for="weight">Peso</label>
			<input type="number" id="weight" />
			<span class="error" id="weight-error"></span>
		</div>
		<div id="rowlock-div" class="input-form">
			<label for="rowlock-hole">Posición Tolete</label>
			<input type="number" id="rowlock-hole" />
		</div>
		<div class="input-form">
			<label for="bench-distance">Distancia Bancada</label>
			<input type="number" id="bench-distance" />
			<span class="error" id="bench-distance-error"></span>
		</div>
		<div id="side-div" class="input-form">
			<label for="side">Costado</label>
			<select id="side">
				<option value="STARBOARD">Estribor</option>
				<option value="PORT">Babor</option>
			</select>
		</div>
	</form>
</div>
<link rel="stylesheet" href="./src/styles.css">
`;

customElements.define(
	component,
	class extends HTMLElement {
		/** @type {Seat} */
		#seat = DEFAULT_SEAT;

		/** @returns {number} */
		get index() {
			return parseInt(this.getAttribute("id").replace("seat-", "")) || 0;
		}

		/** @returns {string} */
		get name() {
			const position = this.getAttribute("position");
			if (position === "COXWAIN") {
				return "Timonel";
			}
			if (this.#seat.side) {
				return `Bancada ${position} - ${this.#seat.side === "STARBOARD" ? "Estribor" : "Babor"}`;
			}
			return `Bancada ${position}`;
		}

		/** @param {Seat} value */
		set seat(value) {
			this.#seat = value;
			this.#init();
		}

		constructor() {
			super();
			const root = this.attachShadow({ mode: "open" });
			root.append(template.content.cloneNode(true));
		}

		connectedCallback() {
			this.form = this.shadowRoot.querySelector("form");
			this.arrow = this.shadowRoot.querySelector(".arrow");
			this.nameSpan = this.shadowRoot.querySelector("#name");

			this.weightInput = this.shadowRoot.querySelector("#weight");
			this.benchDistanceInput = this.shadowRoot.querySelector("#bench-distance");
			this.rowlockHoleInput = this.shadowRoot.querySelector("#rowlock-hole");
			this.sideInput = this.shadowRoot.querySelector("#side");

			this.#init();

			this.form.addEventListener("change", () => this.onChange());

			this.shadowRoot.querySelector(".form-header").addEventListener("click", () => {
				if (this.form.style.display && (this.form.style.display === "none" || this.form.style.display === "")) {
					this.form.style.display = "block";
					this.arrow.style.transform = "rotate(180deg)";
				} else {
					this.form.style.display = "none";
					this.arrow.style.transform = "rotate(0deg)";
				}
			});
		}

		#init() {
			this.nameSpan.textContent = this.name;

			this.weightInput.value = this.#seat.weight;
			this.rowlockHoleInput.value = this.#seat.rowlockHole;
			this.benchDistanceInput.value = this.#seat.benchDistance;
			this.sideInput.value = this.#seat.side;

			this.form.style.display = "none";

			this.errors = {
				weight: this.shadowRoot.querySelector("#weight-error"),
				benchDistance: this.shadowRoot.querySelector("#bench-distance-error"),
			};
		}

		onChange() {
			this.#clearErrors();

			this.#seat.weight = parseInt(this.weightInput.value);
			this.#seat.rowlockHole = parseInt(this.rowlockHoleInput.value);
			this.#seat.benchDistance = parseInt(this.benchDistanceInput.value);
			this.#seat.side = this.sideInput.value;

			this.nameSpan.textContent = this.name;

			if (this.isValid()) {
				app.onChangeSeat(this.index, this.#seat);
			}
		}

		#clearErrors() {
			Object.values(this.errors).forEach((error) => (error.textContent = ""));
		}

		/** @returns {bool} */
		isValid() {
			var isValid = true;
			if (!this.#seat.weight || this.#seat.weight < 0 || this.#seat.weight > 200) {
				this.errors.weight.textContent = "El peso debe estar entre 0 y 200 kg";
				isValid = false;
			}
			if (!this.#seat.benchDistance || this.#seat.benchDistance < 500 || this.#seat.benchDistance > 900) {
				this.errors.benchDistance.textContent = "La distancia de la bancada debe estar entre 500 y 900 mm";
				isValid = false;
			}
			this.shadowRoot.querySelector(".form-header").classList.toggle("error", !isValid);
			this.arrow.classList.toggle("error", !isValid);
			return isValid;
		}
	},
);
