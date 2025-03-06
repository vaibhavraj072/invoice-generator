function uploadLogo() {
    const input = document.getElementById('logoUpload');
    const logo = document.getElementById('companyLogo');

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            logo.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function uploadQR() {
    const input = document.getElementById('qrUpload');
    const qr = document.getElementById('paymentQR');

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            qr.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function addRow() {
    const table = document.getElementById('invoiceItems');
    const row = table.insertRow();

    row.innerHTML = `
        <td contenteditable="true">New Item</td>
        <td contenteditable="true" oninput="calculateTotal()">1</td>
        <td contenteditable="true" oninput="calculateTotal()">0.00</td>
        <td class="amount">0.00</td>
    `;
}

function calculateTotal() {
    let subtotal = 0;
    document.querySelectorAll("#invoiceItems tr").forEach(row => {
        const qty = parseFloat(row.cells[1].innerText) || 0;
        const price = parseFloat(row.cells[2].innerText) || 0;
        const amount = qty * price;
        row.cells[3].innerText = amount.toFixed(2);
        subtotal += amount;
    });

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("totalDue").innerText = subtotal.toFixed(2);
}

function downloadPDF() {
    window.print();
}
