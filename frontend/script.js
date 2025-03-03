// Load QR Code library from CDN
document.addEventListener('DOMContentLoaded', function() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.async = true;
    document.head.appendChild(script);
    
    // Initialize the app once the script is loaded
    script.onload = initApp;
});

function initApp() {
    // DOM elements
    const invoiceForm = document.getElementById('invoiceForm');
    const addItemBtn = document.getElementById('addItemBtn');
    const generateBtn = document.getElementById('generateBtn');
    const backToFormBtn = document.getElementById('backToFormBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const formContainer = document.querySelector('.form-container');
    const invoicePreview = document.getElementById('invoicePreview');
    const itemsContainer = document.getElementById('itemsContainer');
    
    // Add event listeners
    addItemBtn.addEventListener('click', addItemRow);
    generateBtn.addEventListener('click', generateInvoice);
    backToFormBtn.addEventListener('click', backToForm);
    downloadPdfBtn.addEventListener('click', downloadPdf);
    invoiceForm.addEventListener('input', calculateAmounts);
    
    // Set default dates
    setDefaultDates();
    
    // Generate random invoice number
    document.getElementById('invoiceNumber').value = generateInvoiceNumber();
    
    // Initialize calculations
    calculateAmounts();
    
    // Add first item row
    updateItemRow(1);
}

// Set today as invoice date and add 30 days for due date
function setDefaultDates() {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 30);
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    document.getElementById('invoiceDate').value = formatDate(today);
    document.getElementById('dueDate').value = formatDate(dueDate);
}

// Generate a random invoice number
function generateInvoiceNumber() {
    return '#' + Math.floor(10000 + Math.random() * 90000);
}

// Add a new item row
function addItemRow() {
    const itemRows = document.querySelectorAll('.item-row');
    const newRowNumber = itemRows.length + 1;
    
    const newRow = document.createElement('div');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <div class="form-group">
            <label for="description${newRowNumber}">Description</label>
            <input type="text" id="description${newRowNumber}" name="description[]" required>
        </div>
        <div class="form-group">
            <label for="quantity${newRowNumber}">Quantity</label>
            <input type="number" id="quantity${newRowNumber}" name="quantity[]" value="1" min="1" required>
        </div>
        <div class="form-group">
            <label for="unitPrice${newRowNumber}">Unit Price (₹)</label>
            <input type="number" id="unitPrice${newRowNumber}" name="unitPrice[]" value="0" min="0" step="0.01" required>
        </div>
        <div class="form-group amount-group">
            <label for="amount${newRowNumber}">Amount (₹)</label>
            <input type="number" id="amount${newRowNumber}" name="amount[]" value="0" readonly>
        </div>
    `;
    
    itemsContainer.appendChild(newRow);
    updateItemRow(newRowNumber);
}

// Update item row calculations
function updateItemRow(rowNumber) {
    const quantityInput = document.getElementById(`quantity${rowNumber}`);
    const unitPriceInput = document.getElementById(`unitPrice${rowNumber}`);
    const amountInput = document.getElementById(`amount${rowNumber}`);
    
    const calculateRowAmount = () => {
        const quantity = parseFloat(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        amountInput.value = (quantity * unitPrice).toFixed(3);
        calculateAmounts();
    };
    
    quantityInput.addEventListener('input', calculateRowAmount);
    unitPriceInput.addEventListener('input', calculateRowAmount);
}

// Calculate all amounts
function calculateAmounts() {
    // Get all amounts and sum them
    const amountInputs = document.querySelectorAll('input[name="amount[]"]');
    let subtotal = 0;
    
    amountInputs.forEach(input => {
        subtotal += parseFloat(input.value) || 0;
    });
    
    // Calculate tax and total
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    
    const taxAmount = subtotal * (taxRate / 100);
    const totalDue = subtotal + taxAmount - discount;
}

// Generate invoice preview
function generateInvoice() {
    // Validate form
    if (!invoiceForm.checkValidity()) {
        alert('Please fill out all required fields.');
        return;
    }
    
    // Hide form and show preview
    formContainer.style.display = 'none';
    invoicePreview.classList.remove('hidden');
    
    // Update preview with form data
    updateCompanyInfo();
    updateClientInfo();
    updateInvoiceDetails();
    updateItems();
    updateTotals();
    updatePaymentInfo();
    
    // Generate QR code for UPI
    generateQRCode();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Update company information in preview
function updateCompanyInfo() {
    document.getElementById('preview-companyName').textContent = document.getElementById('companyName').value;
    document.getElementById('preview-companyAddress').textContent = document.getElementById('companyAddress').value;
    document.getElementById('preview-companyZip').textContent = document.getElementById('companyZip').value;
    document.getElementById('preview-companyPhone').textContent = document.getElementById('companyPhone').value;
    document.getElementById('preview-companyEmail').textContent = document.getElementById('companyEmail').value;
    
    // Handle logo
    const logoInput = document.getElementById('companyLogo');
    const logoPreview = document.getElementById('preview-logo');
    
    if (logoInput.files && logoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            logoPreview.innerHTML = `<img src="${e.target.result}" alt="Company Logo" style="max-width: 100%; max-height: 100%;">`;
        };
        reader.readAsDataURL(logoInput.files[0]);
    } else {
        logoPreview.textContent = 'LOGOS GOES HERE';
    }
}

// Update client information in preview
function updateClientInfo() {
    document.getElementById('preview-clientName').textContent = document.getElementById('clientName').value;
    document.getElementById('preview-clientCompany').textContent = document.getElementById('clientCompany').value;
    document.getElementById('preview-clientAddress').textContent = document.getElementById('clientAddress').value;
    document.getElementById('preview-clientCity').textContent = document.getElementById('clientCity').value;
    document.getElementById('preview-clientZip').textContent = document.getElementById('clientZip').value;
}

// Update invoice details in preview
function updateInvoiceDetails() {
    document.getElementById('preview-invoiceNumber').textContent = document.getElementById('invoiceNumber').value;
    
    // Format dates for display
    const formatDate = (inputId) => {
        const input = document.getElementById(inputId);
        if (!input.value) return '';
        
        const date = new Date(input.value);
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };
    
    document.getElementById('preview-invoiceDate').textContent = formatDate('invoiceDate');
    document.getElementById('preview-dueDate').textContent = formatDate('dueDate');
    document.getElementById('preview-terms').textContent = document.getElementById('terms').value;
}

// Update items in preview
function updateItems() {
    const itemsPreview = document.getElementById('preview-items');
    itemsPreview.innerHTML = '';
    
    // Get all item rows
    const descriptionInputs = document.querySelectorAll('input[name="description[]"]');
    const quantityInputs = document.querySelectorAll('input[name="quantity[]"]');
    const unitPriceInputs = document.querySelectorAll('input[name="unitPrice[]"]');
    const amountInputs = document.querySelectorAll('input[name="amount[]"]');
    
    // Create table rows for each item
    for (let i = 0; i < descriptionInputs.length; i++) {
        const description = descriptionInputs[i].value;
        const quantity = quantityInputs[i].value;
        const unitPrice = parseFloat(unitPriceInputs[i].value || 0).toFixed(3);
        const amount = parseFloat(amountInputs[i].value || 0).toFixed(3);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${description}</td>
            <td>${quantity}</td>
            <td>₹${unitPrice}</td>
            <td>₹${amount}</td>
        `;
        
        itemsPreview.appendChild(row);
    }
}

