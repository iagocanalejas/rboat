import "./seat.js";

const component = "r-rowers-config";
const template = document.createElement("template");
template.innerHTML = "";

customElements.define(
	component,
	class extends HTMLElement {
		/** @param {number} value */
		set numSeats(value) {
			this.#init(value);
		}
		/** @param {Seat[]} values */
		set seats(values) {
			this.numSeats = values.length - 1;
			this.shadowRoot.querySelectorAll("r-seat").forEach((seat, idx) => (seat.seat = values[idx]));
		}

		constructor() {
			super();
			const root = this.attachShadow({ mode: "open" });
			root.append(template.content.cloneNode(true));
		}

		#init(numSeats) {
			const container = document.querySelector("r-rowers-config");
			container.classList.add("hidden");

			const html = [`<r-seat id=${"coxwain"} position=${"COXWAIN"}></r-seat>`];
			for (let i = 1; i <= numSeats; i++) {
				html.push(`<r-seat id="seat-${i}" position="${i}"></r-seat>`);
			}

			this.shadowRoot.innerHTML = html.join("");
			// HACK: wait for the DOM to update before removing the hidden class
			setTimeout(() => container.classList.remove("hidden"), 100);
		}

		/** @returns {bool} */
		isValid() {
			var isValid = true;
			this.shadowRoot.querySelectorAll("r-seat").forEach((seat) => {
				if (!seat.isValid()) {
					isValid = false;
				}
			});
			return isValid;
		}
	},
);
