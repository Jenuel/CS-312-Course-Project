const API_BASE_URL = "http://10.241.155.155";

// Retrieve the parameters from the URL

const urlParams = new URLSearchParams(window.location.search);
let boothId = 0;

/*
checking value in url parameter
*/
if (urlParams.get("boothId") === "none") {
  const customerId = localStorage.getItem("id"); // get customer id

  const hasCart = getCart(customerId); //  result of getCart

  if (hasCart) {
    // a pedning order exists
    console.log("customer has existing cart");
  } else {
    window.location.href = `htpp://${API_BASE_URL}:8080/client/html/client-home.html`;
  }
} else {
  // boothId = urlParams.get('boothId');
  boothId = localStorage.getItem("BoothId");
}
/*
helper for remove item function
*/
function getOrderId() {
  let orderId =
    localStorage.getItem("OrderId") ||
    localStorage.getItem("orderId") ||
    localStorage.getItem("OrderID");
  console.log("Current Order ID:", orderId);
  return orderId;
}

function displayCart(cartItems) {
  const cartList = document.getElementById("purchase-list");
  if (!cartList) {
    console.error("Cart list container (purchase-list) not found in DOM");
    return;
  }

  cartList.innerHTML = "";
  let runningTotal = 0;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
            <td colspan="7" class="text-center">Your cart is empty</td>
        `;
    cartList.appendChild(emptyRow);
    updateCartTotal(0);
    return;
  }

  cartItems.forEach((item, index) => {
    const itemTotal = item.quantity * item.price;
    runningTotal += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>
                <img src="${
                  item.image
                    ? `data:image/png;base64,${item.image}`
                    : "https://via.placeholder.com/50"
                }" 
                     alt="${item.productName || "Product Image"}" 
                     class="img-fluid" 
                     style="max-height: 50px; max-width: 50px;">
            </td>
            <td>${item.productName || "Unknown Product"}</td>
            <td>
                <input type="number" 
                       class="form-control form-control-sm quantity-input" 
                       value="${item.quantity || 1}" 
                       min="1" 
                       onchange="updateCartItem(${getOrderId},${
      item.productID
    }, this.value, )"
                       data-product-id="${item.productID}">
            </td>
            <td class="text-end">₱${parseFloat(item.price).toFixed(2)}</td>
            <td class="text-end">₱${itemTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm w-100" 
                        onclick="removeCartItem(${item.productID})">
                    Remove
                </button>
            </td>
        `;
    cartList.appendChild(row);
  });

  updateCartTotal(runningTotal);
}

// function updateCartItem(productId, newQuantity) {
//     let orderId = localStorage.getItem('OrderId') || localStorage.getItem('orderId');
//     if (!orderId) {
//         console.error("No order ID found");
//         return;
//     }

//     const quantity = parseInt(newQuantity);
//     if (isNaN(quantity) || quantity < 1) {
//         alert("Please enter a valid quantity");
//         return;
//     }

//     fetch(`${API_BASE_URL_NODE}/orders/updateQuantity/${orderId}/${productId}`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ quantity: quantity })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Refresh the cart to show updated totals
//         const localStorageId = localStorage.getItem('id');
//         if (localStorageId) {
//             getCart(localStorageId);
//         }
//     })
//     .catch(error => {
//         console.error("Error updating cart item:", error);
//         alert("Failed to update item quantity. Please try again.");
//     });
// }

function updateCartTotal(input) {
  const cartTotalElement = document.getElementById("cart-total");
  if (!cartTotalElement) {
    console.error("Cart total element not found.");
    return;
  }

  let total = 0;
  if (Array.isArray(input)) {
    // If input is an array of cart items, calculate total from item details
    total = input.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      return sum + itemTotal;
    }, 0);
  } else {
    // If input is already a total number (like grandTotal from API)
    total = parseFloat(input) || 0;
  }

  cartTotalElement.textContent = total.toFixed(2);
}

function cancelOrders() {
  cancelOrder(orderID);
}