// Update totals in preview
function updateTotals() {
    // Calculate subtotal
    const amountInputs = document.querySelectorAll('input[name="amount[]"]');
    let subtotal = 0;
    
    amountInputs.forEach(input => {
        subtotal += parseFloat(input.value) || 0;
    });
    
    // Calculate tax and total
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    
    const taxAmount = subtotal * (taxRate / 100);
    const totalDue = subtotal + taxAmount - discount;
    
    // Update preview
    document.getElementById('preview-subtotal').textContent = `₹${subtotal.toFixed(3)}`;
    document.getElementById('preview-tax').textContent = `₹${taxAmount.toFixed(3)}`;
    document.getElementById('preview-discount').textContent = `₹${discount.toFixed(3)}`;
    document.getElementById('preview-totalDue').textContent = `₹${totalDue.toFixed(3)}`;
}

// Update payment information in preview
function updatePaymentInfo() {
    document.getElementById('preview-upiId').textContent = `UPI ID: ${document.getElementById('upiId').value || 'N/A'}`;
    document.getElementById('preview-bankName').textContent = document.getElementById('bankName').value || 'N/A';
    document.getElementById('preview-accountNumber').textContent = document.getElementById('accountNumber').value || 'N/A';
    document.getElementById('preview-ifscCode').textContent = document.getElementById('ifscCode').value || 'N/A';
}

// Generate QR code for UPI payment
function generateQRCode() {
    const upiId = document.getElementById('upiId').value;
    const qrcodeContainer = document.getElementById('qrcode');
    
    // Clear previous QR code
    qrcodeContainer.innerHTML = '';
    
    if (upiId && typeof QRCode !== 'undefined') {
        new QRCode(qrcodeContainer, {
            text: `upi://pay?pa=${upiId}`,
            width: 128,
            height: 128,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } else {
        qrcodeContainer.textContent = 'QR Code';
    }
}

// Back to form view
function backToForm() {
    formContainer.style.display = 'block';
    invoicePreview.classList.add('hidden');
}

// Download invoice as PDF
function downloadPdf() {
    const { jsPDF } = window.jspdf;
    
    // Get invoice template element
    const element = document.getElementById('invoiceTemplate');
    const companyName = document.getElementById('companyName').value || 'Invoice';
    
    // Use html2canvas to capture the invoice template
    html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add new pages if the content overflows
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Save PDF
        pdf.save(`${companyName}-Invoice-${document.getElementById('invoiceNumber').value.replace('#', '')}.pdf`);
    });
}