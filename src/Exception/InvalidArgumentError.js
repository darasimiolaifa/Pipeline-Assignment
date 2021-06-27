export default class InvalidArgumentError extends Error{
    constructor(message = "") {
        super(message);
        this.name = "InvalidArgumentError";
    }
}