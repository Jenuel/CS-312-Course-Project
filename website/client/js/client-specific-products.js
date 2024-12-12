let cart = []; 
let grandTotal= 0.0;
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

function displaySpecficProduct(product) {
    const container = document.querySelector(".container px-4 px-lg-5 my-5");
    container.innerHTML = "";

    const valueDiv = document.createElement('div');
    valueDiv.classList.add('row gx-4 gx-lg-5 align-items-center');
    valueDiv.innerHTML = `
     <div class="col-md-6">
          <img id="product-image" class="card-img-top mb-5 mb-md-0"   src="${product.Image ? `data:image/png;base64,${product.Image}` : 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg'}" 
            alt="${product.Name}"/>
        </div>
        <div class="col-md-6">
          <h1 id="product-name" class="display-5 fw-bolder">${product.Name}</h1>
          <div class="fs-5 mb-2">
            <span id="product-price">₱${product.Price}</span>
          </div>
          <p id="product-description" class="lead">Product Description</p>
          <div class="d-flex align-items-center">
            <label for="quantityInput" class="me-2">Quantity:</label>
            <input type="number" id="quantityInput" min="1" value="1" class="form-control" style="width: 5rem;">
            <button class="btn btn-primary ms-3" type="button" onclick="addToCart(this.parentElement.querySelector('#quantityInput').value,${product.ProductID},${product.Price})">Add to Cart</button>
          </div>`;
    box.appendChild(valueDiv);
}

function addToCart(quantity,ProductID,Price ){
    let totalPrice = quantity * Price;
    cart.push({
        ProductID: ProductID,
        quantity : quantity,
        price: Price,
        total:totalPrice
    });
    grandTotal += totalPrice;
}
 
function checkout() { 
    alert("checking out products");
    const cartJSON = JSON.stringify(cart);
    window.location.href = "client-purchases.html?cart=" + encodeURIComponent(cartJSON) + "&total=" + encodeURIComponent(grandTotal);
}


/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER

/**
 * Fetch for retreiving a specific product (GET)
 * @param {Integer} productId 
 */
function getSpecificProduct(productId){
  
   fetch(`http://localhost:3000/products/details/${productId}`,{
    method: 'GET', 
    headers: {
        'Content-Type': 'application/json', 
    }
   })
   .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
    })
    .then(data => {
        /*SAMPLE data  OUTPUT
        
        {
            "Name": "Handmade Bracelet",
            "Stocks": 50,
            "Price": 29.99,
            "Status": "active",
            "Image": "base64",
            "ProductID":"id"
        }

        */
       data.Name // name of product
       data.Stocks // remaining stocks of product
       data.Price // price of  product
       data.Status //status of product

        console.log("Products fetched successfully:", data);
        // Handle the "Image" field
        // if (data.Image) {
        //     const imgElement = base64ToImage(data.Image, 'image/png');
        //     document.body.appendChild(imgElement); // Append the image to the body
        // }

        displaySpecficProduct(data);
    })
    .catch(error => {
        console.error("Error fetching products:", error);
    });
}

//END OF FETCH FUNCTIONS
/* ----------------------------------------------------------------------------------------------------- */


/*
Helper function to convert  base64 --> image
*/

// Function to create an image element from Base64
function base64ToImage(base64, mimeType = 'image/png') {
    const img = new Image();
    img.src = `data:${mimeType};base64,${base64}`;
    return img; // Return the image element
}


getSpecificProduct(productId);