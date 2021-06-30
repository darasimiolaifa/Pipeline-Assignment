import { Errors } from "../Exception/index.js";
import Constants from "./constants.js";

const { InvalidArgumentError } = Errors;

export default class DataValidator {

    constructor(data) {
        this.data = data;
        this.errors = [];
    }

    isEmpty = (data) => !data.length;

    validateCardNumber = () => {
        !(/^[0-9]{12,19}$/.test(this.data.cardNumber)) &&
            this.errors.push(Constants.CARD_NUMBER_ERROR_MESSAGE());
    }

    validateCVV = () => {
        !(/^[0-9]{3,4}$/.test(this.data.cvv2)) &&
            this.errors.push(Constants.CVV_ERROR_MESSAGE());
    }

    validatePhoneNumber = () => {
        !(/^(\+?234|0)([0-9]{10})$/.test(this.data.phoneNumber)) &&
            this.errors.push(Constants.PHONE_NUMBER_ERROR_MESSAGE());
    }

    validateMobile = () => {
        !(/^(\+?234|0)([0-9]{10})$/.test(this.data.mobile)) &&
            this.errors.push(Constants.MOBILE_ERROR_MESSAGE());
    }

    validateEmail = () => {
        !(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(this.data.email)) &&
            this.errors.push(Constants.EMAIL_ERROR_MESSAGE());
    }

    ValidateExpirationDate = () => {
        const expiration = new Date(this.data.expirationDate);
        const today = new Date;

        if(isNaN(expiration.getTime())) {
            this.errors.push(Constants.EXPIRATION_DATE_ERROR_MESSAGE());
        } else if(today > expiration) {
            this.errors.push(Constants.EXPIRATION_DATE_PASSED_ERROR_MESSAGE());
        }
    };

    validateRequiredFields = (requiredKeys) => {
        const receivedKeys = Object.keys(this.data)?.sort();
        
        if(!Array.isArray(receivedKeys)) throw new InvalidArgumentError(`Required values is not an array.`);
        if(!Array.isArray(requiredKeys)) throw new InvalidArgumentError(`Invalid data format.`);
        
        requiredKeys.sort();
    
        let receivedPointer = 0;
    
        const missingFields = [];
        
        for(let index = 0; index < requiredKeys.length; index++) {
            const requiredField = requiredKeys[index];
            const receivedField = receivedKeys[receivedPointer];
    
            if(requiredField !== receivedField) missingFields.push(requiredField);
            else if(this.isEmpty(this.data[requiredField])) {
                missingFields.push(requiredField);
                receivedPointer += 1
            } else receivedPointer += 1;
        }
    
        return missingFields;
    }
}