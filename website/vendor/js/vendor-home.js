let modal, create, edit, boothImage, inputFile;

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
  createBoothFunction();
  modal.classList.remove("show");
  create.classList.remove("open-createBooth");
  document.body.classList.remove("modal-open");
}

// function loadProduct() {
//   const pageFrame = document.getElementById("page-frame");
//   const boothContent = document.getElementById("booth-content");

//   boothContent.classList.remove("active");
//   pageFrame.style.display = "block";
//   pageFrame.src = "../html/vendor-product.html";
// }

function showProducts(boothId) {
  sessionStorage.setItem("currentBoothId", boothId);
  window.location.href = "vendor-product.html";
}

//for creating and appending values of a booth



let formData = {
  filter: document.getElementById("filter")?.value || "",
  order: document.getElementById("order") || null,
};

// fetches the data and calls the displaying function
function getData() {
  fetch(
    "http://localhost:8080/php/boothOps/boothRoutes.php",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("sessionID"),
      },
    }
  )
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
          console.log("Booths data:", data);
          displayBooths(data);
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

    valueDiv.innerHTML =`
    <div class="card booth-card" style="width: 18rem;">
      <img class="card-img-top" src="${imageSrc}" alt="Booth image" style="height: 200px; object-fit: cover;">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${value.Title}</h5>
        <div class="description-container">
          <p class="card-text">${value.Description}</p>
        </div>
        <div class="booth-info mt-auto">
          <p class="card-text">
            <small class="text-muted">
              Location: ${value.Location}<br>
              Schedule: ${value.Schedules}
            </small>
          </p>
        </div>
      </div>
      <div class="card-footer">
        <div class="d-flex justify-content-between ">
          <button type="button" class="btn btn-outline-primary btn-sm" onclick="editBooth(${value.BoothID})">
            <i class="bx bx-edit"></i> EDIT
          </button>
          <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteBooth(${value.BoothID})">
            <i class="bx bx-trash"></i> DELETE
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="products-button" onclick="viewProducts(${value.BoothID})">
            <i class="bx bx-store"></i> PRODUCTS
          </button>
        </div>
      </div> 
    </div>`;;
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
  console.log(boothId)
  modal.classList.add("show");
  edit.classList.add("open-editBooth");
  create.classList.remove("open-createBooth");
  document.body.classList.add("modal-open");

  fetch(
    `http://localhost:8080/php/boothOps/boothRoutes.php/${boothId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("sessionID"),
      },
    }
  ).then(response => response.json()).then(booths => {

    const booth = booths.find(b => b.BoothID === boothId);
    


  
    console.log(booth)
    if(booth){
      document.getElementById('edit-name').value = booth.Title;
      console.log(booth.Title.value)
      document.getElementById('edit-description').value = booth.Description;
      document.getElementById('edit-schedule').value = booth.Schedules;
      document.getElementById('edit-location').value = booth.Location;
      
      // Store the booth ID for the update operation
      document.getElementById('edit-booth-form').dataset.boothId = boothId;
      
      if (booth.BoothIcon) {
        document.getElementById('edit-image').src = `data:image/png;base64,${booth.BoothIcon}`;
      }
    }

  })
  .catch(error => {
    console.error('Error fetching booth:', error);
    alert('Error loading booth data');
  })
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
  const boothId = document.getElementById('edit-booth-form').dataset.boothId;
  console.log(boothId)
  let imageData = null;
  const imageFile = document.getElementById("edit-input-file");


  if (imageFile && imageFile.files.length > 0 ) {
    try {
      console.log("True Image exist")
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
    action: "update"
  };

  fetch(
    "http://localhost:8080/php/boothOps/boothRoutes.php",
    {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
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
  if (!confirm('Are you sure you want to delete this booth?')) {
      return;
  }

  fetch(
      `http://localhost:8080/php/boothOps/boothRoutes.php/${boothId}`,
      {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + sessionStorage.getItem("sessionID")
          },
      }
  )
  .then(response => {
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      return response.json();
  })
  .then(data => {
      if (data.success) {
          alert("Booth deleted successfully");
          getData(); // Refresh the booth list
      } else {
          throw new Error(data.error || "Error deleting booth");
      }
  })
  .catch(error => {
      console.error("Error:", error);
      alert(error.message || "An error occurred while deleting the booth");
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

  fetch(
    "http://localhost:8080/php/boothOps/boothRoutes.php",
    {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
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
      
    case "orders":
      boothContent.classList.remove("active");
      pageFrame.style.display = "block";
      pageFrame.src = "../html/vendor-orders.html"; // wala pa
      break;

    case "sales":
      boothContent.classList.remove("active");
      pageFrame.style.display = "block";
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

  loadPage("home");
  getData();
});