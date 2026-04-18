import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }, // link to payment
    qrCode: { type: String, required: true }, // QR code string / URL / image
    status: { type: String, enum: ["valid", "used", "cancelled"], default: "valid" },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
