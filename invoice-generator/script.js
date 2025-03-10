
// Function to calculate total
function calculateTotal() {
    let subtotal = 0;
    let rows = document.querySelectorAll("#invoiceBody tr");

    // Calculate subtotal based on item rows
    rows.forEach(row => {
        let qty = parseFloat(row.querySelector(".qty").textContent) || 0;
        let unitPrice = parseFloat(row.querySelector(".unitPrice").textContent) || 0;
        let amount = qty * unitPrice;
        row.querySelector(".amount").textContent = amount.toFixed(2);
        subtotal += amount;
    });

    // Fetch discount value as percentage
    let discountPercent = parseFloat(document.getElementById("discount").textContent) || 0;
    let discountAmount = (subtotal * discountPercent) / 100; // Convert % to actual value

    // Round off calculation
    let totalAfterDiscount = subtotal - discountAmount;
    let roundOff = Math.round(totalAfterDiscount) - totalAfterDiscount;

    // Final total
    let totalDue = totalAfterDiscount + roundOff;

    // Update values in UI
    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("roundOff").textContent = roundOff.toFixed(2);
    document.getElementById("totalDue").textContent = totalDue.toFixed(2);

    // Convert total due to words
    document.getElementById("totalInWords").textContent = numberToWords(totalDue);
}
function addItem() {
    let tbody = document.getElementById("invoiceBody");
    let newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td contenteditable="true">New Item</td>
        <td contenteditable="true" class="qty" oninput="calculateTotal()">1</td>
        <td contenteditable="true" class="unitPrice" oninput="calculateTotal()">0.00</td>
        <td class="amount">0.00</td>
        <td><button onclick="removeItem(this)">Remove</button></td>
    `;

    tbody.appendChild(newRow);
    calculateTotal(); // Recalculate total after adding a row
}

function removeItem(button) {
    let row = button.closest("tr");
    row.remove();
    calculateTotal(); // Recalculate total after removing a row
}

// Convert number to words (basic function)
function numberToWords(num) {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const c = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

    if (num === 0) return "Zero";
    if (num < 10) return a[num];
    if (num < 20) return c[num - 10];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
    if (num < 1000) return a[Math.floor(num / 100)] + " Hundred " + (num % 100 ? numberToWords(num % 100) : "");
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand " + (num % 1000 ? numberToWords(num % 1000) : "");
    
    return num; // For larger numbers
}

// Ensure total calculation runs on page load
document.addEventListener("DOMContentLoaded", calculateTotal);


// Setting Stamp
function updateStamp() {
    let status = document.getElementById("paymentStatus").value;
    let stamp = document.getElementById("paymentStamp");

    // Set the correct image based on selection
    if (status === "fully") {
        stamp.src = "images/fully-paid.png"; // Replace with actual image URL
        stamp.style.display = "block";
    } else if (status === "partial") {
        stamp.src = "images/partial-paid.png"; // Replace with actual image URL
        stamp.style.display = "block";
    } else {
        stamp.src = "images/unpaid.png"; // Replace with actual image URL
        stamp.style.display = "block";
    }
}


//  Setting Invoice Date and NUmber
document.addEventListener("DOMContentLoaded", function () {
    const invoiceDate = document.getElementById("invoiceDate");
    const invoiceNumber = document.getElementById("invoiceNumber");
    const dueDate = document.getElementById("dueDate"); // Get Due Date span

    // Automatically set today's date only if the user hasn't changed it
    if (invoiceDate.innerText.trim() === "dd/mm/yyyy") {
        setInvoiceDate();
    }

    invoiceDate.addEventListener("input", updateInvoiceNumber);
    invoiceDate.addEventListener("input", updateDueDate);

    function setInvoiceDate() {
        let today = new Date();
        let formattedDate = formatDate(today);

        invoiceDate.innerText = formattedDate; // Set the invoice date
        updateInvoiceNumber();
        updateDueDate();
    }

    function updateInvoiceNumber() {
        let dateValue = invoiceDate.innerText.trim();
        let dateParts = dateValue.split("/");

        if (dateParts.length === 3 && dateParts[2].length === 4) {
            let year = dateParts[2].slice(-2); // Last two digits of the year
            let month = dateParts[1].padStart(2, "0"); // Ensure two-digit month

            let currentNumber = invoiceNumber.innerText.trim();
            let suffix = currentNumber.includes("-") ? currentNumber.split("-")[1] : "1012"; // Default suffix

            invoiceNumber.innerText = `#${year}${month}-${suffix}`;
        }
    }

    function updateDueDate() {
        let dateValue = invoiceDate.innerText.trim();
        let dateParts = dateValue.split("/");

        if (dateParts.length === 3 && dateParts[2].length === 4) {
            let selectedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`); // Convert to JS Date
            selectedDate.setDate(selectedDate.getDate() + 2); // Add 2 days

            dueDate.innerText = formatDate(selectedDate); // Set Due Date
        }
    }

    function formatDate(date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        let yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }
});



// ADD ITEM ROW
function addRow() {
    let table = document.getElementById('invoiceItems');
    let row = document.createElement('tr');
    row.innerHTML = `
        <td contenteditable="true">New Item</td>
        <td contenteditable="true" oninput="calculateTotal()">1</td>
        <td contenteditable="true" oninput="calculateTotal()">0.00</td>
        <td class="amount">0.00</td>
        <td><button onclick="removeRow(this)" style: ""padding: 2px 6px; font-size: 12px;" >X</button></td>
    `;
    table.appendChild(row);
    calculateTotal();
}

// REMOVE ITEM ROW
function removeRow(button) {
    const row = button.closest('tr');
    row.remove();
    calculateTotal();
}

    // Sexy Discount Animation
    const discountElement = document.getElementById("discount");
    if (discount > 0) {
        discountElement.style.transition = "background-color 0.5s ease";
        discountElement.style.backgroundColor = "#ffcccb";
        setTimeout(() => discountElement.style.backgroundColor = "transparent", 1000);
    }

// DOWNLOAD PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById("invoice");

    if (!element) {
        console.error("Invoice element not found!");
        return;
    }

    html2canvas(element, {
        scale: 3,  // Improves clarity
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const imgData = canvas.toDataURL("image/jpeg", 0.7);  // Compress image
        
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const pageWidth = 210;  // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const margin = 10; // Set margin (left & right)

        // Calculate image size while keeping aspect ratio
        const imgWidth = pageWidth - 2 * margin; // Adjust width for margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let yPosition = margin; // Start image after top margin
        if (imgHeight > pageHeight - 2 * margin) {
            // If the image is longer than the page, split it into multiple pages
            let position = yPosition;
            while (position < imgHeight) {
                pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
                position += pageHeight - 2 * margin;
                if (position < imgHeight) pdf.addPage();
            }
        } else {
            pdf.addImage(imgData, "JPEG", margin, yPosition, imgWidth, imgHeight);
        }

        pdf.save("Invoice.pdf");
    });
}


window.onload = () => calculateTotal();