
$(document).ready(function () {


     // Prices for each item on the menu
    const prices = {
        espresso: 1.95,
        latte: 2.95,
        cappuccino: 3.45,
        coffee: 1.75,
        biscotti: 1.95,
        scone: 2.95
    };



    // This array will hold the items the user selects for their order
    let order = [];



     // This function will update the display of the current order and the total price
    function updateOrderDisplay() {
        let total = 0;


         // Clear the order list to refresh the displayed items
        $('#order').empty();


        // Loop through each item in the order
        order.forEach(item => {


            // Add the item's price and quantity to the total
            total += item.price * item.quantity;


            // Display the item in the order list, showing name, price, and quantity
            $('#order').append(
                `<option>${item.name} $${item.price.toFixed(2)} (${item.quantity})</option>`
            );
        });


// Display the total price of the order
        $('#total').text(`Total: $${total.toFixed(2)}`);
    }

// For each image in the menu, add hover effect and click functionality
    $("#menu ul li img").each(function () {

        // Store the original image source and the hover image source
        const originalSrc = $(this).attr("src");
        const hoverSrc = $(this).attr("id");


        // Change the image when the user hovers over it
        $(this).hover(
            function () {

                // Change to hover image
                $(this).attr("src", hoverSrc);   
            },
            function () {

                // Change back to original image
                $(this).attr("src", originalSrc);
            }
        );


        // When the user clicks on an image, add the item to the order
        $(this).click(function () {


            // Get the name of the item
            const itemName = $(this).attr("alt");


            // Get the price of the item
            const itemPrice = prices[itemName];


           // Check if the item is already in the order
            const existingItem = order.find(orderItem => orderItem.name === itemName);
            if (existingItem) {

                // If the item is already in the order, increase the quantity
                existingItem.quantity += 1;
            } else {

                // If the item is not in the order, add it to the array with quantity 1
                order.push({ name: itemName, price: itemPrice, quantity: 1 });
            }

            updateOrderDisplay();
        });
    });



    // When the "Place Order" button is clicked
    $("#place_order").click(function () {


         // If the order is empty, show an alert and stop
        if (order.length === 0) {
            alert("Your order is empty, Please select your refresher!");
            return;
        }
// Calculate the subtotal of the order by summing up the price of each item
        const subtotal = order.reduce((sum, item) => sum + item.price * item.quantity, 0);


// Calculate tax (13% in Ontario)
        const tax = subtotal * 0.13; 


// If the subtotal is greater than $100, apply a 10% service tax
        const serviceTax = subtotal > 100 ? subtotal * 0.1 : 0; 


// Calculate the total by adding the subtotal, tax, and service tax
        const total = subtotal + tax + serviceTax;



// Save the order details (order items, subtotal, tax, service tax, total) in sessionStorage
        sessionStorage.setItem("orderDetails", JSON.stringify({ order, subtotal, tax, serviceTax, total }));


// Redirect to the checkout page
        window.location.href = "checkout.html";
    });
// When the "Clear Order" button is clicked, reset the order
    $("#clear_order").click(function () {
        // Empty the order array
        order = [];
        // Update the display to show an empty order
        updateOrderDisplay();
    });
});

/*------------------------------------------Checkout page-------------------------------------------*/
// Checkout page - code that runs when the checkout page is loaded



document.addEventListener("DOMContentLoaded", function () {

// Retrieve the order details from sessionStorage
    const orderDetails = JSON.parse(sessionStorage.getItem("orderDetails"));

    // If order details exist (meaning the user came from the main page)
    if (orderDetails) {
        const { order, subtotal, tax, serviceTax, total } = orderDetails;

        // Create a receipt to display the order details
        const receipt = `
            <h1>Coffee cafe</h1>
            <h2>Order Receipt</h2>
            <hr>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.map(item => `
                        <tr>
                            <td>${item.name} x${item.quantity}</td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
            <hr>
            <table>
                <tr>
                    <td><strong>Subtotal:</strong></td>
                    <td>$${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td><strong>Tax (13%):</strong></td>
                    <td>$${tax.toFixed(2)}</td>
                </tr>
                ${serviceTax > 0 ? `
                <tr>
                    <td><strong>Service Tax (10%):</strong></td>
                    <td>$${serviceTax.toFixed(2)}</td>
                </tr>` : ""}
                <tr>
                    <td><strong>Total:</strong></td>
                    <td>$${total.toFixed(2)}</td>
                </tr>
            </table>
            <hr>
            <p>Thank you for visiting Coffee cafe!</p>
        `;

        // Display the receipt in the 'receipt' element on the page
        document.getElementById("receipt").innerHTML = receipt;
    }
});










