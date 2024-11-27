import { response } from "express";

let box = document.querySelector(".product-list"); // where the child will be appended

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
                <p id="title">Yves Product</p>
            </div>
            <div class="product">
                <p id="price">316 Pesos</p>
            </div>     
        </div>
        <div class="box">
            <div class="image">
                               
            </div>
            <div class="product">
                <p id="title">Yves Product</p>
            </div>
            <div class="product">
                <p id="price">316 Pesos</p>
            </div>     
        </div>`;
        box.appendChild(valueDiv); // appending the child to "box"
}
/*
use getProducts method in productController.js
*/
function viewProducts(boothID){
 
    fetch(`https://<sample/com>/${boothID}`,{// change this one
        method: 'GET', 
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
        console.log("Products fetched successfully:", data);
    })
    .catch(error => {
        console.error("Error fetching products:", error);
    });

}
/*
use buyProduct method in productController.js
*/
function buyProduct(productID, value){
    const data = {
        numberOfProductSold : value
   }
   fetch(`https://<sample/com>/buy/${productID}`,{// change this one
       method: 'PATCH',
       headers: {
           "Content-type":'application/json'
       },
       body: JSON.stringify(data)
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

displayBooths();
