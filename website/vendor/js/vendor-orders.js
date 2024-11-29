
/*
 
 */
 function getPendingOrdes() {
     fetch(`https://<your-domain>/pending`, {
         method: 'GET',
         headers: {
             'Content-Type': 'application/json', 
         },
         body: JSON.stringify({ status: 'cancelled' }),
     })
     .then(response => {
         if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
         }
         return response.json();
     })
     .then(data => {
         console.log("retrived pending orders successfully:", data);
     })
     .catch(error => {
         console.error("Error retrivieng pending orders:", error);
     });
 }
 
 /*
 
 */
 function getCompletedOrders(boothID,) {
    fetch(`https://<your-domain>/complete/:${boothID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ status: 'cancelled' }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("retrived completed orders successfully:", data);
    })
    .catch(error => {
        console.error("Error retrivieng completed orders:", error);
    });
}
/*
 
 */
function approveOrder(orderId,payementDate) {
    const data = {
        datePaid:payementDate 
    }
    fetch(`https://<your-domain>/approve/:${orderId}`, {
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
    })
    .catch(error => {
        console.error("Error retrivieng pending orders:", error);
    });
}