import ScrapingError from "./ScrapingError";

export default class WeatherDataNotFoundError extends ScrapingError {

    constructor(msg, cause? : Error) {
        super(msg, cause)
        Object.setPrototypeOf(this, WeatherDataNotFoundError.prototype)
    }
}