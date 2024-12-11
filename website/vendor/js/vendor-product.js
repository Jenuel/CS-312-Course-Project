const API_BASE_URL = "http://localhost:3000/products";
let eventSetup = false;
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

    console.log("Raw API response:", data);

    products = Array.isArray(data)
      ? data.map((product) => {
          return {
            ProductID: product.ProductID || product.id,
            ProductName: product.Name || product.name,
            ProductStatus: product.Status === "active" ? "Live" : "Pending",
            ProductPrice: Number(product.Price) || Number(product.price) || 0,
            ProductStock:
              Number(product.StocksRemaining) || Number(product.Stocks) || 0,
            ProductImage: product.Image
              ? `data:image/png;base64,${product.Image}`
              : null,
            ProductDescription:
              product.Description || product.description || "",
          };
        })
      : [];

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

async function createProduct(formData) {
  console.log("Creating product with data:", formData);

  try {
    const boothId = sessionStorage.getItem("currentBoothId");

    const requestData = {
      boothID: parseInt(boothId),
      stocks: parseInt(formData.ProductStock) || 0,
      price: parseFloat(formData.ProductPrice) || 0,
      name: formData.ProductName,
      status: "inactive",
      image: cleanImageData(formData),
    };

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

function cleanImageData(data) {
  let imageBase64 = null;

  // Handle the image if it exists
  if (data) {
    // Remove the data:image/png;base64, prefix if it exists
    imageBase64 = data.ProductImage.includes("base64")
      ? data.ProductImage.split(",")[1]
      : data.ProductImage;
  } else imageBase64 = null;

  return imageBase64;
}

async function updateProduct(updatedData, productContainer) {
  try {
    console.log("in update Product: " + updatedData.ProductID);
    const productId = updatedData.ProductID;
    console.log(productId);
    if (!productId) {
      throw new Error("Product ID not found");
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
          status: updatedData.ProductStatus.toLowerCase(),
          stocks: parseInt(updatedData.ProductStock),
          image: updatedData.ProductImage,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      // updateProductUI(updatedData, productContainer);
      editProductData(updatedData, productContainer);
    }
  } catch (error) {
    console.error("Failed to update product:", error);
    alert("Failed to update product. Please try again.");
    throw error;
  }
}

//end of fetch funtions
/* ----------------------------------------------------------------------------------------------------- */

// function updateProductUI(updatedData, productContainer) {
//   const row = productContainer.querySelector(".row");
//   const cols = row.children;

//   cols[0].innerHTML = `
//       <div>${updatedData.ProductName}</div>
//       <small class="text-muted">${updatedData.ProductDescription || ""}</small>
//   `;

//   let badgeClass = "bg-warning";
//   if (updatedData.ProductStatus === "Live") {
//     badgeClass = "bg-success";
//   } else if (updatedData.ProductStatus === "Sold Out") {
//     badgeClass = "bg-danger";
//   }

//   cols[1].innerHTML = `
//       <span class="badge ${badgeClass}">${updatedData.ProductStatus}</span>
//   `;

//   cols[2].textContent = updatedData.ProductPrice;
//   cols[3].textContent = updatedData.ProductStock;

//   if (updatedData.ProductImage) {
//     cols[5].innerHTML = `
//           <img src="${updatedData.ProductImage}"
//                alt="Product"
//                class="product-thumbnail rounded"
//                style="cursor: pointer;">
//       `;
//     const thumbnail = cols[5].querySelector(".product-thumbnail");
//     thumbnail.addEventListener("click", () =>
//       showImageModal(updatedData.ProductImage)
//     );
//   } else {
//     cols[5].textContent = "No Image";
//   }
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

  console.log("Product ID: " + data.ProductID);
  const updateBtn = modalElement.querySelector(".update-button");
  updateBtn.addEventListener("click", () => {
    const updatedData = {
      ProductID: data.ProductID,
      ProductName: modalElement.querySelector("#product-name").value,
      ProductStatus: modalElement.querySelector("#status").value,
      ProductPrice: modalElement.querySelector("#price").value,
      ProductStock: modalElement.querySelector("#stock").value || null,
      ProductImage: imagePreview.classList.contains("d-none")
        ? null
        : imagePreview.src,
    };
    console.log(updatedData);
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

const eventListeners = {
  addProduct: false,
  search: false,
  navLinks: false,
  back: false,
};

function setupEventListeners() {
  const addProductBtn = document.querySelector(".indicator-right-panel button");
  if (addProductBtn && !eventListeners.addProduct) {
    console.log("Setting up Add Product button listener - first time only");
    const newBtn = addProductBtn.cloneNode(true);
    addProductBtn.parentNode.replaceChild(newBtn, addProductBtn);
    newBtn.addEventListener("click", () => showAddProductFormData());
    eventListeners.addProduct = true;
  }

  const searchBox = document.querySelector(".searchbox");
  if (searchBox && !eventListeners.search) {
    const newSearchBox = searchBox.cloneNode(true);
    searchBox.parentNode.replaceChild(newSearchBox, searchBox);
    newSearchBox.addEventListener("input", (e) => {
      searchProducts(e.target.value);
    });
    eventListeners.search = true;
  }

  const navLinks = document.querySelectorAll(".nav-links .nav-link");
  if (navLinks && !eventListeners.navLinks) {
    navLinks.forEach((link) => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      newLink.addEventListener("click", (e) => {
        e.preventDefault();
        navLinks.forEach((l) => l.classList.remove("active"));
        newLink.classList.add("active");
        filterProducts(newLink.textContent);
      });
    });
    eventListeners.navLinks = true;
  }

  const backButton = document.querySelector(".arrow-back-btn");
  if (backButton && !eventListeners.back) {
    const newBackBtn = backButton.cloneNode(true);
    backButton.parentNode.replaceChild(newBackBtn, backButton);
    newBackBtn.addEventListener("click", goBack);
    eventListeners.back = true;
  }
}

function showAddProductFormData(existingData, productContainer) {
  console.log("Add Button Triggered");
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
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="">Cancel</button>
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
    }
});
  let submitHandled = false;
  

  submitBtn.addEventListener("click", async () => {
    console.log("submit initialized");
    if (submitHandled) return;
    submitHandled = true;
    submitBtn.disabled = true;

    try {
        const formData = {
          boothID: parseInt(sessionStorage.getItem("currentBoothId")),
          ProductName: modalElement.querySelector("#product-name").value,
          ProductStatus: existingData
            ? modalElement.querySelector("#status").value
            : "Pending",
          ProductPrice: modalElement.querySelector("#price").value,
          ProductStock: modalElement.querySelector("#stock").value || null,
          ProductImage: imagePreview.classList.contains("d-none")
            ? null
            : imagePreview.src,
        };

        if (existingData && productContainer) {
          updateProduct(formData, productContainer);
        } else {
          createProduct(formData);
        }
        if (existingData && productContainer) {
        } else {
          await createProduct(formData);
        }

        modal.hide();
        modalElement.addEventListener("hidden.bs.modal", () => {
          modalElement.remove();
      });

        modal.hide();
        modalElement.remove();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save product. Please try again.");
      submitHandled = false;
    } finally {
      submitBtn.disabled = false;
    }
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
    const matchesSearch = product.ProductName.toLowerCase().includes(
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
            </div>
            <div class="col">
                <span class="badge ${badgeClass}">${
    dataForm.ProductStatus
  }</span>
            </div>
            <div class="col">${dataForm.ProductPrice}</div>
            <div class="col">${dataForm.ProductStock}</div>
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
