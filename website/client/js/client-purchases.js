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

displayBooths();