/*
Helper method to retrive date in YYYY-MM-DD HH:MM:SS'
*/
const getCurrentDateWithMicroseconds = () => {
  const date = new Date();

  // Get the date in the format 'YYYY-MM-DD HH:MM:SS'
  let formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

  // Get microseconds (using a simple approximation as JavaScript doesn't have built-in microsecond precision)
  const microseconds = (date.getMilliseconds() * 1000)
    .toString()
    .padStart(6, "0");

  // Add microseconds to the date
  return `${formattedDate}.${microseconds}`;
};

function openProfile() {
  const profile = document.getElementById("profile");
  profile.classList.add("open-profile");
}

// Close profile form popup
function closeProfile() {
  const profile = document.getElementById("profile");
  profile.classList.remove("open-profile");
}

/* -------------------------------------Fetch Functions------------------------------------- */

/**
 * Fetch for order cancelation (PATCH)
 * @param {Integer} orderId
 */
function cancelOrder(orderId) {
  fetch(`http://${API_BASE_URL}:3000/orders/cancel/${orderId}`, {
    // URL for Cancel order
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "cancelled" }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // data is a json massgae no parsing needed
      console.log("Order cancelled successfully:", data);
    })
    .catch((error) => {
      console.error("Error cancelling order:", error);
    });
}

/*
funtion for checking out products
- product stocks  are now removed in porduct table and updated in inventory table
FROM: productController.js
*/
function checkoutProducts() {
  const date = getCurrentDateWithMicroseconds();
  let orderID =
    localStorage.getItem("OrderId") || localStorage.getItem("orderId");

  if (!orderID) {
    console.error("No order ID found");
    alert("No active order found. Please add items to your cart first.");
    return;
  }

  // Change the endpoint to use the products/buy endpoint instead of orders/complete
  fetch(`http://${API_BASE_URL}:3000/products/buy/${orderID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ datePaid: date }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }

      // Clear the cart display
      const cartList = document.getElementById("purchase-list");
      if (cartList) {
        cartList.innerHTML = "";
      }

      // Reset totals
      const totalElement = document.getElementById("cart-total");
      if (totalElement) {
        totalElement.textContent = "0.00";
      }

      // Clear all relevant localStorage items
      localStorage.removeItem("OrderId");
      localStorage.removeItem("orderId");
      localStorage.removeItem("BoothId");
      localStorage.removeItem("boothId");

      alert("Order completed successfully!");

      // Redirect to home page
      window.location.href = "client-home.html";
    })
    .catch((error) => {
      console.error("Error completing order:", error);
      alert(`Failed to complete order: ${error.message}`);
    });
}

/*
funtion for creating new order by a customer
FROM: orderController.js
*/
function createOrder(boothID, data, totalPrice, customerId) {
  // PLEASE EXPLAIN HOW THIS IS USED
  alert("This is your current Bopth ID upon order " + boothID);
  const formattedProducts = data.map((entry) => {
    const [productID, quantity, totalPricePerProduct] = entry.split(",");
    return {
      productID: parseInt(productID, 10),
      quantity: parseInt(quantity, 10),
      totalPricePerProduct: parseFloat(totalPricePerProduct).toFixed(2),
    };
  });

  const payload = {
    products: formattedProducts,
    totalPrice: parseFloat(totalPrice),
    date: new Date().toISOString().slice(0, 19).replace("T", " "),
    customerId: parseInt(customerId),
    status: "Pending", // Explicitly set status as Pending
  };

  fetch(`http://${API_BASE_URL}:3000/orders/create/${boothID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((err) => {
          throw new Error(err);
        });
      }
      return response.json();
    })
    .then((orderData) => {
      console.log("Order created successfully:", orderData);
      // Store the order ID in localStorage rather than sessionStorage
      localStorage.setItem("OrderId", orderData.id);
      // Refresh the cart display
      getCart(customerId);
    })
    .catch((error) => {
      console.error("Error creating order:", error);
      alert(`Error creating order: ${error.message}`);
    });
}

