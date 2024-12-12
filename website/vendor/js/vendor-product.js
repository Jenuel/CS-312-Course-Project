const API_BASE_URL = "http://localhost:3000/products";
let eventSetup = false;
const boothId = sessionStorage.getItem("currentBoothId");
const productTotal = document.getElementById("product-total");
const tableBody = document.querySelector(".table-body");
const addProductBtn = document.querySelector(".indicator-right-panel button");
const searchBox = document.querySelector(".searchbox");
let products = [];

const eventListeners = {
  addProduct: false,
  search: false,
  navLinks: false,
  back: false,
};

function getSessionId() {
  return document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("PHPSESSID="))
    ?.split("=")[1];
}

// Modify fetchBoothProducts to use mock data when API is unavailable
async function fetchBoothProducts() {
  showLoading();
  try {
    // Note the updated endpoint to match your productRoutes.js
    const response = await fetch(`${API_BASE_URL}/booth/${boothId}`, {
      method: "GET",
      credentials: "include", // Important for cookies
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getSessionId()}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();
    console.log("Raw data from API:", data); // Debug log

    products = Array.isArray(data)
      ? data.map((product) => ({
          ProductID: product.ProductID,
          ProductName: product.Name,
          ProductStatus: product.Status === "active" ? "Live" : "Pending",
          ProductPrice: Number(product.Price) || 0,
          ProductStock: Number(product.Stocks) || 0,
          // Image is already base64 from TO_BASE64() in MySQL
          ProductImage: product.Image
            ? `data:image/jpeg;base64,${product.Image}`
            : null,
        }))
      : [];

    console.log("Processed products:", products);
    filterProducts(getCurrentFilter());
  } catch (error) {
    products = [];
    console.log("Error fetching products:", error);
    products = [];
    filterProducts(getCurrentFilter());
  } finally {
    tableBody.classList.remove("loading");
  }
}

async function createProduct(formData) {
  console.log("Creating product with data:", formData);

  try {
    const boothId = sessionStorage.getItem("currentBoothId");

    if (
      !formData.ProductName ||
      !formData.ProductStock ||
      !formData.ProductPrice
    ) {
      throw new Error("Please fill in all required fields");
    }

    const requestData = {
      boothID: parseInt(boothId),
      stocks: parseInt(formData.ProductStock) || 0,
      price: parseFloat(formData.ProductPrice) || 0,
      name: formData.ProductName,
      status: "inactive",
      image: formData.ProductImage
        ? formData.ProductImage.split("base64,")[1]
        : null,
    };

    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getSessionId()}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    await fetchBoothProducts();
    return result;
  } catch (error) {
    console.error("Failed to create product:", error);
    alert("Failed to create product. Please try again.");
  }
}

