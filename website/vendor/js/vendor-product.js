const API_BASE_URL = "http://localhost:3000/products";
const boothId = sessionStorage.getItem("currentBoothId");
const productTotal = document.getElementById("product-total");
const tableBody = document.querySelector(".table-body");
const addProductBtn = document.querySelector(".indicator-right-panel button");
const searchBox = document.querySelector(".searchbox");
let products = [];

function getSessionId() {
  return document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("PHPSESSID="))
    ?.split("=")[1];
}

function getMockProducts() {
  return [
    {
      ProductID: 1,
      ProductName: "Sample Product 1",
      ProductStatus: "Live",
      ProductPrice: 59.9,
      ProductStock: 100,
      ProductSales: "10",
      ProductImage: null,
      ProductDescription: "Sample description 1",
    },
    {
      ProductID: 2,
      ProductName: "Sample Product 2",
      ProductStatus: "Pending",
      ProductPrice: 29.9,
      ProductStock: 50,
      ProductSales: "5",
      ProductImage: null,
      ProductDescription: "Sample description 2",
    },
  ];
}

// Modify fetchBoothProducts to use mock data when API is unavailable
async function fetchBoothProducts() {
  showLoading();
  try {
      // Note the updated endpoint to match your productRoutes.js
      const response = await fetch(`${API_BASE_URL}/booth/${boothId}`, {
          method: 'GET',
          credentials: 'include', // Important for cookies
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getSessionId()}`
          }
      });

      let data;
      if (!response.ok) {
          console.log("API unavailable, using mock data");
          data = getMockProducts();
      } else {
          data = await response.json();
      }

      // Map the data to match the database field names from your SQL schema
      products = Array.isArray(data) ? data.map(product => ({
          ProductID: product.ProductID,
          ProductName: product.name,
          ProductStatus: product.status === 'active' ? 'Live' : 'Pending',
          ProductPrice: product.Price,
          ProductStock: product.StocksRemaining,
          ProductImage: product.Image,
          ProductDescription: product.Description || ''
      })) : [];

      filterProducts(getCurrentFilter());
  } catch (error) {
      console.log("Error fetching products:", error);
      products = getMockProducts();
      filterProducts(getCurrentFilter());
  } finally {
      tableBody.classList.remove("loading");
  }
}

function showLoading() {
  tableBody.innerHTML = `
      <div class="text-center p-4">
          <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
      </div>
  `;
}

/* ==================================================================================================== */

// Function to convert the image file to a Blob
function convertImageToBlob(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result;
      const blob = new Blob([arrayBuffer], { type: imageFile.type });
      resolve(blob);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(imageFile); // Convert the file to ArrayBuffer first
  });
}
//end of convertion funciton
/* ==================================================================================================== */

/* ----------------------------------------------------------------------------------------------------- */
// fetch functions 


async function createProduct(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getSessionId()}`,
      },
      body: JSON.stringify({
        boothID: formData.boothID,
        stocks: parseInt(formData.ProductStock),
        price: parseFloat(formData.ProductPrice),
        name: formData.ProductName,
        status: formData.ProductStatus.toLowerCase(),
        image: await convertImageToBlob(formData.ProductImage),// converted ProductImage to blob
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // Refresh products list after creation
    await fetchBoothProducts(formData.boothID);
  } catch (error) {
    console.error("Failed to create product:", error);
    alert("Failed to create product. Please try again.");
  }
}
/**
 * Edit product
 * 
 * @param {int} productId 
 * @param {Data[String]} Data 
 * 
 * 
 * here are all the possible values to be changed in a produc
 * Data = {
 * "Price:intvalue", 
 * "name:stringvalue", 
 * "Image: file", 
 * }
 */
async function editProduct(productId,Data) {
  
  const details = await Promise.all(Data.map(async (item) => {
    const [name, value] = item.split(":"); // Split into name and value
    let convertedValue;

    if (name === "Price") {
      convertedValue = parseInt(value);
    } 
    if (name === "name") {
      convertedValue = value;
    } 
    if (name === "Image") {
      convertedValue = await convertImageToBlob(value); // await inside async function
    }

    return { [name]: convertedValue }; // Create an object with dynamic keys
  }));


  const data = {
    product:details
  }

  try {
    const response = await fetch(`${API_BASE_URL}/edit/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getSessionId()}`,
      },
      body: JSON.stringify({data}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // Refresh products list after creation
  } catch (error) {
    console.error("Failed to create product:", error);
    alert("Failed to create product. Please try again.");
  }
}

/**
 * cayton's  edit product
 * @param {*} updatedData 
 * @param {*} productContainer 
 */

async function updateProduct(updatedData, productContainer) {// please specify what these value would look like
  try {
    const productId = productContainer.dataset.productId;
    if (!productId) {
      throw new Error("Product ID not found");
    }

    const sessionID = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("PHPSESSID="))
      ?.split("=")[1];

    if (!sessionID) {
      throw new Error("No session ID found");
    }

    const response = await fetch(`${API_BASE_URL}/edit/${productId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getSessionId()}`,
      },
      body: JSON.stringify({
        product: {
          name: updatedData.ProductName,
          price: parseFloat(updatedData.ProductPrice),
          status: updatedData.ProductStatus.toLowerCase(),// remove
          stocks: parseInt(updatedData.ProductStock),// remove
          image: updatedData.ProductImage,
          description: updatedData.ProductDescription,// remove
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      updateProductUI(updatedData, productContainer);
    }
  } catch (error) {
    console.error("Failed to update product:", error);
    alert("Failed to update product. Please try again.");
    throw error;
  }
}

//end of fetch funtions
/* ----------------------------------------------------------------------------------------------------- */

async function getCurrentBoothId() { // WHAT DOES THIS DO??
  try {
    const response = await fetchAPI("/booth/current");
    return response.boothId;
  } catch (error) {
    console.error("Failed to get booth ID:", error);
    throw error;
  }
}

function updateProductUI(updatedData, productContainer) {
  const row = productContainer.querySelector(".row");
  const cols = row.children;

  cols[0].innerHTML = `
      <div>${updatedData.ProductName}</div>
      <small class="text-muted">${updatedData.ProductDescription || ""}</small>
  `;

  let badgeClass = "bg-warning";
  if (updatedData.ProductStatus === "Live") {
    badgeClass = "bg-success";
  } else if (updatedData.ProductStatus === "Sold Out") {
    badgeClass = "bg-danger";
  }

  cols[1].innerHTML = `
      <span class="badge ${badgeClass}">${updatedData.ProductStatus}</span>
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
    const thumbnail = cols[5].querySelector(".product-thumbnail");
    thumbnail.addEventListener("click", () =>
      showImageModal(updatedData.ProductImage)
    );
  } else {
    cols[5].textContent = "No Image";
  }
}

function showImageModal(imageUrl) {
  const modalHtml = `
      <div class="modal fade" id="imageModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body text-center">
                      <img src="${imageUrl}" class="img-fluid" alt="Product Image">
                  </div>
              </div>
          </div>
      </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  const modalElement = document.getElementById("imageModal");
  const modal = new bootstrap.Modal(modalElement);

  modal.show();
  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
}

function setupEventListeners() {
  // Search functionality
  const searchBox = document.querySelector(".searchbox");
  if (searchBox) {
    searchBox.addEventListener("input", (e) => {
      searchProducts(e.target.value);
    });
  }

  // Navigation tabs functionality
  const navLinks = document.querySelectorAll(".nav-links .nav-link");
  if (navLinks) {
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        filterProducts(link.textContent);
      });
    });
  }

  // Add Product button
  const addProductBtn = document.querySelector(".indicator-right-panel button");
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => showAddProductForm());
  }

  // Back button
  const backButton = document.querySelector(".arrow-back-btn");
  if (backButton) {
    backButton.addEventListener("click", goBack);
  }
}
function showAddProductForm(existingData, productContainer) {
  const modalHtml = `
    <div class="modal fade" id="productModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${
              existingData ? "Edit Product" : "Add New Product"
            }</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="product-name" class="form-label">Product Name</label>
                <input type="text" class="form-control" id="product-name" placeholder="Input" value="${
                  existingData ? existingData.ProductName : ""
                }">
              </div>
              ${
                existingData
                  ? `
                <div class="mb-3">
                  <label for="status" class="form-label">Status</label>
                  <select class="form-select" id="status">
                    <option ${
                      existingData.ProductStatus === "Live" ? "selected" : ""
                    }>Live</option>
                    <option ${
                      existingData.ProductStatus === "Pending" ? "selected" : ""
                    }>Pending</option>
                  </select>
                </div>
              `
                  : ""
              }
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" rows="3" placeholder="Enter product description">${
                  existingData ? existingData.ProductDescription || "" : ""
                }</textarea>
              </div>
              <div class="mb-3">
                <label for="stock" class="form-label">Stock</label>
                <input type="number" class="form-control" id="stock" placeholder="Input" value="${
                  existingData ? existingData.ProductStock : ""
                }">
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input type="number" class="form-control" id="price" placeholder="Input" value="${
                  existingData ? existingData.ProductPrice : ""
                }">
              </div>
              <div class="mb-3">
                <label for="product-image" class="form-label">Upload Images</label>
                <input type="file" class="form-control" id="product-image" accept="image/*">
                <img id="image-preview" src="${
                  existingData?.ProductImage || ""
                }" class="mt-2 ${
    existingData?.ProductImage ? "d-block" : "d-none"
  }" style="max-width: 100px;">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary submit-button">${
              existingData ? "Update" : "Submit"
            }</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add modal
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modalElement = document.getElementById("productModal");
  const modal = new bootstrap.Modal(modalElement);

  // Image
  const imageInput = modalElement.querySelector("#product-image");
  const imagePreview = modalElement.querySelector("#image-preview");

  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        imagePreview.src = event.target.result;
        imagePreview.classList.remove("d-none");
        imagePreview.classList.add("d-block");
      };
      reader.readAsDataURL(file);
    }
  });

  // magsubmit
  const submitBtn = modalElement.querySelector(".submit-button");
  submitBtn.addEventListener("click", () => {
    const formData = {
      ProductName: modalElement.querySelector("#product-name").value,
      ProductStatus: existingData
        ? modalElement.querySelector("#status").value
        : "Pending", // Default to Pending for new products
      ProductDescription: modalElement.querySelector("#description").value,
      ProductPrice: modalElement.querySelector("#price").value,
      ProductStock: modalElement.querySelector("#stock").value || null,
      ProductSales: existingData ? existingData.ProductSales : null,
      ProductImage: imagePreview.classList.contains("d-none")
        ? null
        : imagePreview.src,
    };

    if (existingData && productContainer) {
      updateProduct(formData, productContainer);
    } else {
      createProduct(formData);
    }

    modal.hide();
    modalElement.addEventListener("hidden.bs.modal", () => {
      modalElement.remove();
    });
  });

  modal.show();
}

function getProductStatus(product) {
  if (Number(product.ProductStock) === 0) {
    return "Sold Out";
  }
  return product.ProductStatus;
}

function getCurrentFilter() {
  const activeLink = document.querySelector(".nav-links .nav-link.active");
  return activeLink ? activeLink.textContent : "All";
}

// Add filter functionality
function filterProducts(filterType) {
  if (!products || !products.length) {
    tableBody.innerHTML =
      '<div class="text-center p-4">No products found</div>';
    updateProductTotal(0);
    return;
  }

  const filteredProducts = products.filter((product) => {
    if (filterType === "All") return true;
    return product.ProductStatus === filterType;
  });

  tableBody.innerHTML = "";
  filteredProducts.forEach(showProductDetail);
  updateProductTotal(filteredProducts.length);
}

// Add search functionality
function searchProducts(searchTerm) {
  const currentFilter = getCurrentFilter();
  tableBody.innerHTML = "";

  const searchResults = products.filter((product) => {
    const matchesSearch =
      product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ProductDescription.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

    const matchesFilter =
      currentFilter === "All" ? true : currentFilter === product.ProductStatus;

    return matchesSearch && matchesFilter;
  });

  searchResults.forEach((product) => {
    showProductDetail(product);
  });

  updateProductTotal(searchResults.length);
}

function updateProductTotal(count = null) {
  const total = count !== null ? count : products.length;
  productTotal.textContent = total;
}

//  showProductDetail
function showProductDetail(dataForm) {
  const productDetailContainer = document.createElement("div");
  productDetailContainer.className = "product-detail-container mb-4";
  productDetailContainer.id = `product-${dataForm.ProductID}`;

  let badgeClass = "bg-warning"; // Default for Pending
  if (dataForm.ProductStatus === "Live") {
    badgeClass = "bg-success";
  } else if (dataForm.ProductStatus === "Sold Out") {
    badgeClass = "bg-danger";
  }

  productDetailContainer.innerHTML = `
        <div class="row text-center align-items-center">
            <div class="col">
                <div>${dataForm.ProductName}</div>
                <small class="text-muted">${
                  dataForm.ProductDescription || ""
                }</small>
            </div>
            <div class="col">
                <span class="badge ${badgeClass}">${
    dataForm.ProductStatus
  }</span>
            </div>
            <div class="col">${dataForm.ProductPrice}</div>
            <div class="col">${dataForm.ProductStock}</div>
            <div class="col">${dataForm.ProductSales || "0"}</div>
            <div class="col">
                ${
                  dataForm.ProductImage
                    ? `<img src="${dataForm.ProductImage}" alt="Product" class="product-thumbnail rounded">`
                    : "No Image"
                }
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

  // Rest of the event remain
  const thumbnail = productDetailContainer.querySelector(".product-thumbnail");
  if (thumbnail) {
    thumbnail.addEventListener("click", () =>
      showImageModal(dataForm.ProductImage)
    );
  }

  const editBtn = productDetailContainer.querySelector(".p-edit-button");
  editBtn.addEventListener("click", () =>
    editProductData(dataForm, productDetailContainer)
  );

  const deleteBtn = productDetailContainer.querySelector(".p-delete-button");
  deleteBtn.addEventListener("click", () => {
    // Remove from products array
    products = products.filter((p) => p.ProductName !== dataForm.ProductName);
    productDetailContainer.remove();
    updateProductTotal();
  });

  tableBody.appendChild(productDetailContainer);
}

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
                  <input type="text" class="form-control" id="product-name" value="${
                    data.ProductName || ""
                  }">
                </div>
                <div class="mb-3">
                  <label for="status" class="form-label">Status</label>
                  <select class="form-select" id="status">
                    <option ${
                      data.ProductStatus === "Live" ? "selected" : ""
                    }>Live</option>
                    <option ${
                      data.ProductStatus === "Pending" ? "selected" : ""
                    }>Pending</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="stock" class="form-label">Stock</label>
                  <input type="number" class="form-control" id="stock" value="${
                    data.ProductStock || ""
                  }">
                </div>
                <div class="mb-3">
                  <label for="price" class="form-label">Price</label>
                  <input type="number" class="form-control" id="price" value="${
                    data.ProductPrice || ""
                  }">
                </div>
              </div>
              <!-- Right Column -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea class="form-control" id="description" rows="4">${
                    data.ProductDescription || ""
                  }</textarea>
                </div>
                <div class="mb-3">
                  <label for="product-image" class="form-label">Update Image</label>
                  <input type="file" class="form-control" id="product-image" accept="image/*">
                  ${
                    data.ProductImage
                      ? `<div class="mt-2">
                      <p class="mb-1">Current Image:</p>
                      <img id="image-preview" src="${data.ProductImage}" class="d-block" style="max-width: 100px;">
                    </div>`
                      : '<img id="image-preview" class="d-none" style="max-width: 100px;">'
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

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modalElement = document.getElementById("editProductModal");
  const modal = new bootstrap.Modal(modalElement);

  // Image preview functionality
  const imageInput = modalElement.querySelector("#product-image");
  const imagePreview = modalElement.querySelector("#image-preview");

  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        imagePreview.src = event.target.result;
        imagePreview.classList.remove("d-none");
        imagePreview.classList.add("d-block");
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
      ProductSales: data.ProductSales || "0",
      ProductImage: imagePreview.classList.contains("d-none")
        ? null
        : imagePreview.src,
    };

    updateProduct(updatedData, productContainer);
    modal.hide();
  });

  // Show modal
  modal.show();

  // Cleanup on hide
  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
}

function goBack() {
  window.location.href = "vendor-home.html";
}

async function initializePage() {
  // Check for booth ID
  if (!boothId) {
    alert("No booth selected");
    window.location.href = "vendor-home.html";
    return;
  }

  // Add back button if not already in your HTML
  const backButton = document.createElement("button");
  backButton.className = "btn btn-secondary mb-3";
  backButton.innerHTML = '<i class="bx bx-arrow-back"></i> Back to Booths';
  backButton.onclick = () => {
    window.location.href = "vendor-home.html";
  };
  document.querySelector(".main-container").prepend(backButton);

  // Check session
  const sessionId = getSessionId();
  if (!sessionId) {
    window.location.href =
      "/CS-312-Course-Project/website/auth/html/login.html";
    return;
  }

  // Load initial data
  await fetchBoothProducts();
  setupEventListeners();
}
document.addEventListener("DOMContentLoaded", initializePage);
