export default class URLNotFoundError extends Error{
    constructor(message = "") {
        super(message = "URL not found.");
        this.name = "URLNotFoundError";
    }
}