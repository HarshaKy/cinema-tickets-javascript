import TicketService from './src/pairtest/TicketService.js';
import TicketTypeRequest from './src/pairtest/lib/TicketTypeRequest.js';

const ticketService = new TicketService();

const accountId = 1; // Replace with your desired account ID
const ticketRequests = [
  new TicketTypeRequest('ADULT', 2),
  new TicketTypeRequest('CHILD', 3),
  new TicketTypeRequest('INFANT', 2)
]

try {
  ticketService.purchaseTickets(accountId, ...ticketRequests);
  console.log('Tickets purchased successfully');
} catch (error) {
  console.error('Error purchasing tickets:', error.message);
}