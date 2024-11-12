let box = document.querySelector(".specific-product-container"); // where the child will be appended

function displayBooths(){
    box.innerHTML = "";
    let valueDiv = document.createElement('div'); 
    valueDiv.classList.add('box');
    // creating the information of the product
    valueDiv.innerHTML = `
            <div class="image">
                               
            </div>
            <div class="title">
                <p>hello</p>
            </div>
            <div class="description">
                <h1>DESCRIPTION:</h1>
                <p>hello</p>
            </div>
            <div class="buttons">
                <button type="button" onclick="preorderItem()" id="preorder-button">
                    PRE-ORDER
                </button>
                <div class="quantity-container">
                    <button onclick="minusQuantity()" id="minus-button">-</button>
                    <span class="quantity-text">1</span>
                    <button onclick="addQuantity()" id="add-button">+</button>
                </div>
            </div>`;
    box.appendChild(valueDiv); // appending the child to "box"
}

displayBooths();