function editProductData(data, productContainer) {
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
                  <input type="text" class="form-control" id="product-name" value="${data.ProductName || ""}">
                </div>
                <div class="mb-3">
                  <label for="status" class="form-label">Status</label>
                  <select class="form-select" id="status">
                    <option ${data.ProductStatus === "Live" ? "selected" : ""}>Live</option>
                    <option ${data.ProductStatus === "Pending" ? "selected" : ""}>Pending</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="stock" class="form-label">Stock</label>
                  <input type="number" class="form-control" id="stock" value="${data.ProductStock || ""}">
                </div>
                <div class="mb-3">
                  <label for="price" class="form-label">Price</label>
                  <input type="number" class="form-control" id="price" value="${data.ProductPrice || ""}">
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
                      <input type="hidden" id="original-image" value="${data.ProductImage}">
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
  const imageInput = modalElement.querySelector("#product-image");
  const imagePreview = modalElement.querySelector("#image-preview");
  const originalImage = modalElement.querySelector("#original-image");
  let imageChanged = false;

  // Modified setupImageUpload to track changes
  imageInput.addEventListener("change", async (e) => {
    try {
      const file = e.target.files[0];
      if (!imageUtils.validateImage(file)) {
        alert("File must be less than 5MB");
        return;
      }

      const base64Data = await imageUtils.readFileAsBase64(file);
      imagePreview.src = base64Data;
      imagePreview.classList.remove("d-none");
      imagePreview.classList.add("d-block");
      imageChanged = true;
    } catch (error) {
      alert("Failed to load image");
      console.error(error);
    }
  });

  const updateBtn = modalElement.querySelector(".update-button");
  updateBtn.addEventListener("click", () => {
    const updatedData = {
      ProductID: data.ProductID,
      ProductName: modalElement.querySelector("#product-name").value,
      ProductStatus: modalElement.querySelector("#status").value,
      ProductPrice: modalElement.querySelector("#price").value,
      ProductStock: modalElement.querySelector("#stock").value || null,
      ProductImage: imageChanged ? imagePreview.src : originalImage?.value || null
    };
    
    updateProduct(updatedData, imageChanged);
    modal.hide();
  });

  modal.show();

  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${productId}`, {
      method: "DELETE",
      credentials: "include", // Important for cookies
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getSessionId()}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete product");
    }

    await fetchBoothProducts();

    alert("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    alert(error.message || "Failed to delete product. Please try again.");
  }
}

async function updateProduct(updatedData, imageChanged) {
  try {
    const productId = updatedData.ProductID;
    if (!productId) throw new Error("Product ID not found");

    const product = [];

    if (updatedData.ProductName) {
      product.push({ name: updatedData.ProductName });
    }

    if (updatedData.ProductPrice) {
      product.push({ price: parseFloat(updatedData.ProductPrice) });
    }

    if (updatedData.ProductStatus) {
      product.push({
        status: updatedData.ProductStatus.toLowerCase() === "live" ? "active" : "inactive"
      });
    }

    if (updatedData.ProductStock) {
      product.push({ StocksRemaining: parseInt(updatedData.ProductStock) });
    }

    if (imageChanged && updatedData.ProductImage) {
      const base64Data = updatedData.ProductImage.split("base64,")[1];
      if (base64Data) {
        product.push({ Image: base64Data });
      }
    }

    const response = await fetch(`${API_BASE_URL}/edit/${productId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getSessionId()}`
      },
      body: JSON.stringify({ product })
    });

    const responseData = await response.text();

    if (!response.ok) {
      console.error("API response error:", responseData);
      throw new Error(responseData);
    }

    await fetchBoothProducts();
  } catch (error) {
    console.error("Failed to update product:", error);
    alert("Failed to update product. Please try again.");
    throw error;
  }
}

// UTILITIES

function setupTabNavigation() {
  const navLinks = document.querySelectorAll('.nav-link.tab-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all tabs
      navLinks.forEach(tab => {
        tab.classList.remove('active');
        tab.style.color = 'rgb(98, 97, 97)';  
        tab.style.borderBottom = 'none';       
      });
      
      // Add active class to clicked tab
      link.classList.add('active');
      link.style.color = '#0d6efd';           
      link.style.borderBottom = '2px solid #0d6efd';  // Add active border
      
      const tabType = link.getAttribute('data-tab');
      
      if (link.getAttribute('data-section') === 'orders') {
        showOrders();
      } else {
        showProducts();
        const filterValue = link.getAttribute('data-filter') || link.textContent;
        filterProducts(filterValue);
      }
    });
  });
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

  setupImageUpload(imageInput, imagePreview);

  // magsubmit
  const submitBtn = modalElement.querySelector(".submit-button");
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
        ProductImage: imagePreview.src,
      };

      if (existingData && productContainer) {
      } else {
        await createProduct(formData);
      }

      modal.hide();
      modalElement.addEventListener("hidden.bs.modal", () => {
        modalElement.remove();
      });

      modalElement.remove();

      alert("Product crearted successfully");
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

//  showProductDetail
function showProductDetail(product) {
  const productDetailContainer = document.createElement("div");
  productDetailContainer.className = "product-detail-container mb-4";
  productDetailContainer.id = `product-${product.ProductID}`;

  const badgeClass =
    product.ProductStatus === "Live"
      ? "bg-success"
      : product.ProductStatus === "Pending"
      ? "bg-danger"
      : "bg-warning";

  productDetailContainer.innerHTML = `
    <div class="row text-center align-items-center">
      <div class="col"><div>${product.ProductName}</div></div>
      <div class="col"><span class="badge ${badgeClass}">${
    product.ProductStatus
  }</span></div>
      <div class="col">${product.ProductPrice}</div>
      <div class="col">${product.ProductStock}</div>
      <div class="col">
        ${
          product.ProductImage
            ? `<img src="${product.ProductImage}" 
                alt="${product.ProductName}"
                class="product-thumbnail"
                style="max-width: 100px; cursor: pointer;"
                onerror="this.parentElement.innerHTML='Image Failed to Load'">`
            : '<div class="no-image">No Image</div>'
        }
      </div>
      <div class="col">
        <button type="button" class="p-edit-button"><i class='bx bx-edit'></i></button>
        <button type="button" class="p-delete-button"><i class='bx bx-trash-alt'></i></button>
      </div>
    </div>`;

  setupProductEvents(productDetailContainer, product);
  return productDetailContainer;
}

function setupProductEvents(productContainer, product) {
  const thumbnail = productContainer.querySelector(".product-thumbnail");
  if (thumbnail) {
    thumbnail.addEventListener("click", () =>
      showImageModal(product.ProductImage)
    );
  }

  const editBtn = productContainer.querySelector(".p-edit-button");
  editBtn.addEventListener("click", () =>
    editProductData(product, productContainer)
  );

  const deleteBtn = productContainer.querySelector(".p-delete-button");
  deleteBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(product.ProductID);
        await fetchBoothProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  });
}
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

function showImageModal(imageUrl) {
  const modalHtml = `
    <div class="modal fade" id="imageModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            ${
              imageUrl
                ? `<img src="${imageUrl}" 
                   alt="Product Image" 
                   style="max-width: 100%; height: auto;"
                   onerror="this.parentElement.innerHTML='Image Failed to Load'">`
                : "<div>No Image Available</div>"
            }
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  const modalElement = document.getElementById("imageModal");
  const modal = new bootstrap.Modal(modalElement);

  modal.show();
  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
}

