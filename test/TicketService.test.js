import TicketService from "../src/pairtest/TicketService";
import InvalidInputException from "../src/pairtest/lib/InvalidInputException";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService";

describe('TicketService', () => {
    let ticketService;

    beforeEach(() => {
        ticketService = new TicketService();
    });

    test('should throw an error if accountId is invalid', () => {
        expect(() => {
            ticketService.purchaseTickets('invalid', new TicketTypeRequest('ADULT', 1));
        }).toThrow(InvalidInputException);
    })

    test('should throw an error if ticketTypeRequests is invalid', () => {
        expect(() => {
            ticketService.purchaseTickets(1, 'invalid');
        }).toThrow(InvalidInputException);
    })

    test('should throw an error if ticketTypeRequests is empty', () => {
        expect(() => {
            ticketService.purchaseTickets(1, []);
        }).toThrow(InvalidInputException);
    });

    test('should throw an error if noOfTickets is invalid', () => {
        expect(() => {
            ticketService.purchaseTickets(1, new TicketTypeRequest('ADULT', -1));
        }).toThrow(InvalidInputException);
    });

    test('should throw an error if no tickets are requested', () => {
        expect(() => {
            ticketService.purchaseTickets(1);
        }).toThrow(InvalidInputException);
    });

    test('should throw an error if more than 25 tickets are requested', () => {
        const requests = Array(26).fill(new TicketTypeRequest('ADULT', 1));
        expect(() => {
            ticketService.purchaseTickets(1, ...requests);
        }).toThrow(InvalidPurchaseException);
    });

    test('should throw an error if no adult ticket is requested', () => {
        expect(() => {
            ticketService.purchaseTickets(1, new TicketTypeRequest('CHILD', 1));
        }).toThrow(InvalidPurchaseException);
    });

    test('should throw an error if more than 2 infant tickets are requested per adult', () => {
        expect(() => {
            ticketService.purchaseTickets(1, new TicketTypeRequest('ADULT', 2), new TicketTypeRequest('INFANT', 5));
        }).toThrow(InvalidPurchaseException);
    })

    test('should calculate the correct amount and reserve the correct number of seats', () => {
        const paymentServiceMock = jest.spyOn(TicketPaymentService.prototype, 'makePayment');
        const reservationServiceMock = jest.spyOn(SeatReservationService.prototype, 'reserveSeat');

        ticketService.purchaseTickets(1, new TicketTypeRequest('ADULT', 2), new TicketTypeRequest('CHILD', 3), new TicketTypeRequest('INFANT', 1));

        expect(paymentServiceMock).toHaveBeenCalledWith(1, 95); // 2 * 25 + 3 * 15
        expect(reservationServiceMock).toHaveBeenCalledWith(1, 5); // 2 + 3

        paymentServiceMock.mockRestore();
        reservationServiceMock.mockRestore();
    });
});   