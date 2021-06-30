# Pipeline-Assignment
A credit-card validation API built as a solution to the TalentQL Pipeline program technical assessment.
<br />
<br />

> How the API was Implemented.
<br />
The API was built using barebones NodeJs without installing any framework or package, although it borrows from some of the semantics of popular NodeJs frameworks, especially ExpressJs.<br /><br />
Concepts like Routing, Middleare, and Response methods were implemented to make the API development easier and more organized.<br /><br />

## To clone

```sh
git clone https://github.com/darasimiolaifa/Pipeline-Assignment.git
```

## Setup
* Check the .env.example file in root directory and create a .env file copy of it.
* Fill the empty properties with the appropriate values
* Ensure that your request is sent with the API key in your .env file. The header key should be `X-API-Key` or `x-api-key`
## To start

```sh
npm start
```

## To test

* Request
```json
    {
        "cardNumber": "6771335956445856",
        "expirationDate": "2021-11-31",
        "email": "darasimiolaifa@gmail.com",
        "cvv2": "123",
        "phoneNumber": "+2348133034408",
        "mobile": "+2348133034408"
    }
```

* Response (json)
```json
{
    "status": 200,
    "data": {
        "valid": true,
        "cardIssuer": "Maestro"
    }
}
```

* Response (xml)

```xml
    <Response>
        <Status>200</Status>
        <Data>
            <valid>true</valid>
            <cardIssuer>Maestro</cardIssuer>
        </Data>
    </Response>
```

## License

MIT
