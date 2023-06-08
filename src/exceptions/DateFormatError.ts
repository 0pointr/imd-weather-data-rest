import ScrapingError from "./ScrapingError";

export default class DateFormatError extends ScrapingError {
    constructor(msg:string, cause?:Error) {
        super(msg, cause)
        Object.setPrototypeOf(this, DateFormatError.prototype)
    }
}