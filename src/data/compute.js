import "./types.js";

/**
 * @nosideeffects
 * @param {BoatConfig} boat
 * @param {Seat[]} seats
 * @returns {number}
 * */
function computeRatio(boat, seats) {
    const midpoint = boat.length / 2;
    const ballastInfluence = boat.ballast * (midpoint - boat.ballastPosition) || 0;
    const computeInfluence = (sum, seat, idx) =>
        sum + (midpoint - weightPositionFromBow(boat, seat, idx)) * seat.weight;
    return (seats.reduce(computeInfluence, 0) + ballastInfluence) / 1000;
}

/**
 * @nosideeffects
 * @param {BoatConfig} boat
 * @param {Seat[]} seats
 * @returns {number}
 * */
function computeCenterOfGravity(boat, seats) {
    const totalWeight = seats.reduce((sum, seat) => sum + seat.weight, 0) + boat.weight + boat.ballast;

    const computeMoment = (sum, seat, idx) => sum + weightPositionFromBow(boat, seat, idx) * seat.weight;
    const totalMoment = seats.reduce(computeMoment, 0) + boat.ballastPosition * boat.ballast;

    return totalMoment / totalWeight;
}

/**
 * @nosideeffects
 * @param {BoatConfig} boat
 * @param {Seat} seat
 * @param {number} position
 * @returns {number}
 * */
function weightPositionFromBow(boat, seat, position) {
    if (position === 0) {
        return boat.ribs[position] + seat.benchDistance;
    }
    const rowlockHole = seat.rowlockHole * boat.rowlockGap;
    const rowlockPosition = boat.ribs[position] + boat.rowlocks[position - 1] + rowlockHole;
    return rowlockPosition - seat.benchDistance;
}

export { computeRatio, computeCenterOfGravity };
