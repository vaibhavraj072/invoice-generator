document.getElementById("generatePDF").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Capture invoice section
    html2canvas(document.getElementById("invoice-output")).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 10, 180, 200);
        doc.save("invoice.pdf");
    });
});

// Add new item row
function addItem() {
    let table = document.getElementById("itemsBody");
    let row = table.insertRow();
    row.innerHTML = `
        <td><input type="text" class="desc"></td>
        <td><input type="number" class="qty" value="1"></td>
        <td><input type="number" class="price" value="0"></td>
        <td class="amount">₹0.00</td>
    `;
    updateInvoice();
}

// Update invoice preview
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updateInvoice);
});

function updateInvoice() {
    let output = document.getElementById("invoice-output");
    output.innerHTML = `
        <h2>${document.getElementById("companyName").value}</h2>
        <p>${document.getElementById("companyAddress").value}, ${document.getElementById("zipCode").value}</p>
        <p>${document.getElementById("phone").value}, ${document.getElementById("email").value}</p>
        
        <h3>Billed To</h3>
        <p>${document.getElementById("clientName").value}, ${document.getElementById("clientCompany").value}</p>
        <p>${document.getElementById("clientAddress").value}</p>

        <h3>Invoice No: ${document.getElementById("invoiceNo").value}</h3>
        <p>Date: ${document.getElementById("invoiceDate").value} | Due: ${document.getElementById("dueDate").value}</p>

        <table>
            <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr>
            ${Array.from(document.querySelectorAll("#itemsBody tr")).map(row => `
                <tr>
                    <td>${row.querySelector(".desc").value}</td>
                    <td>${row.querySelector(".qty").value}</td>
                    <td>${row.querySelector(".price").value}</td>
                    <td>${row.querySelector(".amount").textContent}</td>
                </tr>
            `).join("")}
        </table>
    `;
}
