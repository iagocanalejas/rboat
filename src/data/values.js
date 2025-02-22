import "./types.js";

/** @type {BoatConfig} */
const DEFAULT_BOAT = {
	length: 7000,
	bowFloatingLine: 430,
	sternFloatingLine: 410,
	weight: 63,
	ballast: 7,
	ballastPosition: 4480,
	ribs: [5590, 4480, 3370, 2260, 1150], // bow to stern
	rowlocks: [660, 720, 680, 700], // bow to stern
	rowlockGap: 20,
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
