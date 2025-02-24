import "./seat.js";

const component = "r-rowers-config";
const template = document.createElement("template");
template.innerHTML = "";

customElements.define(
    component,
    class extends HTMLElement {
        /** @type {SeatConfigElement[]} */
        seats;

        /** @returns {Seat[]} */
        get config() {
            return Array.from(this.seats).map((seat) => seat.config);
        }

        /** @param {Seat[]} values */
        set config(values) {
            this.changeSeats(values.length);
            this.seats.forEach((seat, idx) => (seat.config = values[idx]));
        }

        constructor() {
            super();
            const root = this.attachShadow({ mode: "open" });
            root.append(template.content.cloneNode(true));
        }

        connectedCallback() {
            this.#init(4);
        }

        changeSeats(numSeats) {
            this.#init(numSeats);
        }

        isValid() {
            var isValid = true;
            this.shadowRoot.querySelectorAll("r-seat").forEach((seat) => {
                if (!seat.isValid()) {
                    isValid = false;
                }
            });
            return isValid;
        }

        #init(numSeats) {
            const container = document.querySelector("r-rowers-config");
            container.classList.add("hidden");

            const html = [`<r-seat id=${"coxwain"} position=${"COXWAIN"}></r-seat>`];
            for (let i = 1; i < numSeats; i++) {
                html.push(`<r-seat id="seat-${i}" position="${i}"></r-seat>`);
            }

            this.shadowRoot.innerHTML = html.join("");
            // HACK: wait for the DOM to update before removing the hidden class
            setTimeout(() => container.classList.remove("hidden"), 100);

            this.seats = this.shadowRoot.querySelectorAll("r-seat");
        }
    },
);
