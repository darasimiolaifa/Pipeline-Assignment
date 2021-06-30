export default class Constants {

    static NEXT_FUNCTION_RETURN_VALUE = () => 'NEXT_FUNCTION_RETURN_VALUE';

    static CARD_NUMBER_ERROR_MESSAGE = () => 'Card number must be a string of numbers between 12 and 19';

    static CVV_ERROR_MESSAGE = () => 'CVV2 must be 3 or 4 digits';

    static PHONE_NUMBER_ERROR_MESSAGE = () => 
        'Phone number must start with either +234, 234, or 0, and must be between 11 and 14 digits long';

    static MOBILE_ERROR_MESSAGE = () => 
        'Mobile must start with either +234, 234, or 0, and must be between 11 and 14 digits long';

    static EMAIL_ERROR_MESSAGE = () => 'Email is invalid';

    static EXPIRATION_DATE_ERROR_MESSAGE = () => 'Expiration date is invalid';

    static EXPIRATION_DATE_PASSED_ERROR_MESSAGE = () => 'Card has expired.';

    static MISSING_FIELD_ERROR_MESSAGE = (field) => `${field} is required`;
}