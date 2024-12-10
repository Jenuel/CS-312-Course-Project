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

/*THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER */

/*
format of line in data[] :
"<productID> , <quantity> , <totalPricePerProduct>",
"<productID> , <quantity> , <totalPricePerProduct>"
*/

function createOrder (boothID, Data, totalPriceInput, dateInput){ 
   /*
     const products = dataArray.map(Data => {// NOT SURE HERE
        const [productID, quantity, totalPricePerProduct] = Data.split(',');
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

    */
    let details = "";

   for(let i = 0; i< Data.length ; i++ ){
    const temp = Data[i].split(",");
    if(i == Data.length -1){
        details =details ,`[productID:${temp[0]}, quantity:${temp[1]}, totalPricePerProduct:${temp[2]}]`;
    }else{
        details =details ,`[productID:${temp[0]}, quantity:${temp[1]}, totalPricePerProduct:${temp[2]}],\n`;
    }
      
   }
   
    const data = {
        products: details,
        totalPrice : totalPriceInput,
        date:dateInput 
    }
    
    fetch(`http://localhost:3000/orders/details/${boothID}`,{//  URL for CREATE ORDER
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
   
    })
    .then(response => {
     if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
     }
     return response.json();
     })
     .then(data => {
         console.log("Products fetched successfully:", data);
         // add handling of data
     })
     .catch(error => {
         console.error("Error fetching products:", error);
     });

     details.forEach(product => {
        const data={
            numberOfProductsSold: product.quantity
        }

        fetch(`http://localhost:3000/products/buy/${product.productID}`,{//  URL for BUY PRODUCT
            method: 'PATCH', 
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
             // add handling of data
         })
         .catch(error => {
             console.error("Error fetching products:", error);
         });

        
     });
 }


 
function cancelOrder(orderId) {
    fetch(`http://localhost:3000/orders/cancel/${orderId}`, { // URL for Cancell order
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ status: 'cancelled' }), 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // data is a json massgae no parsing needed
        console.log("Order cancelled successfully:", data);
    })
    .catch(error => {
        console.error("Error cancelling order:", error);
    });
}



displayBooths();

function openProfile() {
    const profile = document.getElementById("profile");
    profile.classList.add("open-profile");
}

// Close profile form popup
function closeProfile() {
    const profile = document.getElementById("profile");
    profile.classList.remove("open-profile");
}

// Optionally, handle form submission
document.getElementById("profile-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent page reload on form submit
    const name = document.getElementById("profile-name").value;
    const email = document.getElementById("profile-email").value;
    const password = document.getElementById("profile-password").value;

    // Send the updated data to the server or process accordingly
    console.log("Updated Profile:", name, email, password);
    // You can implement an API call to save the changes here

    closeProfile(); // Close the profile popup after submission
});