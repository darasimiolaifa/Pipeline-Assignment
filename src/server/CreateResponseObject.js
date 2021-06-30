class BuildXMLData {
    
    /**
     * Builds the server response in XML format
     * @param {Object} result
     * @param {boolean} isError
     * @returns {string} xml
     */
    static build(result, isError) {
        let stringifiedData = "";
        const response = result.data ?? result.error;

        if(Array.isArray(response)) {
            for(let key in response) {
                stringifiedData += `<error key="${key}">${response[key]}</error>`
            }
        } else {
            for(let key in response) {
                stringifiedData += `<${key}>${response[key]}</${key}>`
            }
        }


        const wrappedResponse = isError ?
            `<Data>${stringifiedData}</Data>`
            : `<Error>${stringifiedData}</Error>`

        const xml = `<Response>
                        <Status>${result.status}</Status>
                        ${wrappedResponse}
                    </Response>`
        return xml;
    }
}


export default class CreateResponseObject {

    constructor(response, acceptsContentType) {
        this.response = response;
        this.responseFormat = "";

        this.format(acceptsContentType);
        this.statusCode = 200;

        this.responseData = null;
    }

    
    /**
     * Sets the status code of the response object
     * @param {Number} statusCode
     * @returns {ThisParameterType<CreateResponseObject>} CreateResponseObject
     */
    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    }

    /**
     * Sets the format the response object
     * @param {string} acceptsContentType
     * @returns {ThisParameterType<CreateResponseObject>} CreateResponseObject
     */
    format(acceptsContentType) {
        this.responseFormat = acceptsContentType?.search('xml') > -1 ? 'xml' : 'json';
        
        return this;
    }

    /**
     * Sets the final response of the server using the set format
     * @param {Object | null} data
     * @param {Object | null} error
     * @returns {void} void
     */
    send(data, error = null) {
        const result = data ? { status: this.statusCode, data } : { status: this.statusCode, error }
        
        if(this.responseFormat === "xml") {
            return this.xml(result);
        }

        return this.json(result);
    }
    
    /**
     * Sets the final response of the server using the json format
     * @param {Object} result
     * @returns {void} void
     */
    json(result) {
        this.response.writeHead(this.statusCode, { 'Content-Type' : 'application/json'});
        result.status = result.status ?? this.statusCode;

        this.responseData = JSON.stringify(result)
    }
    
    /**
     * Sets the final response of the server using the xml format
     * @param {Object} result
     * @returns {void} void
     */
    xml(result) {
        const isError = !result.error;
        result.status = result.status ?? this.statusCode;

        this.response.writeHead(this.statusCode, { 'Content-Type' : 'application/xml'});
        this.responseData = BuildXMLData.build(result, isError);
    }
}