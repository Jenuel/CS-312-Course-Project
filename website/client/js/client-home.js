let box = document.querySelector(".booth-container"); // where the child will be appended

//fetches the data and calls the display function when success
function getData() {
    fetch('../../../backend/php/auth/boothRoutes.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())  
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

function displayBooths(){
    booths.forEach((value) => { 
        let valueDiv = document.createElement('div'); 
        valueDiv.classList.add('item');
        // creating the information of the booth
        valueDiv.innerHTML = `
        <div class="box">
            <div class="booth-header">
                <h2>${value.boothName}</h2>                
            </div>
            <div class="booth status">
                <p class="label">STATUS</p>
                <p class="content">:  ${value.status}</p>
            </div>
            <div class="booth schedule">
                <p class="label">SCHEDULE</p>
                <p class="content">:  ${value.schedule}</p>
            </div>   
            <div class="booth location">
                <p class="label">LOCATION</p>
                <p class="content">:  ${value.location}</p>
            </div>     
            <div class="booth description">
                <p class="label">DESCRIPTION</p>
                <p class="content">:  ${value.description}</p>
            </div>    
        </div>`;
        box.appendChild(valueDiv); // appending the child to "box"
    })
}

getData();