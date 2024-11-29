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

function fetchProducts(boothId) {
    fetch(`https://<your-domain>/products/${boothId}`, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        console.log("Products fetched successfully:", data);
        displayProducts(data); 
    })
    .catch(error => {
        console.error("Error fetching products:", error);
    });
}

function buyProduct(productID, value) {
    const data = {
        numberOfProductSold: value,
    };

    fetch(`https://<your-domain>/buy/${productID}`, { 
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
        console.log("Product purchased successfully:", data);
    })
    .catch(error => {
        console.error("Error purchasing product:", error);
    });
}

fetchProducts(boothId);