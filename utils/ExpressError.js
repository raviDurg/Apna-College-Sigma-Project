class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;  // Fix the typo here
        this.message = message;
    }
}

module.exports = ExpressError;
