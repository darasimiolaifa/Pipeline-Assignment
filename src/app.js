import CardController from "./controllers/CardController.js";
import Authenticate from "./middleware/Authenticate.js";
import Validate from "./middleware/Validate.js";
import server from "./server/index.js";
import Status from "./Utils/responseCodes.js";

const app = server();

const PORT = process.env.PORT ?? 8080;

app.get('/', (request, response) => {
    response
        .status(Status.OK())
        .send({ message: "Welcome to the card validation API" });
});

app.post('/api/v1/card/validate',
    Authenticate.checkAPIKey,
    Validate.validateCreditCardInfo,
    CardController.checkCardValidityandIssuer
);


app.listen(PORT, () => {
    console.log(`We are live, on port ${PORT}`);
});