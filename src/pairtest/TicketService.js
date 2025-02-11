import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import InvalidInputException from './lib/InvalidInputException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

/**
 * @typedef {import('./lib/TicketTypeRequest.js').default} TicketTypeRequest
 */
export default class TicketService {

    /**
     * Input validation for purchaseTickets
     * 
     * @param {number} accountId 
     * @param {TicketTypeRequest[]} ticketTypeRequests 
     * @throws {InvalidInputException} if input is invalid
     */
    #validateInput = (accountId, ticketTypeRequests) => {
        // contains additional validation
        // ensuring accountId is a positive integer and ticketTypeRequests is an array 

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
            this.#validateRequest(ticketTypeRequest)
        }
    }

    /**
     * Validate ticket type request
     * 
     * @param {TicketTypeRequest} ticketTypeRequest 
     * @throws {InvalidInputException} if input is invalid
     */
    #validateRequest(ticketTypeRequest) {
        // additional validation for ticketTypeRequest
        // ensures noOfTickets is not below 0
        if (!(ticketTypeRequest instanceof TicketTypeRequest)) {
            throw new InvalidInputException('ticketTypeRequests must be an array of TicketTypeRequest objects');
        }

        const noOfTickets = ticketTypeRequest.getNoOfTickets()
        const ticketType = ticketTypeRequest.getTicketType()

        if (!Number.isInteger(noOfTickets) || noOfTickets < 0) {
            throw new InvalidInputException('noOfTickets must be >= 0');
        }

        if (!['ADULT', 'CHILD', 'INFANT'].includes(ticketType)) {
            throw new InvalidInputException('ticketType must be ADULT, CHILD, or INFANT');
        }
    }

    /**
     * Calculate total amount to pay and total seats to allocate
     * 
     * @param {TicketTypeRequest[]} ticketTypeRequests 
     * @throws {InvalidPurchaseException} if purchase is invalid
     * @returns {number[]} [totalAmountToPay, totalSeatsToAllocate]
     */
    #getAmountandSeats(ticketTypeRequests) {
        let totalTickets = 0
        let totalAmountToPay = 0
        let totalSeatsToAllocate = 0
        let adultTickets = 0
        let infantTickets = 0
        let hasAdultTicket = false

        // loop through each request and calculate total amount and seats
        ticketTypeRequests.forEach(request => {
            const noOfTickets = request.getNoOfTickets()
            totalTickets += noOfTickets

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

        // limit 2 infants per adult
        // this can be changed based on requirements
        // since there was nothing specified about the limit, 2 was chosen
        if (infantTickets / adultTickets > 2) {
            throw new InvalidPurchaseException('Maximum of 2 infants per adult allowed')
        }

        return [totalAmountToPay, totalSeatsToAllocate]
    }

    /**
     * Purchase tickets for the given account ID
     * 
     * @param {number} accountId - account ID for the purchase
     * @param  {...TicketTypeRequest} ticketTypeRequests - array of TicketTypeRequest objects
     * @throws {InvalidInputException || InvalidPurchaseException} if input or purchase is invalid
     */
    purchaseTickets(accountId, ...ticketTypeRequests) {
        this.#validateInput(accountId, ticketTypeRequests);

        const [totalAmount, totalSeats] = this.#getAmountandSeats(ticketTypeRequests);

        const paymentService = new TicketPaymentService()
        paymentService.makePayment(accountId, totalAmount)

        const reservationService = new SeatReservationService()
        reservationService.reserveSeat(accountId, totalSeats)
    }
}
