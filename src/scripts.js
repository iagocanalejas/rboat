import "./data/types.js";
import "./components/boat.js";
import "./components/rowers.js";
import "./components/results.js";
import { computeRatio, computeCenterOfGravity } from "./data/compute.js";

class App {
    /** @type {BoatConfigElement} */
    boatElement;
    /** @type {RowersConfigElement} */
    rowersElement;
    /** @type {ResultsElement} */
    resultsElement;
    /** @type {HTMLElement[]} */
    boatLinks;

    constructor() {
        this.boatElement = document.querySelector("r-boat-config");
        this.rowersElement = document.querySelector("r-rowers-config");
        this.resultsElement = document.querySelector("r-results");

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

    /** @param {BoatConfig} value */
    onChangeSnippet(value) {
        this.resultsElement.sweetSpot = value.sweetSpot;
    }

    calculate() {
        if (!this.#isValid()) return;
        console.log("Calculating...");

        this.resultsElement.result = {
            ratio: computeRatio(this.boatElement.config, this.rowersElement.config),
            centerOfGravity: computeCenterOfGravity(this.boatElement.config, this.rowersElement.config),
        };
    }

    save() {
        if (!this.resultsElement.result) return;
        console.log("Saving file...");

        const data = {
            boat: this.boatElement.config,
            seats: this.rowersElement.config,
            result: this.resultsElement.result,
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

        this.boatElement.config = data.boat;
        this.rowersElement.config = data.seats;
        this.resultsElement.sweetSpot = data.boat.sweetSpot;
        this.resultsElement.result = data.result;

        var linkConfig;
        if (this.rowersElement.config.length === 5) {
            linkConfig = this.boatLinks[0];
        } else if (this.rowersElement.config.length === 7) {
            linkConfig = this.boatLinks[1];
        } else {
            linkConfig = this.boatLinks[2];
        }
        this.boatElement.boatType = linkConfig.textContent;
        this.boatLinks.forEach((link) => link.classList.toggle("active", link === linkConfig));
    }

    /**
     * @param {MouseEvent} event
     * @param {HTMLElement} clickedLink
     * @param {number} numSeats
     */
    #onNavItemClick(event, clickedLink, numSeats) {
        event.preventDefault();

        this.boatElement.boatType = clickedLink.textContent;
        this.rowersElement.changeSeats(numSeats + 1);

        this.boatLinks.forEach((link) => link.classList.toggle("active", link === clickedLink));
    }

    /** @returns {bool} */
    #isValid() {
        var isValid = this.boatElement.isValid();
        var seatsValid = this.rowersElement.isValid();
        return isValid && seatsValid;
    }
}

const app = new App();
export { app };
