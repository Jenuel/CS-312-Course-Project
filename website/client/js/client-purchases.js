let box = document.querySelector(".purchase-list"); // where the child will be appended

function displayBooths(){
    box.innerHTML = "";
        let valueDiv = document.createElement('div'); 
        valueDiv.classList.add('item');
        // creating the information of the product
        valueDiv.innerHTML = `
        <div class="box">
            <div class="image">
                               
            </div>
            <div class="product">
                <p id="status-title">STATUS</p>
                <p id="status">: insert status here</p>
            </div>
            <div class="product">
                <p id="date-title">DATE</p>
                <p id="date">: insert date here</p>
            </div>
                <div class="product">
                <p id="productid-title">PRODUCT ID</p>
                <p id="productid">: insert product id here</p>
            </div>
                <div class="product">
                <p id="total-title">TOTAL</p>
                <p id="total">: insert total here</p>
            </div>         
        </div>`;
        box.appendChild(valueDiv); // appending the child to "box"
}

/*
format of line in data[] :
"<productID> , <quantity> , <totalPricePerProduct>"
*/

//PLEASE FIX THIS
function createOrder (boothID, Data, totalPriceInput, dateInput){ 
    const products = dataArray.map(line => {// NOT SURE HERE
        const [productID, quantity, totalPricePerProduct] = line.split(',');
        return {
            productID: productID.trim(),
            quantity: parseInt(quantity.trim(), 10),
            totalPricePerProduct: parseFloat(totalPricePerProduct.trim()),
        };
    });
   
    const data = {
        products: products,
        totalPrice : totalPriceInput,
        date:dateInput 
    }
   
    fetch(`https://<sample/com>/details/${boothID}`,{// change this one
        method: 'POST', // PATCH is appropriate for partial updates like changing an order's status
        headers: {
            'Content-Type': 'application/json', // Ensure headers are set
        },
        body: JSON.stringify(data), // Send the status change in the body
   
    })
    .then(response => {
     if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
     }
     return response.json();
     })
     .then(data => {
         console.log("Products fetched successfully:", data);
     })
     .catch(error => {
         console.error("Error fetching products:", error);
     });
 }


 /*

*/
function cancelOrder(orderId) {
    fetch(`https://<your-domain>/cancel/${orderId}`, { // Use a meaningful endpoint
        method: 'PATCH', // PATCH is appropriate for partial updates like changing an order's status
        headers: {
            'Content-Type': 'application/json', // Ensure headers are set
        },
        body: JSON.stringify({ status: 'cancelled' }), // Send the status change in the body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Order cancelled successfully:", data);
    })
    .catch(error => {
        console.error("Error cancelling order:", error);
    });
}



displayBooths();
