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
                    <option>Unpublished</option>
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
    overlay.addEventListener('click', () => modalContainer.remove());
    submitBtn.addEventListener('click', handleProductSubmit);
}