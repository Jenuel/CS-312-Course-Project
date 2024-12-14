let modal, create, edit, boothImage, inputFile, searchInput, sortSelect;

let boothContainer = document.querySelector(".booth-container");
let productContainer = document.querySelector(".main-container");
let currentBoothId = null;

function createBooth() {
  modal.classList.add("show");
  create.classList.add("open-createBooth");
  edit.classList.remove("open-editBooth");
  document.body.classList.add("modal-open");
}

function closeCreateBooth() {
  modal.classList.remove("show");
  create.classList.remove("open-createBooth");
}

function createBoothFinished() {
  const form = document.getElementById("booth-form");

  if (!form.checkValidity()) {
    form.reportValidity();
    return; // Stop the function if validation fails
  }
  createBoothFunction();
  modal.classList.remove("show");
  create.classList.remove("open-createBooth");
  document.body.classList.remove("modal-open");
}

function showProducts(boothId) {
  sessionStorage.setItem("currentBoothId", boothId);
  window.location.href = "vendor-product.html";
}

// for creating and appending values of a booth

let formData = {
  filter: document.getElementById("filter")?.value || "",
  order: document.getElementById("order") || null,
};

// fetches the data and calls the displaying function
function getData() {
  const searchTerm = searchInput?.value || "";
  const sortOption = sortSelect?.value || "A-Z";

  fetch("http://localhost:8080/php/boothOps/boothRoutes.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("sessionID"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      responseClone = response.clone();
      return response.json();
    })
    .then(
      (data) => {
        if (data.error) {
          console.error("Error:", data.error);
        } else {
          let filteredData = data;

          if (searchTerm) {
            filteredData = data.filter((booth) =>
              booth.Title.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          filteredData.sort((a, b) => {
            if (sortOption === "Z-A") {
              return b.Title.localeCompare(a.Title);
            }
            return a.Title.localeCompare(b.Title);
          });

          console.log("Booths data:", data);
          displayBooths(filteredData);
        }
      },

      function (rejectionReason) {
        // 3
        console.log(
          "Error parsing JSON from response:",
          rejectionReason,
          responseClone
        ); // 4
        responseClone
          .text() // 5
          .then(function (bodyText) {
            console.log(
              "Received the following instead of valid JSON:",
              bodyText
            ); // 6
          });
      }
    )

    .catch((error) => {
      console.error("Request failed", error);
    });
}

// function in appending values to the booth
async function displayBooths(data) {
  const box = document.querySelector(".box"); // where the child will be appended

  box.innerHTML = "";
  data.forEach((value) => {
    let valueDiv = document.createElement("div");
    valueDiv.classList.add("item");

    const imageSrc = value.BoothIcon
      ? `data:image/png;base64,${value.BoothIcon}`
      : "../res/1564534_customer_man_user_account_profile_icon.png";

    valueDiv.innerHTML = `
     <div class="card booth-card">
        <!-- Booth Image -->
        <div class="text-center">
          <img 
            class="card-img-top booth-image p-3" 
            src="${imageSrc}" 
            alt="Booth image"
          >
        </div>

        <!-- Card Content -->
        <div class="card-body d-flex flex-column">
          <h5 class="card-title h5 fw-bold mb-2">
            ${value.Title}
          </h5>
          
          <p class="card-text text-muted mb-3">
            ${value.Description}
          </p>
          
          <!-- Location & Schedule -->
          <div class="booth-info mt-auto">
            <div class="d-flex align-items-center text-secondary mb-2">
              <i class='bx bx-map-pin me-2'></i>
              <span>Location: ${value.Location}</span>
            </div>
            <div class="d-flex align-items-center text-secondary">
              <i class='bx bx-time me-2'></i>
              <span>Schedule: ${value.Schedules}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="card-footer bg-transparent border-top-0">
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-primary btn-sm flex-grow-1" onclick="editBooth(${value.BoothID})">
              <i class="bx bx-edit me-1"></i> EDIT
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm flex-grow-1" onclick="deleteBooth(${value.BoothID})">
              <i class="bx bx-trash me-1"></i> DELETE
            </button>
            <button type="button" class="btn btn-primary btn-sm flex-grow-1" onclick="viewProducts(${value.BoothID})">
              <i class="bx bx-store me-1"></i> PRODUCTS
            </button>
          </div>
        </div>
      </div>`;
    box.appendChild(valueDiv);
  });
}

function showProductsView() {
  boothContainer.style.display = "none";
  if (productContainer) {
    productContainer.style.display = "block";

    // Add back button if it doesn't exist
    if (!document.querySelector("#back-to-booths")) {
      const backButton = document.createElement("button");
      backButton.id = "back-to-booths";
      backButton.innerHTML = `<i class="bx bx-arrow-back"></i> Back to Booths`;
      backButton.className = "btn btn-secondary mb-3";
      backButton.addEventListener("click", showBoothsView);
      productContainer.insertBefore(backButton, productContainer.firstChild);
    }

    // You could load products for the specific booth here
    loadBoothProducts(currentBoothId);
  }
}

function showBoothsView() {
  if (productContainer) {
    productContainer.style.display = "none";
  }
  boothContainer.style.display = "block";
  currentBoothId = null;
}

function viewProducts(boothId) {
  sessionStorage.setItem("currentBoothId", boothId);

  window.location.href = "vendor-product.html";
}

var responseClone; // 1

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// Edit Section
function editBooth(boothId) {
  console.log("Editing Booth: " + boothId);
  modal.classList.add("show");
  edit.classList.add("open-editBooth");
  create.classList.remove("open-createBooth");
  document.body.classList.add("modal-open");

  fetch(`http://localhost:8080/php/boothOps/boothRoutes.php/${boothId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("sessionID"),
    },
  })
    .then((response) => response.json())
    .then((booths) => {
      const booth = booths.find((b) => b.BoothID === boothId);

      console.log(booth);
      if (booth) {
        console.log(booth.Title);
        document.getElementById("edit-name").value = booth.Title;
        document.getElementById("edit-description").value = booth.Description;
        document.getElementById("edit-schedule").value = booth.Schedules;
        document.getElementById("edit-location").value = booth.Location;

        // Store the booth ID for the update operation
        document.getElementById("edit-booth-form").dataset.boothId = boothId;

        if (booth.BoothIcon) {
          document.getElementById("edit-image").src = `data:image/png;base64,${booth.BoothIcon}`;
        } else {
          document.getElementById("edit-image").src = "../res/1564534_customer_man_user_account_profile_icon.png";
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching booth:", error);
      // alert("Error loading booth data");
    });
}

function editBoothFinished() {
  updateBoothFunction();
  modal.classList.remove("show");
  edit.classList.remove("open-editBooth");
  document.body.classList.remove("modal-open");
}
/* ----------------------------------------------------------------------------------------------------- */
//THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER

/**
 * Fetch for updating booth (POST)
 */
async function updateBoothFunction() {
  // console.log(dataset)
  const boothId = document.getElementById("edit-booth-form").dataset.boothId;
  console.log(boothId);
  let imageData = null;
  const imageFile = document.getElementById("edit-input-file");

  if (imageFile && imageFile.files.length > 0) {
    try {
      console.log("True Image exist");
      const base64Data = await getBase64(imageFile.files[0]);
      imageData = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }
  const formData = {
    boothId: boothId,
    title: document.getElementById("edit-name").value,
    description: document.getElementById("edit-description").value,
    schedules: document.getElementById("edit-schedule").value,
    location: document.getElementById("edit-location").value,
    boothIcon: imageData,
    action: "update",
  };

  fetch("http://localhost:8080/php/boothOps/boothRoutes.php", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      responseClone = response.clone();
      return response.json();
    })
    .then(
      (data) => {
        if (data.success) {
          console.log("Booth Updated successfully");
          alert("Booth Updated successfully");
          getData();
        } else {
          console.error(data.error);
          alert(data.error || "Error Updating booth");
        }
      },

      function (rejectionReason) {
        // 3
        console.log(
          "Error parsing JSON from response:",
          rejectionReason,
          responseClone
        ); // 4
        responseClone
          .text() // 5
          .then(function (bodyText) {
            console.log(
              "Received the following instead of valid JSON:",
              bodyText
            ); // 6
          });
      }
    )
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
}

/**
 * Fetch for removing a booth  (DELETE)
 * @param {Integer} boothId
 * @returns
 */
function deleteBooth(boothId) {
  if (!confirm("Are you sure you want to delete this booth?")) {
    return;
  }

  fetch(`http://localhost:8080/php/boothOps/boothRoutes.php/${boothId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (response) => {
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Server response:", text);
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete booth");
      }

      return data;
    })
    .then((data) => {
      if (data.success) {
        alert(data.message || "Booth deleted successfully");
        getData(); // Refresh the booth list
      }
    })
    .catch((error) => {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete booth. Please try again.");
    });
}
/**
 * fetch for creating booth (POST)
 */
