import CreateResponseObject from "./CreateResponseObject.js";
import { Errors } from "../Exception/index.js";
import STATUS from "../Utils/responseCodes.js";
import Constants from "../Utils/constants.js"

const { URLNotFoundError } = Errors;

export default class ServerSetup {

    /**
     * Creates the listen function for the server app
     * @param {Object} server
     * @returns {Function} ListenFunction
     */
    static returnListenFunction = (server) => (port, callback) => server.listen(port, callback);
    
    /**
     * Parses data in request and add it to the body property
     * @param {Object} body
     * @param {string} contentType
     * @returns {Object} data
     */
    static parseRequestData(body, contentType) {
        let data;
    
        if(contentType === "application/json") {
            data = body.length > 0 ? JSON.parse(body) : body;
        } else if(contentType === "application/x-www-form-urlencoded") {
            data = {};
            const formEntries = body.split('&');
    
            for(let pair of formEntries) {
                const [key, value] = pair.split('=');
                data[key] = decodeURIComponent(value);
            }
        }
    
        return data;
    }

    /**
     * Processes request and sends response to the client
     * @param {Object} request
     * @param {Object} newResponseObject
     * @param {Object} routes
     * @returns void
     */
    static processRequest = (request, newResponseObject, routes) => {
        let status;
        
        try {
            // trim url of forward slashes on both ends
            const urlPathname = request.url.replace(/^\/+|\/+$/g, "");

            const method = request.method;
            const controllerFunctions = routes[method][urlPathname];

            // method:url match not found
            if(!controllerFunctions) {
                status = STATUS.NOT_FOUND();
                throw new URLNotFoundError;
            }

            if(controllerFunctions.length === 1) {
                controllerFunctions[0](request, newResponseObject);
                return newResponseObject.response.end(newResponseObject.responseData);
            } else {
                // if middleware exixts, run them one after another
                for(let counter = 0; counter < controllerFunctions.length; counter++) {
                    controllerFunctions[counter](request, newResponseObject, Constants.NEXT_FUNCTION_RETURN_VALUE);

                    if(newResponseObject.responseData) {
                        return newResponseObject.response.end(newResponseObject.responseData);
                    }
                }
            }

        } catch(e) {
            status = status ?? STATUS.INTERNAL_SERVER_ERROR();
            newResponseObject.status(status).send({ error: e.message });

            return newResponseObject.response.end(newResponseObject.responseData);
        }
    }
    
    /**
     * Creates the request response handler
     * @param {Object} routes
     * @returns {Function} Handler
     */
    static returnRequestHandler = (routes) => async (request, response) => {
    
        // extend the response object to provide useful add-on methods
        const acceptsContentType = request.headers['accept'];
        const newResponseObject = new CreateResponseObject(response, acceptsContentType);
    
        let body = "";

        if(['POST', 'PUT', 'PATCH'].includes(request.method)) {

            request.on('data', (chunk) => {
                body += chunk;
            });
        
            request.on('end', () => {
                request.body = ServerSetup.parseRequestData(body, request.headers['content-type']);
                return ServerSetup.processRequest(request, newResponseObject, routes);
            });
        } else {
            request.body = {};
            return ServerSetup.processRequest(request, newResponseObject, routes);
        }
    
    }
}
