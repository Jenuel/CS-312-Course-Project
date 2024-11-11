const productTotal = document.getElementById('product-total');
const tableBody = document.querySelector('.table-body');
const addProductBtn = document.querySelector('.indicator-right-panel button');
const searchBox = document.querySelector('.searchbox');


function showAddProductForm() {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-overlay';
    modalContainer.innerHTML = `
       
        <div class="add-container" id="create">
            <div class="form-group">
                <label for="product-name">Product Name</label>
                <input type="text" id="product-name" placeholder="Input">
            </div>
            
            <div class="form-group">
                <label for="status">Status</label>
                <select id="status">
                    <option>Live</option>
                    <option>Pending</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="stock">Stock</label>
                <input type="number" id="stock" placeholder="Input">
            </div>
            
            <div class="form-group">
                <label for="price">Price</label>
                <input type="number" id="price" placeholder="Input">
            </div>

            <div class="form-group">
                <label for="images">Upload Images</label>
                <input type="file" id="images" multiple>
            </div>

            <div class="form-group button-group">
                <button type="button" class="cancel-button">Cancel</button>
                <button type="submit" class="submit-button">Submit</button>
            </div>
        </div>

    `;

    document.body.appendChild(modalContainer);


    const cancelBtn = modalContainer.querySelector('.cancel-button');
    const submitBtn = modalContainer.querySelector('.submit-button');
    const overlay = modalContainer.querySelector('.modal-overlay');

    cancelBtn.addEventListener('click', () => modalContainer.remove());
    // overlay.addEventListener('click', () => modalContainer.remove());
    submitBtn.addEventListener('click', () => {
        createProduct();  
        modalContainer.remove()
    });
}


function showProductDetail(dataForm) {
    console.log(dataForm.ProductName.value)

    // array.forEach(dataForm => {
        const productDetailContainer = document.createElement('div');
        productDetailContainer.className = "product-detail-container";
        productDetailContainer.innerHTML = `
             <li>${dataForm.ProductName}</li>
                            <li>${dataForm.ProductStatus}</li>
                            <li>${dataForm.ProductPrice}</li>
                            <li>${dataForm.ProductStock}</li>
                            <li>${dataForm.ProductSales}</li>
                            <li>
                                    <button type="button" class="p-edit-button">
                                        <i class='bx bx-edit'></i>
                                    </button>
    
                                    <button type="button" class="p-delete-button">
                                        <i class='bx bx-trash-alt' ></i>
                                    </button>
                                
                            </li>`
    
        const editBtn = productDetailContainer.querySelector('p-edit-button');
        var deleteBtn = productDetailContainer.querySelector('p-delete-button');
        deleteBtn = document.createElement('button')
        deleteBtn.addEventListener("click", () => productDetailContainer.remove() )

        tableBody.appendChild(productDetailContainer)
    // });

}


function createProduct() {
    const inputProdDom = document.querySelector(".add-container")

    const data =  {
        ProductName: inputProdDom.querySelector('#product-name').value,
        ProductStatus: inputProdDom.querySelector('#status').value,
        ProductPrice: inputProdDom.querySelector('#price').value,
        ProductStock: inputProdDom.querySelector('#stock').value || null,
        ProductSales: null
    };

    showProductDetail(data);
}