import { Errors } from "../Exception/index.js";
import Status from "../Utils/responseCodes.js";
import Constants from "../Utils/constants.js";
import DataValidator from "../Utils/DataValidator.js";

const { InvalidArgumentError } = Errors;

export default class Validate {

    /**
     * Removes whitespace from the string globally
     * @param {string} data
     * @returns {string} data
     */
    static removeWhiteSpace(data) {
        for(let key in data) {
            const value = data[key]
            data[key] = value.replace(/\s+/g, '');
        }

        return data;
    }

    /**
     * Validates the different properties of a credit card
     * @param {Object} request HTTP Request object
     * @param {Object} response HTTP Response object
     * @param {Function} next Invokes the next middleware
     * @throws InvalidArgumentError
     * @returns {void} void
     */
    static validateCreditCardInfo (request, response, next) {

        const expectedFields = ['cardNumber', 'email', 'phoneNumber', 'cvv2', 'expirationDate', 'mobile'];

        const { body } = request;
        
        request.body = Validate.removeWhiteSpace(body);
        
        const validator = new DataValidator(request.body);
    
        let errors = [];
    
        try {
            const missingFields = validator.validateRequiredFields(expectedFields);
        
            if(missingFields.length > 0) {
                missingFields.forEach(field => errors.push(Constants.MISSING_FIELD_ERROR_MESSAGE(field)));
                return response.status(Status.BAD_REQUEST()).send(null, errors);
            }
            
            validator.validateCardNumber();
            validator.validateCVV();
            validator.validatePhoneNumber();
            validator.validateMobile();
            validator.validateEmail();
            validator.ValidateExpirationDate();

            errors = validator.errors;
        
            if(errors.length > 0) {
                return response.status(Status.BAD_REQUEST()).send(null, errors);
            }
        
            return next();
        } catch(e) {
            if(e instanceof InvalidArgumentError) {
                return response.status(Status.BAD_REQUEST()).send(null, [e.message]);
            } else {
                return response.status(Status.INTERNAL_SERVER_ERROR()).send(null, [e.message]);
            }
        }
    }
}