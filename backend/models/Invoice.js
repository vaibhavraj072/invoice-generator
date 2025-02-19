const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    bankDetails: { type: String, required: true },
    billedTo: { type: String, required: true },
    items: [
        {
            itemName: String,
            rate: Number,
            quantity: Number,
            total: Number
        }
    ],
    igst: Number,
    discount: Number
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