/*
use to get ordered that are in reserves status of a customer
FROM: orderController.js
*/
function getCart(customerId) {
  const cartList = document.getElementById("purchase-list");
  const cartTotal = document.getElementById("cart-total");

  if (!cartList || !cartTotal) {
    console.error("Required DOM elements not found:", {
      cartList: !!cartList,
      cartTotal: !!cartTotal,
    });
  }
  const cid = parseInt(customerId);
  if (isNaN(cid)) {
    console.error("Invalid customer ID");
    return;
  }

  fetch(`http://${API_BASE_URL}:3000/orders/checkReservedOrder/${cid}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        console.error("Error:", data.error);
        return;
      }

      if (!Array.isArray(data) || data.length === 0) {
        displayCart([]); // Show empty cart
        return;
      }

      // Map the API response to the format expected by `displayCart`
      const cartItems = data.map((product) => ({
        productID: product.productID,
        productName: product.productName || "Unknown Product",
        image: product.productImage,
        quantity: product.quantity,
        price: parseFloat(product.productPrice),
        total: parseFloat(product.totalPricePerProduct),
      }));

      // Store data with consistent key names
      if (data[0]) {
        localStorage.setItem("OrderId", data[0].orderID);
        localStorage.setItem("BoothId", data[0].boothID);
      }
      displayCart(cartItems);
      if (cartTotal && data[0]) {
        updateCartTotal(data[0].grandTotal);
      }
    })
    .catch((error) => {
      console.error("Error fetching cart items:", error);
      alert("Failed to load cart items. Please try again.");
    });
}

/*
remove's an item in and order witha  status of reserved
FROM:orderController.js
*/
function removeCartItem(productId) {
  let orderId = getOrderId();

  if (!orderId) {
    console.error("No order ID found in localStorage:", localStorage);
    alert("Could not find your order. Please refresh the page and try again.");
    return;
  }

  if (!confirm("Are you sure you want to remove this item from your cart?")) {
    return;
  }

  console.log(`Removing product ${productId} from order ${orderId}`);

  fetch(
    `http://${API_BASE_URL}:3000/orders/removeItem/${orderId}/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject(err));
      }
      return response.json();
    })
    .then((data) => {
      console.log("Remove item response:", data);

      if (data.isEmpty) {
        // Clear all order-related storage
        localStorage.removeItem("OrderId");
        localStorage.removeItem("orderId");
        localStorage.removeItem("OrderID");
        localStorage.removeItem("BoothId");

        window.location.href = "client-home.html";
      } else {
        const localStorageId = localStorage.getItem("id");
        if (localStorageId) {
          getCart(localStorageId);
        }
      }
    })
    .catch((error) => {
      console.error("Error removing item:", error);
      alert("Failed to remove item from cart. Please try again.");
    });

  getCart(localStorage.getItem("Customer ID"));
}

/*
function for updating quantitity of a product in a cart
(cart is an order with a reserved status)
FROM: orderController.js
*/
function updateCartItem(orderId, productIdValue, quantityValue) {
  //data= ["productIDvalue,quantityvalue","1,3", "2,5"]

  //   orderId = localStorage.getItem("OrderId") || localStorage.getItem("orderId");
  if (!orderId) {
    console.error("No order ID found");
    return;
  }
  if (isNaN(parseInt(productIdValue)) || isNaN(parseInt(quantityValue))) {
    console.error("Invalid productID or quantity");
    return;
  }

  const data = {
    products: [
      {
        productID: parseInt(productIdValue),
        quantity: parseInt(quantityValue),
      },
    ],
  };

  fetch(`http://${API_BASE_URL}:3000/orders/alterOrder/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Refresh the cart to show updated totals
      const localStorageId = localStorage.getItem("id");
      if (localStorageId) {
        getCart(localStorageId);
      }
    })
    .catch((error) => {
      console.error("Error updating cart item:", error);
      alert("Failed to update item quantity. Please try again.");
    });

  getCart(localStorage.getItem("Customer ID")); // change key name
}

/* -------------------------------------End Fetch Functions------------------------------------- */

getCart(localStorage.getItem("id"));

/*
logout
*/
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

  localStorage.setItem("Status", "client-purchases.html"); // adding status
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  // Get and display cart items immediately
  const localStorageId = localStorage.getItem("id");
  if (localStorageId) {
    getCart(localStorageId);
  }
});