function setupImageUpload(imageInput, imagePreview) {
  imageInput.addEventListener("change", async (e) => {
    try {
      const file = e.target.files[0];
      if (!imageUtils.validateImage(file)) {
        alert("File must be less than 5MB");
        return;
      }

      const base64Data = await imageUtils.readFileAsBase64(file);
      imagePreview.src = base64Data;
      imagePreview.classList.remove("d-none");
      imagePreview.classList.add("d-block");
    } catch (error) {
      alert("Failed to load image");
      console.error(error);
    }
  });
}

// Add Filtration feature
function getCurrentFilter() {
  const activeLink = document.querySelector(".nav-links .nav-link.active");
  return activeLink ? activeLink.textContent : "All";
}

// Add filter functionality
function filterProducts(filterType) {
  console.log("Filtering products with type:", filterType); // Debug log
  console.log("Current products:", products); // Debug log

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

  console.log("Filtered products:", filteredProducts);

  tableBody.innerHTML = "";

  filteredProducts.forEach((product) => {
    const productElement = showProductDetail(product);
    tableBody.appendChild(productElement);
  });

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

// Add Total products functionality
function updateProductTotal(count = null) {
  const total = count !== null ? count : products.length;
  productTotal.textContent = total;
}
// Add navigation to homess
function goBack() {
  window.location.href = "vendor-home.html";
}

// IMG UTILS

const imageUtils = {
  validateImage(file) {
    if (!file) return false;
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  },

  readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};

// Initialization of Page
async function initializePage() {
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
    window.location.href = "localhost:8080/auth/html/index.html";
    return;
  }

  // Load initial data
  await fetchBoothProducts();
  setupEventListeners();
}
document.addEventListener("DOMContentLoaded", () => {
  setupTabNavigation()
  const activeTab = document.querySelector('.nav-link.tab-link.active');
  if (activeTab) {
    activeTab.style.color = '#0d6efd';
    activeTab.style.borderBottom = '2px solid #0d6efd';
  }
  initializePage()
});







