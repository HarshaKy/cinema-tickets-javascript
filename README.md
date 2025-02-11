# Cinema Tickets - JavaScript Solution

## Overview
My implementation of the [TicketService](https://github.com/HarshaKy/cinema-tickets-javascript/blob/master/src/pairtest/TicketService.js) in JavaScript as per the [rules and objectives](https://github.com/HarshaKy/cinema-tickets-javascript/tree/master/src#readme).

The implementation includes:
- Core functionality for calculating total ticket price and number of seats.
- Unit tests covering edge cases and validating calculations.
- Clear instructions for running, testing, and validating the solution.

---

## Requirements
To run the solution and tests, ensure you have the following:

- **Node**: Node.js runtime environment
- **Dependencies**:
  - `jest` for running tests
  - `babel-jest` for transpiling ES6 code

Install dependencies using:
```bash
npm i
```

---

## How to Run the Solution

### Step 1. Update inputs in [index.js](https://github.com/HarshaKy/cinema-tickets-javascript/blob/master/index.js)

The file must define the `ticketRequests` and `accountId` variables as shown below:

```javascript
const accountId = 1; // Replace with your desired account ID
const ticketRequests = [
  new TicketTypeRequest('ADULT', 2),
  new TicketTypeRequest('CHILD', 3),
  new TicketTypeRequest('INFANT', 2)
];
```

You can add more ticket type requests or remove as needed. Each pair of `accountId` and `ticketRequests` can be run with multiple calls to `TicketService.purchaseTickets()`.

### Step 2. Run the solution

Run the solution using:
```bash
npm start
```

A successful run produces the following output:
```bash
D:\code\cinema-tickets-javascript>npm start

> cinema-tickets-javascript@1.0.1 start
> node index.js

Tickets purchased successfully
```

An error message is displayed if the purchase fails or if the input is invalid.

---

## Testing the solution
To run tests, use the following command:
```bash
npm test
```

The test cases can be found in [`TicketService.test.js`](https://github.com/HarshaKy/cinema-tickets-javascript/blob/master/test/TicketService.test.js)

Running the command produces the following output:
```bash
D:\code\cinema-tickets-javascript>npm test

> cinema-tickets-javascript@1.0.1 test
> jest

 PASS  test/TicketService.test.js
  TicketService
    √ should throw an error if accountId is invalid (13 ms)                                                                                               
    √ should throw an error if ticketTypeRequests is invalid (2 ms)
    √ should throw an error if ticketTypeRequests is empty (4 ms)                                                                                         
    √ should throw an error if noOfTickets is invalid                                                                                                     
    √ should throw an error if no tickets are requested                                                                                                   
    √ should throw an error if more than 25 tickets are requested                                                                                         
    √ should throw an error if no adult ticket is requested                                                                                               
    √ should throw an error if more than 2 infant tickets are requested per adult (1 ms)                                                                  
    √ should calculate the correct amount and reserve the correct number of seats (2 ms)                                                                  
                                                                                                                                                          
Test Suites: 1 passed, 1 total                                                                                                                            
Tests:       9 passed, 9 total                                                                                                                            
Snapshots:   0 total
Time:        0.529 s, estimated 1 s
Ran all test suites.
```
---
## Author
Developed as part of a coding assessment. Please reach out for any queries or feedback.