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
function to convert blob --> base64 --> image
*/

// Function to convert a Blob to Base64
function blobToBase64(blob, callback, errorCallback) {
    const reader = new FileReader();
    reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Get Base64 without the prefix
        callback(base64);
    };
    reader.onerror = (error) => {
        errorCallback(error);
    };
    reader.readAsDataURL(blob); // Read Blob as Data URL
}

// Function to create an image element from Base64
function base64ToImage(base64, mimeType = 'image/png') {
    const img = new Image();
    img.src = `data:${mimeType};base64,${base64}`;
    return img; // Return the image element
}

/*THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER */

// Main function to fetch products
function fetchProducts(boothId) {

    fetch(`http://localhost:3000/${boothId}`, { 
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
                "name": "Handmade Bracelet",
                "Stocks": 50,
                "Price": 29.99,
                "status": "active",
                "Image": "BLOB"
            },
            {
                "name": "Handmade Bracelet",
                "Stocks": 50,
                "Price": 29.99,
                "status": "active",
                "Image": "BLOB"
            }
        ]
        */
        console.log("Products fetched successfully:", data);

        // Handle the data (convert Blob to Base64 and Base64 to Image)
        data.forEach(product => {
            if (product.Image) {
                // Assuming "Image" is already a Blob; convert it to Base64
                blobToBase64(
                    product.Image, // Blob object
                    (base64) => {
                        console.log("Base64 String:", base64);

                        // Convert Base64 to an image element
                        const imgElement = base64ToImage(base64, 'image/png');
                        document.body.appendChild(imgElement); // Append the image to the body
                    },
                    (error) => {
                        console.error("Error converting Blob to Base64:", error);
                    }
                 );
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

    fetch(`http://localhost:3000/buy/${productID}`, { 
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