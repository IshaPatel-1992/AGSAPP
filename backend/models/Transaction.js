import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // What this payment is for
    type: {
      type: String,
      enum: ["membership", "event", "donation"],
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: function() { return this.type === "event"; }
    },

    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: function() { return this.type === "event"; }
    },

    membershipPlan: {
      type: String, // e.g. "Family Annual", "Student"
      required: function() { return this.type === "membership"; }
    },

    donationNote: {
      type: String, // optional note from donor
      required: function() { return this.type === "donation"; }
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "CAD",
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "manual"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    transactionId: {
      type: String,
    },

    receiptUrl: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
