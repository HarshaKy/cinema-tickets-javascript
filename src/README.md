# Ticket Service Implementation

## Business Rules

- There are three types of tickets: **Infant, Child, and Adult**.
- Ticket prices are based on the type of ticket (see table below).
- The ticket purchaser declares how many and what type of tickets they want to buy.
- Multiple tickets can be purchased at any given time.
- A **maximum of 25 tickets** can be purchased at a time.
- **Infants do not pay for a ticket and are not allocated a seat.** They will be sitting on an Adult's lap.
- **Child and Infant tickets cannot be purchased without purchasing an Adult ticket.**

### Ticket Pricing

| Ticket Type | Price |
|-------------|-------|
| INFANT      | £0  |
| CHILD       | £15 |
| ADULT       | £25 |

- There is an existing `TicketPaymentService` responsible for taking payments.
- There is an existing `SeatReservationService` responsible for reserving seats.

## Constraints

- The `TicketService` interface **CANNOT** be modified.
- The code in the `thirdparty.*` packages **CANNOT** be modified.
- The `TicketTypeRequest` **MUST** be an immutable object.

## Assumptions

You can assume:

- All accounts with an **ID greater than zero** are valid and have sufficient funds to pay for any number of tickets.
- The `TicketPaymentService` implementation is an external provider with **no defects**. You do not need to worry about how the actual payment happens.
- The payment will **always go through** once a payment request has been made to the `TicketPaymentService`.
- The `SeatReservationService` implementation is an external provider with **no defects**. You do not need to worry about how the seat reservation algorithm works.
- The seat will **always be reserved** once a reservation request has been made to the `SeatReservationService`.

## Your Task

Provide a working implementation of a `TicketService` that:

1. **Follows the given business rules, constraints, and assumptions.**
2. **Calculates the correct total amount** for the requested tickets and makes a payment request to `TicketPaymentService`.
3. **Determines the correct number of seats to reserve** and makes a reservation request to `SeatReservationService`.
4. **Rejects any invalid ticket purchase requests**. It is up to you to identify what constitutes an invalid purchase request.

## Expected Deliverables

- A fully functional implementation of `TicketService`.
- Code that is clean, maintainable, and follows best practices.
- Proper error handling for invalid requests.
- Unit tests to validate the functionality.