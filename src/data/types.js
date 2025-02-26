/**
 * @typedef {Object} BoatConfigElement
 * @property {BoatConfig} config
 * @property {string} boatType
 * @property {function():bool} isValid
 */

/**
 * @typedef {Object} RowersConfigElement
 * @property {Seat[]} config
 * @property {string} boatType
 * @property {function(number):void} changeSeats
 * @property {function():bool} isValid
 */

/**
 * @typedef {Object} ResultsElement
 * @property {BoatResult} result
 * @property {function():bool} isValid
 */

/**
 * @typedef {Object} SeatConfigElement
 * @property {Seat} config
 * @property {function():bool} isValid
 */

/**
 * @typedef {Object} BoatConfig
 * @property {number} length
 * @property {number} bowFloatingLine
 * @property {number} sternFloatingLine
 * @property {number} weight
 * @property {number} ballast
 * @property {number} ballastPosition
 * @property {number[]} ribs
 * @property {number[]} rowlocks
 * @property {number} rowlockGap
 * @property {number[]} sweetSpot
 */

/**
 * @typedef {Object} Seat
 * @property {string} position
 * @property {number} weight
 * @property {number} benchDistance
 * @property {number} rowlockHole
 * @property {string} side
 */

/**
 * @typedef {Object} BoatResult
 * @property {number} centerOfGravity
 * @property {number} ratio
 */
