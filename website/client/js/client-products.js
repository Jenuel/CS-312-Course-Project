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
        </div>`;
        box.appendChild(valueDiv); // appending the child to "box"
}

displayBooths();
