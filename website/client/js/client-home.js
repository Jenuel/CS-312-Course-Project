let box = document.querySelector(".booth-container"); // where the child will be appended


let formData = {
    filter: document.getElementById("filter").value,
    order: document.getElementById("order")
};
/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER


/**
 * Fetch for retriveing booths (GET)
 */
function getData() {
    fetch('http://localhost:8080/php/boothOps/boothRoutes.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },

    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if there's a response body before parsing
        if (response.headers.get("content-length") === "0") {
            return null; // No content
        }

        return response.json();
    })
    .then(data => {
        if (data) {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                console.log('Booths data:', data);
                displayBooths(data);
            }
        } else {
            console.warn('Empty response from server');
        }
    })
    .catch(error => {
        console.error('Request failed', error);
    });
}

//END FOR FETCH FUNCTIONS
/* ----------------------------------------------------------------------------------------------------- */


function displayBooths(booths){
    box.innerHTML = "";
    booths.forEach((value) => { 
        let valueDiv = document.createElement('div'); 
        valueDiv.classList.add('item');
        // creating the information of the booth
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
                <p class="content">:  ${value.Description}</p>
            </div>    
        </div>`;

        valueDiv.addEventListener('click', function() {
            window.location.href = `boothDetails.html?id=${value.id}`;
        });

        box.appendChild(valueDiv); // appending the child to "box"
    })
}

getData();