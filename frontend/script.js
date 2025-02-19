document.getElementById("addItem").addEventListener("click", () => {
    const itemsDiv = document.getElementById("items");

    const itemRow = document.createElement("div");
    itemRow.classList.add("item-row");

    itemRow.innerHTML = `
        <input type="text" class="item-name" placeholder="Item Name" required>
        <input type="number" class="item-rate" placeholder="Rate" required>
        <input type="number" class="item-quantity" placeholder="Quantity" required>
        <input type="number" class="item-total" placeholder="Total" readonly>
        <button type="button" class="removeItem">Remove</button>
    `;

    itemsDiv.appendChild(itemRow);

    // Auto-calculate total
    const rateInput = itemRow.querySelector(".item-rate");
    const quantityInput = itemRow.querySelector(".item-quantity");
    const totalInput = itemRow.querySelector(".item-total");

    rateInput.addEventListener("input", updateTotal);
    quantityInput.addEventListener("input", updateTotal);

    function updateTotal() {
        const rate = parseFloat(rateInput.value) || 0;
        const quantity = parseInt(quantityInput.value) || 0;
        totalInput.value = (rate * quantity).toFixed(2);
    }

    // Remove item
    itemRow.querySelector(".removeItem").addEventListener("click", () => {
        itemsDiv.removeChild(itemRow);
    });
});

// Submit form
document.getElementById("invoiceForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const invoiceData = {
        companyName: document.getElementById("companyName").value,
        bankDetails: document.getElementById("bankDetails").value,
        billedTo: document.getElementById("billedTo").value,
        items: getItems(),
        igst: parseFloat(document.getElementById("igst").value) || 0,
        discount: parseFloat(document.getElementById("discount").value) || 0
    };

    try {
        const response = await fetch("http://localhost:5000/api/generate-invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoiceData)
        });

        const result = await response.json();
        if (response.ok) {
            alert("✅ Invoice generated successfully!");
            console.log(result);
        } else {
            alert("❌ Error: " + result.message);
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
        alert("❌ Server error");
    }
});

// Get items from form
function getItems() {
    let items = [];
    document.querySelectorAll(".item-row").forEach(row => {
        items.push({
            itemName: row.querySelector(".item-name").value,
            rate: parseFloat(row.querySelector(".item-rate").value) || 0,
            quantity: parseInt(row.querySelector(".item-quantity").value) || 0,
            total: parseFloat(row.querySelector(".item-total").value) || 0
        });
    });
    return items;
}
