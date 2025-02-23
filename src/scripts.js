import "./data/types.js";
import "./components/boat.js";
import "./components/rowers.js";
import "./components/results.js";
import { computeRatio, computeCenterOfGravity } from "./data/compute.js";

class App {
    /** @type {BoatConfigElement} */
    boat;
    /** @type {RowersConfigElement} */
    seats;
    /** @type {ResultsElement} */
    results;
    /** @type {HTMLElement[]} */
    boatLinks;

    constructor() {
        this.boat = document.querySelector("r-boat-config");
        this.seats = document.querySelector("r-rowers-config");
        this.results = document.querySelector("r-results");

        document.querySelector("#input-upload").addEventListener("change", (e) => this.#upload(e));

        this.boatLinks = [
            document.querySelector("#link-batel"),
            document.querySelector("#link-trainerilla"),
            document.querySelector("#link-trainera"),
        ];
        this.boatLinks.forEach((link) =>
            link.addEventListener("click", (e) => this.#onNavItemClick(e, link, parseInt(link.getAttribute("seats")))),
        );
    }

    calculate() {
        if (!this.#isValid()) return;
        console.log("Calculating...");

        this.results.result = {
            ratio: computeRatio(this.boat.config, this.seats.config),
            centerOfGravity: computeCenterOfGravity(this.boat.config, this.seats.config),
        };
    }

    save() {
        if (!this.results.result) return;
        console.log("Saving file...");

        const data = {
            boat: this.boat.config,
            seats: this.seats.config,
            result: this.results.result,
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

        this.boat.config = data.boat;
        this.seats.config = data.seats;
        this.results.result = data.result;

        var linkConfig;
        if (this.seats.config.length === 5) {
            linkConfig = this.boatLinks[0];
        } else if (this.seats.config.length === 7) {
            linkConfig = this.boatLinks[1];
        } else {
            linkConfig = this.boatLinks[2];
        }
        this.boat.boatType = linkConfig.textContent;
        this.boatLinks.forEach((link) => link.classList.toggle("active", link === linkConfig));
    }

    /**
     * @param {MouseEvent} event
     * @param {HTMLElement} clickedLink
     * @param {number} numSeats
     */
    #onNavItemClick(event, clickedLink, numSeats) {
        event.preventDefault();

        this.boat.boatType = clickedLink.textContent;
        this.seats.changeSeats(numSeats + 1);

        this.boatLinks.forEach((link) => link.classList.toggle("active", link === clickedLink));
    }

    /** @returns {bool} */
    #isValid() {
        var isValid = this.boat.isValid();
        var seatsValid = this.seats.isValid();
        return isValid && seatsValid;
    }
}

const app = new App();
export { app };
