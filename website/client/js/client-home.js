
// let formData = {

//     filter: document.getElementById("filter").value,
//     order: document.getElementById("order")

// };

function openProfile() {
    const profile = document.getElementById("profile");
    profile.classList.add("open-profile");
}


function closeProfile() {
    const profile = document.getElementById("profile");
    profile.classList.remove("open-profile");
}

//fetches the data and calls the display function when success
// function getData() {
//     fetch('http://localhost/CS-312-Course-Project/backend/php/boothOps/boothRoutes.php', {
//         method: 'GET',
//         mode: 'no-cors',
//         headers: {
//             'Content-Type': 'application/json',
//         },

//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data.error) {
//             console.error('Error:', data.error);
//         } else {
//             console.log('Booths data:', data);
//             displayBooths(data);
//         }
//     })
//     .catch(error => {
//         console.error('Request failed', error);
//     });
// }

function displayBooths() {
    const box = document.querySelector(".booths-container");
    box.innerHTML = ""; // Clear existing items
    for (let i = 0; i < 6; i++) { // Example: Add 6 booths
        const valueDiv = document.createElement("div");
        valueDiv.classList.add("box");
        valueDiv.innerHTML = `
        <a href="client-products.html" class="box">
            <div class="booth-header">
                <h2>Booth ${i + 1} and pic</h2>
            </div>
            <div class="booth status">
                <p class="label">STATUS</p>
                <p class="content">Active</p>
            </div>
            <div class="booth schedule">
                <p class="label">SCHEDULE</p>
                <p class="content">:  asdasd</p>
            </div> 
            <div class="booth location">
                <p class="label">LOCATION</p>
                <p class="content">:  asdada</p>
            </div>
            <div class="booth description">
                <p class="label">DESCRIPTION</p>
                <p class="content">:  asdasd</p>
            </div>   
        </a>       `;
        box.appendChild(valueDiv); // Append to the container
    }
}

// let box = document.querySelector(".booths-container"); // where the child will be appended

// function displayBooths(){
//     box.innerHTML = "";
//         let valueDiv = document.createElement('div'); 
//         valueDiv.classList.add('item');
//         // creating the information of the booth
//         valueDiv.innerHTML = `
//         <a href="client-products.html" class="link">
//         <div class="box">
//             <div class="booth-header">
//                 <h2>dito pic and title</h2>                
//             </div>
//             <div class="booth status">
//                 <p class="label">STATUS</p>
//                 <p class="content">:  asdasda</p>
//             </div>
//             <div class="booth schedule">
//                 <p class="label">SCHEDULE</p>
//                 <p class="content">:  asdasd</p>
//             </div>   
//             <div class="booth location">
//                 <p class="label">LOCATION</p>
//                 <p class="content">:  asdada</p>
//             </div>     
//             <div class="booth description">
//                 <p class="label">DESCRIPTION</p>
//                 <p class="content">:  asdasd</p>
//             </div>    
//         </div>
//         </a>
//         <a href="client-products.html" class="link">
//         <div class="box">
//             <div class="booth-header">
//                 <h2>dito pic and title</h2>                
//             </div>
//             <div class="booth status">
//                 <p class="label">STATUS</p>
//                 <p class="content">:  asdasda</p>
//             </div>
//             <div class="booth schedule">
//                 <p class="label">SCHEDULE</p>
//                 <p class="content">:  asdasd</p>
//             </div>   
//             <div class="booth location">
//                 <p class="label">LOCATION</p>
//                 <p class="content">:  asdada</p>
//             </div>     
//             <div class="booth description">
//                 <p class="label">DESCRIPTION</p>
//                 <p class="content">:  asdasd</p>
//             </div>    
//         </div>
//         </a>
//                 `;
//         box.appendChild(valueDiv); // appending the child to "box"
// }

// getData();
displayBooths();