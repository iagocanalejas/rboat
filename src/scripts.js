import "./data/types.js";
import "./components/boat_config.js";
import "./components/batel.js";
import "./components/trainerilla.js";
import "./components/trainera.js";

import { DEFAULT_BOAT } from "./data/values.js";

class App {
	/** @type {BoatConfig} */
	#boat = { ...DEFAULT_BOAT };
	/** @type {Seat[]} */
	#seats = [];
	/** @type {BoatResult} */
	#result = undefined;

	/** @param {BoatResult} value */
	set result(value) {
		this.#result = value;
		if (!this.#result) return;

		document.querySelector("#ratio-result").textContent = this.#result.ratio.toFixed(2);
		document.querySelector("#gravity-center-result").textContent = this.#result.centerOfGravity.toFixed(2);
	}

	constructor() {
		this.boatConfig = document.querySelector("r-boat-config");

		this.boats = ["batel", "trainerilla", "trainera"];
		this.boatElements = this.boats.map((boat) => ({
			element: document.querySelector(`r-${boat}`),
			link: document.querySelector(`#link-${boat}`),
		}));

		document.querySelector("#calculate").addEventListener("click", () => this.#calculate());
		document.querySelector("#save").addEventListener("click", () => this.#save());
		document.querySelector("#input-upload").addEventListener("change", (e) => this.#upload(e));
		this.boatElements.forEach(({ link }) => link.addEventListener("click", (e) => this.#onNavItemClick(e, link)));
	}

	/** @param {BoatConfig} boat */
	onChange(boat) {
		console.log("Configuring boat...");
		this.#boat = boat;
	}

	/**
	 * @param {number} index
	 * @param {Seat} seat
	 */
	onChangeSeat(index, seat) {
		console.log(`Configuring seat ${index}...`);
		this.#seats[index] = seat;
	}

	#calculate() {
		if (!this.#isValid()) return;

		console.log("Calculating...");

		this.result = {
			ratio: this.#computeRatio(),
			centerOfGravity: this.#computeCenterOfGravity(),
		};
	}

	#save() {
		if (!this.#result) return;

		const data = {
			boat: this.#boat,
			seats: this.#seats,
			result: this.#result,
		};

		const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 4)], { type: "application/json" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = "boat.json";
		a.click();
		URL.revokeObjectURL(url);
	}

	/** @param {Event} event */
	async #upload(event) {
		console.log("Uploading file...");
		const file = event.target.files[0];
		if (!file) return;

		const text = await file.text();
		const data = JSON.parse(text);

		this.#boat = data.boat;
		this.#seats = data.seats;
		this.#result = data.result;

		document.querySelector("r-boat-config").boat = this.#boat;

		if (this.#seats.length === 5) {
			this.boatElements[0].link.click();
			this.boatElements[0].element.seats = this.#seats;
		} else if (this.#seats.length === 7) {
			this.boatElements[1].link.click();
			this.boatElements[1].element.seats = this.#seats;
		} else {
			this.boatElements[2].link.click();
			this.boatElements[2].element.seats = this.#seats;
		}
	}

	/**
	 * @param {MouseEvent} event
	 * @param {HTMLElement} clickedLink
	 */
	#onNavItemClick(event, clickedLink) {
		event.preventDefault();

		this.boatConfig.boatType = clickedLink.textContent;
		this.boatElements.forEach(({ link, element }) => {
			element.classList.toggle("hidden", link !== clickedLink);
			link.classList.toggle("active", link === clickedLink);
		});
	}

	/** @returns {bool} */
	#isValid() {
		var isValid = this.boatConfig.isValid();
		this.boatElements.forEach(({ element }) => {
			if (!element.classList.contains("hidden")) {
				const isElementValid = element.isValid();
				isValid = isValid && isElementValid;
			}
		});
		return isValid;
	}

	/** @returns {number} */
	#computeRatio() {
		const midpoint = this.#boat.length / 2;
		const ballastInfluence = this.#boat.ballast * (midpoint - this.#boat.ballastPosition);
		const computeInfluence = (sum, seat, idx) => sum + (midpoint - this.#weightPositionFromBow(idx)) * seat.weight;
		return (this.#seats.reduce(computeInfluence, 0) + ballastInfluence) / 1000;
	}

	/** @returns {number} */
	#computeCenterOfGravity() {
		const totalWeight =
			this.#seats.reduce((sum, seat) => sum + seat.weight, 0) + this.#boat.weight + this.#boat.ballast;

		const computeMoment = (sum, seat, idx) => sum + this.#weightPositionFromBow(idx) * seat.weight;
		const totalMoment = this.#seats.reduce(computeMoment, 0) + this.#boat.ballastPosition * this.#boat.ballast;

		return totalMoment / totalWeight;
	}

	/** @param {number} position
	 * @returns {number}
	 * */
	#weightPositionFromBow(position) {
		if (position === 0) {
			return this.#boat.ribs[position] + this.#seats[position].benchDistance;
		}
		const rowlockHole = this.#seats[position].rowlockHole * this.#boat.rowlockGap;
		const rowlockPosition = this.#boat.ribs[position] + this.#boat.rowlocks[position - 1] + rowlockHole;
		return rowlockPosition - this.#seats[position].benchDistance;
	}
}

const app = new App();
export { app };
