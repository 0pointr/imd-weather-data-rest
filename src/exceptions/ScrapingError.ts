export default class ScrapingError extends Error {
    cause : Error
    constructor(msg : string, cause : Error = null) {
        super(msg)
        Object.setPrototypeOf(this, ScrapingError.prototype)
        this.cause = cause
    }
}