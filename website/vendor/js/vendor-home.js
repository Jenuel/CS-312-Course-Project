let create = document.getElementById("create");
let edit = document.getElementById("edit");

//opens popup in creating a booth
function createBooth() {
    create.classList.add("open-createBooth");
    edit.classList.remove("open-editBooth"); // Ensure edit is hidden
}

//closes popup in creating a booth
function createBoothFinished() {
    create.classList.remove("open-createBooth");
}

//opens popup in editing a booth
function editBooth() {
    edit.classList.add("open-editBooth"); // Show edit section
    create.classList.remove("open-createBooth"); // Ensure create is hidden
}

//closes popup in editing a booth
function editBoothFinished() {
    edit.classList.remove("open-editBooth");
}

//for changing image of booth
let boothImage = document.getElementById("image");
let inputFile = document.getElementById("input-file");

inputFile.onchange = function() {
    boothImage.src = URL.createObjectURL(inputFile.files[0]);
}

//for creating and appending values of a booth
let box = document.querySelector(".box"); // where the child will be appended

// fetches the data and calls the displaying function
function getData() {
    fetch('../../../backend/php/auth/boothRoutes.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('sessionID')  
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

// function in appending values to the booth
function displayBooths(){
    booths.forEach((value) => { // loops through the array of objects
        let valueDiv = document.createElement('div'); // creates new div
        valueDiv.classList.add('item'); // new class called item

        // creating the information of the booth
        valueDiv.innerHTML = `
            <div class="booth-header">
                <h2>${value.boothName}</h2>
            </div>
            <div class="booth-description">
                <p>${value.description}</p>
            </div>
            <div class="buttons">
                <button type="button" id="edit-button" onclick="editBooth()">EDIT</button>
                <button type="button" id="delete-button">DELETE</button>
            </div>`;
        box.appendChild(valueDiv); // appending the child to "box"
    })
}

function createBoothFunction() { //integrate it to create function button
    const formData = {
        title: document.getElementById('').value,
        description: document.getElementById('').value,
        schedules: document.getElementById('').value,
        location: document.getElementById('').value,
        boothIcon: null,//document.getElementById('').value, FOR NOW
        status: null, //document.getElementById('').value, FOR NOW
    };

    fetch('../../../backend/php/auth/boothRoutes.php', {
        method: 'POST',
        body: JSON.stringify(formData), 
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Booth created successfully");
            alert("Booth created successfully");
        } else {
            console.error(data.error);
            alert(data.error || 'Error creating booth');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

getData();