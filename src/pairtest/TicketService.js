import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import InvalidInputException from './lib/InvalidInputException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
export default class TicketService {

    #validateInput = (accountId, ticketTypeRequests) => {
        if (!Number.isInteger(accountId) || accountId < 1) {
            throw new InvalidInputException('accountId must be a positive integer');
        }

        if (!Array.isArray(ticketTypeRequests)) {
            throw new InvalidInputException('ticketTypeRequests must be an array');
        }

        if (ticketTypeRequests.length === 0) {
            throw new InvalidInputException('ticketTypeRequests must not be empty');
        }

        for (const ticketTypeRequest of ticketTypeRequests) {
            if (!(ticketTypeRequest instanceof TicketTypeRequest)) {
                throw new InvalidInputException('ticketTypeRequests must be an array of TicketTypeRequest objects');
            }
        }
    }

    #validateRequest(ticketTypeRequest) {
        const noOfTickets = ticketTypeRequest.getNoOfTickets()
        const ticketType = ticketTypeRequest.getTicketType()

        if (!Number.isInteger(noOfTickets) || noOfTickets < 0) {
            throw new InvalidInputException('noOfTickets must be >= 0');
        }

        if (!['ADULT', 'CHILD', 'INFANT'].includes(ticketType)) {
            throw new InvalidInputException('ticketType must be ADULT, CHILD, or INFANT');
        }
    }

    #getAmountandSeats(ticketTypeRequests) {
        let totalTickets = 0
        let totalAmountToPay = 0
        let totalSeatsToAllocate = 0
        let adultTickets = 0
        let infantTickets = 0
        let hasAdultTicket = false

        ticketTypeRequests.forEach(request => {
            const noOfTickets = request.getNoOfTickets()
            totalTickets += noOfTickets

            this.#validateRequest(request)
            
            switch (request.getTicketType()) {
                case 'ADULT':
                    hasAdultTicket = true
                    totalAmountToPay += noOfTickets * 25
                    totalSeatsToAllocate += noOfTickets
                    adultTickets += noOfTickets
                    break

                case 'CHILD':
                    totalAmountToPay += noOfTickets * 15
                    totalSeatsToAllocate += noOfTickets
                    break

                case 'INFANT':
                    infantTickets += noOfTickets
                    break

                default:
                    throw new InvalidPurchaseException('Invalid ticket type')
            }
        });

        if (!hasAdultTicket) {
            throw new InvalidPurchaseException('At least one adult ticket is required')
        }

        if (totalTickets > 25) {
            throw new InvalidPurchaseException('Maximum of 25 tickets can be purchased')
        }

        if (infantTickets / adultTickets > 2) {
            throw new InvalidPurchaseException('Maximum of 2 infants per adult allowed')
        }

        return [totalAmountToPay, totalSeatsToAllocate]
    }

    purchaseTickets(accountId, ...ticketTypeRequests) {
        this.#validateInput(accountId, ticketTypeRequests);

        const [totalAmount, totalSeats] = this.#getAmountandSeats(ticketTypeRequests);

        const paymentService = new TicketPaymentService()
        paymentService.makePayment(accountId, totalAmount)

        const reservationService = new SeatReservationService()
        reservationService.reserveSeat(accountId, totalSeats)
    }
}
