export default class ClientError extends Error {
    cause: Error
    constructor(msg:string, cause?:Error) {
        super(msg)
        Object.setPrototypeOf(this, ClientError.prototype)
        this.cause = cause
    }
}