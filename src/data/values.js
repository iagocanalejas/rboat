import "./types.js";

/** @type {BoatConfig} */
const DEFAULT_BOAT = {
    length: 7000,
    bowFloatingLine: 430,
    sternFloatingLine: 410,
    weight: 65,
    ballast: 0,
    ballastPosition: 0,
    ribs: [], // bow to stern
    rowlocks: [], // bow to stern
    rowlockGap: 20,
    sweetSpot: [],
};

/** @type {Seat} */
const DEFAULT_SEAT = {
    position: "",
    weight: 0,
    benchDistance: 0,
    rowlockHole: 0,
    side: "",
};

export { DEFAULT_BOAT, DEFAULT_SEAT };
