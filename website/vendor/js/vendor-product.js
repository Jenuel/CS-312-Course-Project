const productTotal = document.getElementById("product-total");
const tableBody = document.querySelector(".table-body");
const addProductBtn = document.querySelector(".indicator-right-panel button");
const searchBox = document.querySelector(".searchbox");

function showAddProductForm(existingData, productContainer) {
  const modalHtml = `
    <div class="modal fade" id="productModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${existingData ? 'Edit Product' : 'Add New Product'}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="product-name" class="form-label">Product Name</label>
                <input type="text" class="form-control" id="product-name" placeholder="Input" value="${existingData ? existingData.ProductName : ''}">
              </div>
              ${existingData ? `
                <div class="mb-3">
                  <label for="status" class="form-label">Status</label>
                  <select class="form-select" id="status">
                    <option ${existingData.ProductStatus === 'Live' ? 'selected' : ''}>Live</option>
                    <option ${existingData.ProductStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                  </select>
                </div>
              ` : ''}
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" rows="3" placeholder="Enter product description">${existingData ? existingData.ProductDescription || '' : ''}</textarea>
              </div>
              <div class="mb-3">
                <label for="stock" class="form-label">Stock</label>
                <input type="number" class="form-control" id="stock" placeholder="Input" value="${existingData ? existingData.ProductStock : ''}">
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input type="number" class="form-control" id="price" placeholder="Input" value="${existingData ? existingData.ProductPrice : ''}">
              </div>
              <div class="mb-3">
                <label for="product-image" class="form-label">Upload Images</label>
                <input type="file" class="form-control" id="product-image" accept="image/*">
                <img id="image-preview" src="${existingData?.ProductImage || ''}" class="mt-2 ${existingData?.ProductImage ? 'd-block' : 'd-none'}" style="max-width: 100px;">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary submit-button">${existingData ? 'Update' : 'Submit'}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add modal 
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  const modalElement = document.getElementById('productModal');
  const modal = new bootstrap.Modal(modalElement);
  
  // Image 
  const imageInput = modalElement.querySelector("#product-image");
  const imagePreview = modalElement.querySelector("#image-preview");
  
  imageInput.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        imagePreview.src = event.target.result;
        imagePreview.classList.remove('d-none');
        imagePreview.classList.add('d-block');
      };
      reader.readAsDataURL(file);
    }
  });

  // magsubmit
  const submitBtn = modalElement.querySelector(".submit-button");
  submitBtn.addEventListener("click", () => {
    const formData = {
      ProductName: modalElement.querySelector("#product-name").value,
      ProductStatus: existingData ? modalElement.querySelector("#status").value : 'Pending', // Default to Pending for new products
      ProductDescription: modalElement.querySelector("#description").value,
      ProductPrice: modalElement.querySelector("#price").value,
      ProductStock: modalElement.querySelector("#stock").value || null,
      ProductSales: existingData ? existingData.ProductSales : null,
      ProductImage: imagePreview.classList.contains('d-none') ? null : imagePreview.src
    };

    if (existingData && productContainer) {
      updateProduct(formData, productContainer);
    } else {
      createProduct(formData);
    }
    
    modal.hide();
    modalElement.addEventListener('hidden.bs.modal', () => {
      modalElement.remove();
    });
  });

  modal.show();

}

const navLinks = document.querySelectorAll('.nav-links .nav-link');
let products = []; // Array to store all products

function getProductStatus(product) {
    if (Number(product.ProductStock) === 0) {
        return 'Sold Out';
    }
    return product.ProductStatus;
}

function createProduct(data) {
    data.ProductStatus = getProductStatus(data);
    products.push(data); // Add to products array
    filterProducts(getCurrentFilter()); // 
    updateProductTotal();
}


function getCurrentFilter() {
    const activeLink = document.querySelector('.nav-links .nav-link.active');
    return activeLink ? activeLink.textContent : 'All';
}

// Add filter functionality
function filterProducts(filterType) {
    tableBody.innerHTML = ''; // Clear current display
    
    const filteredProducts = products.filter(product => {
        switch(filterType) {
            case 'Live':
                return product.ProductStatus === 'Live';
            case 'Pending':
                return product.ProductStatus === 'Pending';
            case 'Sold Out':
                return product.ProductStatus === 'Sold Out';
            default:
                return true; // 'All' case
        }
    });

    filteredProducts.forEach(product => {
        showProductDetail(product);
    });

    updateProductTotal(filteredProducts.length);
}

// Add search functionality
function searchProducts(searchTerm) {
    const currentFilter = getCurrentFilter();
    tableBody.innerHTML = '';

    const searchResults = products.filter(product => {
        const matchesSearch = (
            product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.ProductDescription.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesFilter = currentFilter === 'All' ? true :
            currentFilter === product.ProductStatus;

        return matchesSearch && matchesFilter;
    });

    searchResults.forEach(product => {
        showProductDetail(product);
    });

    updateProductTotal(searchResults.length);
}


function updateProductTotal(count = null) {
    const total = count !== null ? count : products.length;
    productTotal.textContent = total;
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
        // Filter products
        filterProducts(link.textContent);
    });
});


searchBox.addEventListener('input', (e) => {
    searchProducts(e.target.value);
});


//  showProductDetail 
function showProductDetail(dataForm) {
    const productDetailContainer = document.createElement("div");
    productDetailContainer.className = "product-detail-container";

    let badgeClass = 'bg-warning'; // Default for Pending
    if (dataForm.ProductStatus === 'Live') {
        badgeClass = 'bg-success';
    } else if (dataForm.ProductStatus === 'Sold Out') {
        badgeClass = 'bg-danger';
    }

    productDetailContainer.innerHTML = `
        <div class="row text-center align-items-center">
            <div class="col">
                <div>${dataForm.ProductName}</div>
                <small class="text-muted">${dataForm.ProductDescription || ''}</small>
            </div>
            <div class="col">
                <span class="badge ${badgeClass}">${dataForm.ProductStatus}</span>
            </div>
            <div class="col">${dataForm.ProductPrice}</div>
            <div class="col">${dataForm.ProductStock}</div>
            <div class="col">${dataForm.ProductSales || '0'}</div>
            <div class="col">
                ${dataForm.ProductImage ? 
                    `<img src="${dataForm.ProductImage}" alt="Product" class="product-thumbnail rounded">` : 
                    'No Image'}
            </div>
            <div class="col">
                <button type="button" class="p-edit-button">
                    <i class='bx bx-edit'></i>
                </button>
                <button type="button" class="p-delete-button">
                    <i class='bx bx-trash-alt'></i>
                </button>
            </div>
        </div>`;

    // Rest of the event listeners remain the same
    const thumbnail = productDetailContainer.querySelector('.product-thumbnail');
    if (thumbnail) {
        thumbnail.addEventListener('click', () => showImageModal(dataForm.ProductImage));
    }

    const editBtn = productDetailContainer.querySelector(".p-edit-button");
    editBtn.addEventListener("click", () => editProductData(dataForm, productDetailContainer));

    const deleteBtn = productDetailContainer.querySelector(".p-delete-button");
    deleteBtn.addEventListener("click", () => {
        // Remove from products array
        products = products.filter(p => p.ProductName !== dataForm.ProductName);
        productDetailContainer.remove();
        updateProductTotal();
    });

    tableBody.appendChild(productDetailContainer);
}

// function showProductDetail(dataForm) {
//   const productDetailContainer = document.createElement("div");
//   productDetailContainer.className = "product-detail-container";
//   productDetailContainer.innerHTML = `
//     <div class="row text-center align-items-center">
//       <div class="col">
//         <div>${dataForm.ProductName}</div>
//         <small class="text-muted">${dataForm.ProductDescription || ''}</small>
//       </div>
//       <div class="col">
//         <span class="badge ${dataForm.ProductStatus === 'Live' ? 'bg-success' : 'bg-warning'}">${dataForm.ProductStatus}</span>
//       </div>
//       <div class="col">${dataForm.ProductPrice}</div>
//       <div class="col">${dataForm.ProductStock}</div>
//       <div class="col">${dataForm.ProductSales || '0'}</div>
//       <div class="col">
//         ${dataForm.ProductImage ? 
//           `<img src="${dataForm.ProductImage}" alt="Product" class="product-thumbnail rounded">` : 
//           'No Image'}
//       </div>
//       <div class="col">
//         <button type="button" class="p-edit-button">
//           <i class='bx bx-edit'></i>
//         </button>
//         <button type="button" class="p-delete-button">
//           <i class='bx bx-trash-alt'></i>
//         </button>
//       </div>
//     </div>`;

//   const thumbnail = productDetailContainer.querySelector('.product-thumbnail');
//   if (thumbnail) {
//     thumbnail.addEventListener('click', () => showImageModal(dataForm.ProductImage));
//   }

//   const editBtn = productDetailContainer.querySelector(".p-edit-button");
//   editBtn.addEventListener("click", () => editProductData(dataForm, productDetailContainer));

//   const deleteBtn = productDetailContainer.querySelector(".p-delete-button");
//   deleteBtn.addEventListener("click", () => productDetailContainer.remove());

//   tableBody.appendChild(productDetailContainer);
// }


function editProductData(data, productContainer) {
  // modal structure for edit
  const modalHtml = `
    <div class="modal fade" id="editProductModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Product</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <!-- Left Column -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="product-name" class="form-label">Product Name</label>
                  <input type="text" class="form-control" id="product-name" value="${data.ProductName || ''}">
                </div>
                <div class="mb-3">
                  <label for="status" class="form-label">Status</label>
                  <select class="form-select" id="status">
                    <option ${data.ProductStatus === 'Live' ? 'selected' : ''}>Live</option>
                    <option ${data.ProductStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="stock" class="form-label">Stock</label>
                  <input type="number" class="form-control" id="stock" value="${data.ProductStock || ''}">
                </div>
                <div class="mb-3">
                  <label for="price" class="form-label">Price</label>
                  <input type="number" class="form-control" id="price" value="${data.ProductPrice || ''}">
                </div>
              </div>
              <!-- Right Column -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea class="form-control" id="description" rows="4">${data.ProductDescription || ''}</textarea>
                </div>
                <div class="mb-3">
                  <label for="product-image" class="form-label">Update Image</label>
                  <input type="file" class="form-control" id="product-image" accept="image/*">
                  ${data.ProductImage ? 
                    `<div class="mt-2">
                      <p class="mb-1">Current Image:</p>
                      <img id="image-preview" src="${data.ProductImage}" class="d-block" style="max-width: 100px;">
                    </div>` : 
                    '<img id="image-preview" class="d-none" style="max-width: 100px;">'
                  }
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary update-button">Update</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  const modalElement = document.getElementById('editProductModal');
  const modal = new bootstrap.Modal(modalElement);

  // Image preview functionality
  const imageInput = modalElement.querySelector("#product-image");
  const imagePreview = modalElement.querySelector("#image-preview");
  
  imageInput.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        imagePreview.src = event.target.result;
        imagePreview.classList.remove('d-none');
        imagePreview.classList.add('d-block');
      };
      reader.readAsDataURL(file);
    }
  });


  const updateBtn = modalElement.querySelector(".update-button");
  updateBtn.addEventListener("click", () => {
    const updatedData = {
      ProductName: modalElement.querySelector("#product-name").value,
      ProductStatus: modalElement.querySelector("#status").value,
      ProductDescription: modalElement.querySelector("#description").value,
      ProductPrice: modalElement.querySelector("#price").value,
      ProductStock: modalElement.querySelector("#stock").value || null,
      ProductSales: data.ProductSales || '0',
      ProductImage: imagePreview.classList.contains('d-none') ? null : imagePreview.src
    };

    updateProduct(updatedData, productContainer);
    modal.hide();
  });

  // Show modal
  modal.show();
  
  // Cleanup on hide
  modalElement.addEventListener('hidden.bs.modal', () => {
    modalElement.remove();
  });
}

function updateProduct(updatedData, productContainer) {
  const row = productContainer.querySelector('.row');
  const cols = row.children;
  
  
  cols[0].innerHTML = `
    <div>${updatedData.ProductName}</div>
    <small class="text-muted">${updatedData.ProductDescription || ''}</small>
  `;
  
  
  cols[1].innerHTML = `
    <span class="badge ${updatedData.ProductStatus === 'Live' ? 'bg-success' : 'bg-warning'}">
      ${updatedData.ProductStatus}
    </span>
  `;
  
  
  cols[2].textContent = updatedData.ProductPrice;
  cols[3].textContent = updatedData.ProductStock;
  cols[4].textContent = updatedData.ProductSales;
  
  if (updatedData.ProductImage) {
    cols[5].innerHTML = `
      <img src="${updatedData.ProductImage}" 
           alt="Product" 
           class="product-thumbnail rounded" 
           style="cursor: pointer;">
    `;
    const thumbnail = cols[5].querySelector('.product-thumbnail');
    thumbnail.addEventListener('click', () => showImageModal(updatedData.ProductImage));
  } else {
    cols[5].textContent = 'No Image';
  }
}


function createProduct(data) {
  data.ProductStatus = getProductStatus(data);
  products.push(data);
  showProductDetail(data);
  updateProductTotal();
  filterProducts(getCurrentFilter());
}

/*THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER */

function createProductToNode( boothIdInput,stocksInput,priceInput,nameInput,statusInput,imageInput){
  const data = {
    boothID: boothIdInput,
    stocks:stocksInput,
    price:priceInput,
    name:nameInput,
    status:statusInput,
    image:imageInput
  }
  fetch(`http://localhost:3000/create`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json', 
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
      console.log("retrived pending orders successfully:", data);
         // add handling of data
  })
  .catch(error => {
      console.error("Error retrivieng pending orders:", error);
  });

}

/*
details [] should contain
"<title>:<value>",
"name:Burger",
"price:100.00"
*/

function editProduct(details,productID){
  const dataDetails = {
    // to do
  }
  const data = {
    product:dataDetails
  }
  fetch(`http://localhost:3000/edit/:${productID}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json', 
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
      console.log("retrived pending orders successfully:", data);
         // add handling of data
  })
  .catch(error => {
      console.error("Error retrivieng pending orders:", error);
  });
  
}

function changeStatusProduct(statusInput,productID){
  const data = {
    status : statusInput
  }
  fetch(`http://localhost:3000/edit/:${productID}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json', 
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
      console.log("retrived pending orders successfully:", data);
         // add handling of data

  })
  .catch(error => {
      console.error("Error retrivieng pending orders:", error);
  });
  
}