const urlParams = new URLSearchParams(window.location.search);
const boothId = urlParams.get('id'); 

let box = document.querySelector(".product-list"); 

function displayProducts(products) {
    box.innerHTML = ""; 
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('item'); 

        productDiv.innerHTML = `
            <div class="box">
                <div class="image">
                    <img src="${product.Image}" alt="${product.Name}">
                </div>
                <div class="product">
                    <p id="title">${product.Name}</p>
                </div>
                <div class="product">
                    <p id="status">${product.Status}</p>
                </div>
            </div>`;
        box.appendChild(productDiv);
    });
}
/*
function to convert base64 --> image
*/


// Function to create an image element from Base64
function base64ToImage(base64, mimeType = 'image/png') {
    const img = new Image();
    img.src = `data:${mimeType};base64,${base64}`;
    return img; // Return the image element
}

/*THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER */

// Main function to fetch products
function fetchProducts(boothId) {

    fetch(`http://localhost:3000/products/booth/${boothId}`, { 
        method: 'PATCH',
        headers: {
            "Content-type": 'application/json',
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
        /*
        sample data output
        [
            {
                "Name": "Handmade Bracelet",
                "Status": "active",
                "Image": "base64"
            },
            {
                "Name": "Handmade Bracelet",
                "Status": "active",
                "Image": "base64"
            }
        ]
        */
        console.log("Products fetched successfully:", data);

        data.forEach(product => {
            product.Name // name of the product
            product.Status // status of the product

            if (product.Image) {
                const imgElement = base64ToImage(product.Image, 'image/png');
                document.body.appendChild(imgElement); // Append the image to the body
             }
        });    
    })
    .catch(error => {
        console.error("Error purchasing product:", error);
    });
}

function buyProduct(productID, value) {

    const data = {
        numberOfProductSold: value,
    };

    fetch(`http://localhost:3000/products/buy/${productID}`, { 
        method: 'PATCH',
        headers: {
            "Content-type": 'application/json',
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
        // data is just sa massage in a form of a json
        console.log("Product purchased successfully:", data);
        // add handling of data
    })
    .catch(error => {
        console.error("Error purchasing product:", error);
    });
}



fetchProducts(boothId);