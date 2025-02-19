const express = require("express");
const multer = require("multer");
const Invoice = require("../models/Invoice");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create", upload.single("logo"), async (req, res) => {
  try {
    const { billedBy, billedTo, items, tax, discountPercent, totalAmount } = req.body;
    const invoice = new Invoice({
      billedBy: JSON.parse(billedBy),
      billedTo: JSON.parse(billedTo),
      items: JSON.parse(items),
      tax: JSON.parse(tax),
      discountPercent,
      totalAmount,
      "billedBy.logo": req.file ? req.file.path : "",
    });

    await invoice.save();
    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF
router.get("/pdf/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const doc = new PDFDocument();
    const filePath = `uploads/invoice-${invoice._id}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));
    doc.pipe(res);

    doc.fontSize(18).text("Invoice", { align: "center" });
    doc.fontSize(12).text(`Billed By: ${invoice.billedBy.companyName}`);
    doc.text(`Billed To: ${invoice.billedTo.name}`);
    invoice.items.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.description} - ${item.quantity} x ${item.rate} = ${item.amount}`);
    });
    doc.text(`Total: ${invoice.totalAmount}`);
    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
