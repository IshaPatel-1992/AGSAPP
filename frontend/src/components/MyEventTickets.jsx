import { useEffect, useState } from "react";
import { api } from "../api";
import { API_BASE_URL } from "../config";

export default function MyEventTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const base = API_BASE_URL.endsWith("/")
    ? API_BASE_URL
    : `${API_BASE_URL}/`;

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

  const handleDownloadTicket = async (ticket) => {
    if (!ticket?.booking_id) {
      alert("Booking ID not found.");
      return;
    }

    try {
      setDownloadingId(ticket.booking_id);

      // If PDF path is not saved yet, generate it first
      if (!ticket.ticket_pdf_path) {
        await fetch(
          `${base}generateEventTicketPdf.php?booking_id=${ticket.booking_id}`
        );

        // Refresh ticket list so ticket_pdf_path updates on frontend too
        await loadTickets();
      }

      // Download existing or newly generated PDF
      window.open(
        `${base}downloadEventTicket.php?booking_id=${ticket.booking_id}`,
        "_blank"
      );
    } catch (err) {
      console.error("Download ticket error:", err);
      alert("Unable to download ticket.");
    } finally {
      setDownloadingId(null);
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

          <button
            type="button"
            onClick={() => handleDownloadTicket(ticket)}
            disabled={downloadingId === ticket.booking_id}
            className="mt-3 inline-block rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {downloadingId === ticket.booking_id
              ? "Preparing Ticket..."
              : "Download Ticket"}
          </button>
        </div>
      ))}
    </div>
  );
}