async function createBoothFunction() {
  const imageFile = document.getElementById("input-file").files[0];
  let imageData = null;

  if (imageFile) {
    try {
      const base64Data = await getBase64(imageFile);
      imageData = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }
  const formData = {
    title: document.getElementById("name").value,
    description: document.getElementById("description").value,
    schedules: document.getElementById("schedule").value,
    location: document.getElementById("location").value,
    boothIcon: imageData,
  };

  fetch("http://localhost:8080/php/boothOps/boothRoutes.php", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      responseClone = response.clone();
      return response.json();
    })
    .then(
      (data) => {
        if (data.success) {
          console.log("Booth created successfully");
          alert("Booth created successfully");
          getData();
        } else {
          console.error(data.error);
          alert(data.error || "Error creating booth");
        }
      },

      function (rejectionReason) {
        // 3
        console.log(
          "Error parsing JSON from response:",
          rejectionReason,
          responseClone
        ); // 4
        responseClone
          .text() // 5
          .then(function (bodyText) {
            console.log(
              "Received the following instead of valid JSON:",
              bodyText
            ); // 6
          });
      }
    )
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
}

function logout() {
  fetch("/php/auth/logout.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "logout=true",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        window.location.href = "/auth/html/index.html";
      } else {
        throw new Error(data.message || "Logout failed");
      }
    })
    .catch((error) => {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    });
}
// END FOR FETCH FUNCTIONS
/* ----------------------------------------------------------------------------------------------------- */

