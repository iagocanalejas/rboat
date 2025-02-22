import "./seat.js";

const component = "r-trainerilla";
const template = document.createElement("template");

template.innerHTML = `
<r-seat id="coxwain" position="COXWAIN"></r-seat>
<r-seat id="seat-1" position="1"></r-seat>
<r-seat id="seat-2" position="2"></r-seat>
<r-seat id="seat-3" position="3"></r-seat>
<r-seat id="seat-4" position="4"></r-seat>
<r-seat id="seat-5" position="5"></r-seat>
<r-seat id="seat-6" position="6"></r-seat>
`;

customElements.define(
	component,
	class extends HTMLElement {
		/** @param {Seat[]} values */
		set seats(values) {
			this.shadowRoot.querySelectorAll("r-seat").forEach((seat, idx) => (seat.seat = values[idx]));
		}

		constructor() {
			super();
			const root = this.attachShadow({ mode: "open" });
			root.append(template.content.cloneNode(true));
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
