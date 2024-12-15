const API_BASE_URL = "10.241.155.155";
function logout() {
  fetch(
    `${API_BASE_URL}/php/auth/logout.php` +
      new URLSearchParams({
        logout: "true",
      }).toString(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then(
      (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          window.location.href = `http://${API_BASE_URL}:8080/auth/html/index.html`;
        }

        responseClone = response.clone();
        return response.json();
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
