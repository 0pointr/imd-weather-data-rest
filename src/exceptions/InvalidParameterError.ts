import ClientError from "./ClientError"

export default class InvalidParameterError extends ClientError {
    constructor(msg:string, cause?:Error) {
        super(msg, cause)
        Object.setPrototypeOf(this, InvalidParameterError.prototype)
    }
}