// THE ORDERS TAB

// DOM Elements
const pendingOrdersTable = document.querySelector("#pendingOrders tbody");
const completedOrdersTable = document.querySelector("#completedOrders tbody");


// Helper: Get current date with microseconds
function getCurrentDateWithMicroseconds() {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
    const microseconds = (date.getMilliseconds() * 1000).toString().padStart(6, "0");
    return `${formattedDate}.${microseconds}`;
}

// Helper: Get booth ID from session
function getBoothIdFromSession() {
  return sessionStorage.getItem("currentBoothId");
}
// Populate Pending Orders
function populatePendingOrders(boothId) {
    fetch(`http://localhost:3000/orders/reserved/${boothId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then((orders) => {
            pendingOrdersTable.innerHTML = ""; // Clear existing rows
            if (orders.length === 0) {
                pendingOrdersTable.innerHTML = "<tr><td colspan='6'>No pending orders found.</td></tr>";
                return;
            }
            orders.forEach((order) => {
                const row = `
                    <tr>
                        <td>${order.OrderId}</td>
                        <td>${order.ProductName}</td>
                        <td>${order.Quantity}</td>
                        <td>₱${order.TotalPrice}</td>
                        <td>${order.Status}</td>
                        <td><button class="btn btn-sm btn-success" onclick="markAsCompleted('${order.OrderId}')">Complete</button></td>
                    </tr>`;
                pendingOrdersTable.insertAdjacentHTML("beforeend", row);
            });
        })
        .catch((error) => console.error("Error fetching pending orders:", error));
}

// Populate Completed Orders
function populateCompletedOrders(boothId) {
  fetch(`http://localhost:3000/orders/complete/${boothId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
})
    .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then((orders) => {
    completedOrdersTable.innerHTML = ""; // Clear existing rows
    if (completedOrders.length === 0) {
        completedOrdersTable.innerHTML = "<tr><td colspan='6'>No completed orders yet.</td></tr>";
        return;
    }
    orders.forEach((order) => {
        const row = `
            <tr>
                <td>${order.OrderId}</td>
                <td>${order.ProductName}</td>
                <td>${order.Quantity}</td>
                <td>₱${order.TotalPrice}</td>
                <td>${order.Status}</td>
                <td>Completed</td>
                // <td><button class="btn btn-sm btn-danger" onclick="removeCompletedOrder('${order.OrderId}')">Remove</button></td>
            </tr>`;
        completedOrdersTable.insertAdjacentHTML("beforeend", row);
    });
  });
}

// Mark an Order as Completed
function markAsCompleted(orderId) {
    if (!confirm("Mark this order as completed?")) return;

    fetch(`http://localhost:3000/orders/approve/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status: "completed",
            dateCompleted: getCurrentDateWithMicroseconds(),
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(() => {
            updateTables();
        })
        .catch((error) => console.error("Error marking order as completed:", error));
}

// Remove a Completed Order
function removeCompletedOrder(orderId) {
    const index = completedOrders.findIndex((order) => order.orderId === orderId);
    if (index !== -1) {
        completedOrders.splice(index, 1);
        populateCompletedOrders();
    }
}

// Update Tables
function updateTables() {
    const boothID = getBoothIdFromSession();
    console.log("Updating tables with booth Id (orders): " + boothID)
    if (!boothID) {
        console.error("Booth ID is missing or invalid.");
        return;
    }
    populatePendingOrders(boothID);
    populateCompletedOrders(boothID);
}

// Event Handlers for Navigation
function showOrders() {
    document.getElementById("product-section").style.display = "none";
    document.getElementById("orders-section").style.display = "block";
    updateTables();
}

function showProducts() {
    document.getElementById("product-section").style.display = "block";
    document.getElementById("orders-section").style.display = "none";
}

// Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => {
    const boothID = getBoothIdFromSession();
    if (boothID) {
        updateTables();
    } else {
        console.error("No valid booth ID found. Please check session or cookies.");
    }
});