function loadPage(page) {
  // for changing pages in navigation
  const pageFrame = document.getElementById("page-frame");
  const boothContent = document.getElementById("booth-content");

  switch (page) {
    case "home":
      boothContent.classList.add("active");
      pageFrame.style.display = "none";
      getData(); // Refresh
      break;

    case "sales":
      boothContent.classList.remove("active");
      pageFrame.style.display = "block";
      pageFrame.style.height = "100%";
      pageFrame.style.width = "100%";
      pageFrame.style.minHeight = "calc(100vh - 56px)"; // Account for navbar
      pageFrame.style.border = "none";
      pageFrame.src = "../html/vendor-sales.html";
      break;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  modal = document.querySelector(".modal-backdrop");
  create = document.getElementById("create");
  edit = document.getElementById("edit");
  boothImage = document.getElementById("image");
  inputFile = document.getElementById("input-file");
  const editInputFile = document.getElementById("edit-input-file");
  const editImage = document.getElementById("edit-image");

  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.remove("show");
      create.classList.remove("open-createBooth");
      edit.classList.remove("open-editBooth");
    }
  });

  inputFile.onchange = function () {
    boothImage.src = URL.createObjectURL(inputFile.files[0]);
  };

  editInputFile.onchange = function () {
    editImage.src = URL.createObjectURL(editInputFile.files[0]);
  };

  searchInput = document.querySelector(".searchbox");
  sortSelect = document.getElementById("sortDropdown");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      getData();
    });
  }

  // Update your dropdown click handlers
  const sortLinks = document.querySelectorAll(".dropdown-item");
  sortLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sortValue = e.target.textContent; // This will be "A-Z" or "Z-A"
      sortSelect.textContent = `Sort By: ${sortValue}`;
      sortSelect.value = sortValue; // Store the sort value
      getData();
    });
  });

  loadPage("home");
  getData();
});
