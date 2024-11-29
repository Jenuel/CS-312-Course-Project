let box = document.querySelector(".booth-container"); // where the child will be appended


/*
let formData = {

    filter: document.getElementById("filter").value,
    order: document.getElementById("order")
};
*/

//fetches the data and calls the display function when success
function getData() {
    fetch('http://localhost:8080/boothOps/boothRoutes.php', {
        method: 'GET',
        //mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },

    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            console.log('Booths data:', data);
            displayBooths(data);
        }
    })
    .catch(error => {
        console.error('Request failed', error);
    });
}

function displayBooths(booths){
    box.innerHTML = "";
    booths.forEach((value) => { 
        let valueDiv = document.createElement('div'); 
        valueDiv.classList.add('item');
        // creating the information of the booth
        valueDiv.innerHTML = `
        <div class="box">
            <div class="booth-header">
                <h2>${value.Title}</h2>                
            </div>
            <div class="booth status">
                <p class="label">STATUS</p>
                <p class="content">:  ${value.Status}</p>
            </div>
            <div class="booth schedule">
                <p class="label">SCHEDULE</p>
                <p class="content">:  ${value.Schedule}</p>
            </div>   
            <div class="booth location">
                <p class="label">LOCATION</p>
                <p class="content">:  ${value.Location}</p>
            </div>     
            <div class="booth description">
                <p class="label">DESCRIPTION</p>
                <p class="content">:  ${value.Description}</p>
            </div>    
        </div>`;
        box.appendChild(valueDiv); // appending the child to "box"
    })
}

getData();