import CardService from "../services/cardService.js";
import Status from "../Utils/responseCodes.js";
export default class CardController {
    /**
     * Applies Luhn's algorithm on a card number and compute it's validity and issuer.
     * @param {Object} request HTTP Request object
     * @param {Object} response HTTP Response object
     * @returns {Object} response
     */
    static checkCardValidityandIssuer({ body: { cardNumber } }, response) {
        const card = new CardService(cardNumber);

        card.applyLuhnsAlgorithm();
        card.extractCardIssuer();

        let valid = card.passesLuhnsAlgorithm;
        let cardIssuer = card.issuer;

        return response
            .status(Status.OK())
            .send({ valid, cardIssuer });
    }
}