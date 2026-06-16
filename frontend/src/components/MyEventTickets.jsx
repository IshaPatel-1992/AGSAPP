import { useEffect, useState } from "react";
import { API_BASE_URL, apiGet } from "../config";

export default function MyEventTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const buildPdfUrl = (bookingId) => {
    const base = API_BASE_URL.endsWith("/")
      ? API_BASE_URL
      : `${API_BASE_URL}/`;

    return `${base}generateEventTicketPdf.php?booking_id=${bookingId}`;
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const member = JSON.parse(localStorage.getItem("member"));

      if (!member?.id || !member?.email) {
        setTickets([]);
        return;
      }

      const result = await api.post("getMyEventTickets.php", {
        member_id: member.id,
        email: member.email,
      });

      if (result?.success && Array.isArray(result.data)) {
        setTickets(result.data);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error("Ticket load error:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading tickets...</p>;

  if (!tickets.length) {
    return (
      <div className="rounded-xl bg-gray-50 p-5">
        No event tickets found.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tickets.map((ticket) => (
        <div key={ticket.booking_id} className="rounded-2xl border bg-white p-5">
          <h3 className="text-lg font-bold">{ticket.event_title}</h3>

          <p>Booking #: {ticket.booking_number}</p>
          <p>Tickets: {ticket.ticket_count}</p>
          <p>Amount Paid: ${ticket.total_amount}</p>

         <a
  href={`${API_BASE_URL}generateEventTicketPdf.php?booking_id=${ticket.booking_id}`}
  target="_blank"
  rel="noreferrer"
  className="mt-3 inline-block rounded-lg bg-green-600 px-4 py-2 text-white"
>
  Download Ticket
</a>
        </div>
      ))}
    </div>
  );
}