import Status from "../Utils/responseCodes.js";


export default class Authenticate {

    /**
     * Checks the request headers for a valid API Key
     * @param {Object} request HTTP Request object
     * @param {Object} response HTTP Response object
     * @param {Function} next Invokes the next middleware
     * @returns {void} void
     */
    static checkAPIKey(request, response, next) {
        const apiKey = request.headers['X-API-Key'] ?? request.headers['x-api-key'];

        if(!apiKey) return response
            .status(Status.UNAUTHORIZED())
            .send(null, { message: 'You need an API key to access this service.'});
        
        else if(apiKey !== process.env.API_KEY) return response
            .status(Status.UNAUTHORIZED())
            .send(null, { message: 'Invalid API Key.'});
        
        return next();
    }
}