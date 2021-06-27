export default class CardService {
    constructor(cardNumber) {
        this.issuer = "Unknown";
        this.passesLuhnsAlgorithm = false;
        this.cardNumber = cardNumber;

        this.patterns = {
            "American Express": /^3[47]\d{13}$/,
            "Dankort": /^5019\d{12}$/,
            "Diners Club": /^3(0[0-5]|[68]\d)\d{11,16}$/,
            "Discover": /^6(011(0[0-9]|[2-4]\d|74|7[7-9]|8[6-9]|9[0-9])|4[4-9]\d{3}|5\d{4})\d{10}$/,
            "Elo": /^(4[035]|5[0]|6[235])(6[7263]|9[90]|1[2416]|7[736]|8[9]|0[04579]|5[0])([0-9])([0-9])\d{10}$/,
            "Forbrugsforeningen": /^600722\d{10}$/,
            "JCB": /^35\d{14}$/,
            "Mada": /^(4(0(0861|1757|6996|7(197|395)|9201)|1(2565|0685|7633|9593)|2(281(7|8|9)|8(331|67(1|2|3)))|3(1361|2328|4107|9954)|4(0(533|647|795)|5564|6(393|404|672))|5(5(036|708)|7865|7997|8456)|6(2220|854(0|1|2|3))|8(301(0|1|2)|4783|609(4|5|6)|931(7|8|9))|93428)|5(0(4300|6968|8160)|13213|2(0058|1076|4(130|514)|9(415|741))|3(0(060|906)|1(095|196)|2013|5(825|989)|6023|7767|9931)|4(3(085|357)|9760)|5(4180|7606|8848)|8(5265|8(8(4(5|6|7|8|9)|5(0|1))|98(2|3))|9(005|206)))|6(0(4906|5141)|36120)|9682(0(1|2|3|4|5|6|7|8|9)|1(0|1)))\d{10}$/,
            "Maestro": /^(?:5[06789]\d\d|(?!6011[0234])(?!60117[4789])(?!60118[6789])(?!60119)(?!64[456789])(?!65)6\d{3})\d{8,15}$/,
            "Mastercard": /^(5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)\d{12}$/,
            "Mir": /^220[0-4]\d{12}$/,
            "Troy": /^9792\d{12}$/,
            "UATP": /^1\d{14}$/,
            "UnionPay": /^62[0-5]\d{13,16}$/,
            "T-Union": /^31[0-9]\d{17}$/,
            "Visa": /^4\d{12}(\d{3}|\d{6})?$/
        }
    }

    /**
     * Applies the Luhn's algorithm on the card instance
     * @returns void
     */
    applyLuhnsAlgorithm() {

        const cardNumber = this.cardNumber;

        let sumOfDigits = 0;
        let isEvenPosition = false;
    
        for (let index = cardNumber.length - 1; index >= 0; index--) {
            let currentDigit = Number(cardNumber[index]);
    
            // if digit is in even position, multiply by 2
            if (isEvenPosition) {
                currentDigit *= 2;
            }
    
            sumOfDigits += Math.floor(currentDigit / 10); // add the digit in the tens position
            sumOfDigits += currentDigit % 10; // add the digit in the units position
    
            isEvenPosition = !isEvenPosition; // flip the even position checker
        }
    
        this.passesLuhnsAlgorithm = sumOfDigits % 10 === 0;

        return;
    }

    /**
     * Compute the issuer of a card using the first 6 digits of its number
     * @returns void
     */
    extractCardIssuer() {
        
        for(let key in this.patterns) {
            if(this.patterns[key].test(this.cardNumber)) {
                this.issuer = key;
                break;
            }
        }

        return;
    }
}