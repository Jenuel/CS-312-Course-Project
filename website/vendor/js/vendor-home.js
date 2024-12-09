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

function editBooth() {
  modal.classList.add("show");
  edit.classList.add("open-editBooth");
  create.classList.remove("open-createBooth");
  document.body.classList.add("modal-open");
}

function editBoothFinished() {
  modal.classList.remove("show");
  edit.classList.remove("open-editBooth");
  document.body.classList.remove("modal-open");
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

function checkLogin() {
  fetch(
    "http://localhost/CS-312-Course-Project/backend/php/userOps/checkSession.php",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn || data.role !== "vendor") {
        window.location.href = "../html/login.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      window.location.href = "../html/login.html";
    });
}

let formData = {
  filter: document.getElementById("filter")?.value || "",
  order: document.getElementById("order") || null,
};

// fetches the data and calls the displaying function
function getData() {
  fetch(
    "http://localhost/CS-312-Course-Project/backend/php/boothOps/boothRoutes.php/",
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

    valueDiv.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${imageSrc}" alt="Booth image" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${value.Title}</h5>
                <p class="card-text">${value.Description}</p>
                <p class="card-text">
                    <small class="text-muted">
                        Location: ${value.Location}<br>
                        Schedule: ${value.Schedules}
                    </small>
                </p>
            </div>
            <div class="card-footer">
             <button type="button" class="btn btn-outline-primary btn-sm px-1 py-1" onclick="editBooth()">
                    <i class="bx bx-edit"></i> EDIT
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm px-1 py-1">
                    <i class="bx bx-trash"></i> DELETE
                </button>
                <button type="button" class="btn btn-primary btn-sm px-1 py-1 mt-12" id="products-button" onclick="viewProducts(${value.BoothID})">
                    <i class="bx bx-store"></i> PRODUCTS
                </button>
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
    status: null, //document.getElementById('').value, FOR NOW
  };

  fetch(
    "http://localhost/CS-312-Course-Project/backend/php/boothOps/boothRoutes.php",
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

    case "products":
      boothContent.classList.remove("active");
      pageFrame.style.display = "block";
      pageFrame.src = "../html/vendor-product.html";
      break;

    case "orders":
      boothContent.classList.remove("active");
      pageFrame.style.display = "block";
      pageFrame.src = "../htmlvendor-orders.html"; // wala pa
      break;

    case "sales":
      boothContent.classList.remove("active");
      pageFrame.style.display = "block";
      pageFrame.src = "../html/vendor-sales.html"; // wala pa
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
