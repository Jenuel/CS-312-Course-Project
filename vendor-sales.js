google.charts.load("current", { packages: ["line"] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn("number", "Day");
    data.addColumn("number", "Sales");
    data.addColumn("number", "Revenue");
    data.addColumn("number", "Customer");

    data.addRows([
      [1, 37.8, 80.8, 41.8],
      [2, 30.9, 69.5, 32.4],
      [3, 25.4, 57, 25.7],
      [4, 11.7, 18.8, 10.5],
      [5, 11.9, 17.6, 10.4],
      [6, 8.8, 13.6, 7.7],
      [7, 7.6, 12.3, 9.6],
      [8, 12.3, 29.2, 10.6],
      [9, 16.9, 42.9, 14.8],
      [10, 12.8, 30.9, 11.6],
      [11, 5.3, 7.9, 4.7],
      [12, 6.6, 8.4, 5.2],
      [13, 4.8, 6.3, 3.6],
      [14, 4.2, 6.2, 3.4],
    ]);

    var options = {
      chart: {
        title: "Sales Demographic of Booths",
        subtitle: "Accumulated data"
      },
      width: "100%",
      height: 500,
      backgroundColor: "inherit" ,
      chartArea: { backgroundColor: "inherit" }
    };

              var chart = new google.charts.Line(
                document.getElementById("linechart_material")
              );

              chart.draw(data, google.charts.Line.convertOptions(options));
            }

/*THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER */

function getCompletedOrder(boothID){ // use data to create statisitics
  
  fetch(`http://localhost:3000/orders/complete/${boothID}`,{// change this one
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
    /*
    sample output of data:[
  {
    "order id": 1,
    "Total Price": 500.00,
    "Status": "Complete",
    "Product Quantity": 2,
    "Product Name": "Apple"
  },
  {
    "order id": 2,
    "Total Price": 300.00,
    "Status": "Complete",
    "Product Quantity": 1,
    "Product Name": "Orange"
  }
]


    */

  const orderDetails = data.map((order) => ({
    orderId: order["order id"],
    status: order["Status"],
  }));
       console.log("Products fetched successfully:", data);
       // add handling of data
   })
   .catch(error => {
       console.error("Error fetching products:", error);
   });
}