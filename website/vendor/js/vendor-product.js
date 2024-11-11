const productTotal = document.getElementById("product-total");
const tableBody = document.querySelector(".table-body");
const addProductBtn = document.querySelector(".indicator-right-panel button");
const searchBox = document.querySelector(".searchbox");

function showAddProductForm(existingData, productContainer) {
  const modalContainer = document.createElement("div");
  modalContainer.className = "modal-overlay";
  modalContainer.innerHTML = `
    <div class="add-container" id="create">
      <div class="form-group">
        <label for="product-name">Product Name</label>
        <input type="text" id="product-name" placeholder="Input" value="${existingData ? existingData.ProductName : ''}">
      </div>
      <div class="form-group">
        <label for="status">Status</label>
        <select id="status">
          <option ${existingData && existingData.ProductStatus === 'Live' ? 'selected' : ''}>Live</option>
          <option ${existingData && existingData.ProductStatus === 'Pending' ? 'selected' : ''}>Pending</option>
        </select>
      </div>
      <div class="form-group">
        <label for="stock">Stock</label>
        <input type="number" id="stock" placeholder="Input" value="${existingData ? existingData.ProductStock : ''}">
      </div>
      <div class="form-group">
        <label for="price">Price</label>
        <input type="number" id="price" placeholder="Input" value="${existingData ? existingData.ProductPrice : ''}">
      </div>
      <div class="form-group">
        <label for="images">Upload Images</label>
        <input type="file" id="images" multiple>
      </div>
      <div class="form-group button-group">
        <button type="button" class="cancel-button">Cancel</button>
        <button type="submit" class="submit-button">${existingData ? 'Update' : 'Submit'}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalContainer);

  const cancelBtn = modalContainer.querySelector(".cancel-button");
  const submitBtn = modalContainer.querySelector(".submit-button");
  cancelBtn.addEventListener("click", () => modalContainer.remove());

  submitBtn.addEventListener("click", () => {
    const formData = {
      ProductName: modalContainer.querySelector("#product-name").value,
      ProductStatus: modalContainer.querySelector("#status").value,
      ProductPrice: modalContainer.querySelector("#price").value,
      ProductStock: modalContainer.querySelector("#stock").value || null,
      ProductSales: existingData ? existingData.ProductSales : null,
    };

    if (existingData && productContainer) {
      updateProduct(formData, productContainer);
    } else {
      createProduct(formData);
    }
    modalContainer.remove();
  });
}

function showProductDetail(dataForm) {
  const productDetailContainer = document.createElement("div");
  productDetailContainer.className = "product-detail-container";
  productDetailContainer.innerHTML = `
    <li>${dataForm.ProductName}</li>
    <li>${dataForm.ProductStatus}</li>
    <li>${dataForm.ProductPrice}</li>
    <li>${dataForm.ProductStock}</li>
    <li>${dataForm.ProductSales || '0'}</li>
    <li>
      <button type="button" class="p-edit-button">
        <i class='bx bx-edit'></i>
      </button>
      <button type="button" class="p-delete-button">
        <i class='bx bx-trash-alt'></i>
      </button>
    </li>`;

  const editBtn = productDetailContainer.querySelector(".p-edit-button");
  editBtn.addEventListener("click", () => editProductData(dataForm, productDetailContainer));

  const deleteBtn = productDetailContainer.querySelector(".p-delete-button");
  deleteBtn.addEventListener("click", () => productDetailContainer.remove());

  tableBody.appendChild(productDetailContainer);
}

function editProductData(data, productContainer) {
  showAddProductForm(data, productContainer);
}

function updateProduct(updatedData, productContainer) {
  const listItems = productContainer.getElementsByTagName("li");
  listItems[0].textContent = updatedData.ProductName;
  listItems[1].textContent = updatedData.ProductStatus;
  listItems[2].textContent = updatedData.ProductPrice;
  listItems[3].textContent = updatedData.ProductStock;
  listItems[4].textContent = updatedData.ProductSales || '0';
}

function createProduct(data) {
  showProductDetail(data);
}
