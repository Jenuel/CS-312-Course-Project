let create = document.getElementById("create");
let edit = document.getElementById("edit");

//opens popup in creating a booth
function createBooth() {
    create.classList.add("open-createBooth");
    edit.classList.remove("open-editBooth"); // Ensure edit is hidden
}

//closes popup in creating a booth
function createBoothFinished() {
    createBoothFunction();
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

function closeCreateBooth() {
    create.classList.remove("open-createBooth");  
}


let formData = {

    filter: document.getElementById("filter").value,
    order: document.getElementById("order")

};


// fetches the data and calls the displaying function
function getData() {
    fetch('http://localhost/php/boothOps/boothRoutes.php/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('sessionID')  
        },


    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        responseClone = response.clone()
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            console.log('Booths data:', data);
            displayBooths(data);
        }

        
    },

    function (rejectionReason) { // 3
        console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
        responseClone.text() // 5
        .then(function (bodyText) {
            console.log('Received the following instead of valid JSON:', bodyText); // 6
        });

    })

   
    .catch(error => {
        console.error('Request failed', error);
    });
}

// function in appending values to the booth
function displayBooths(data){
    box.innerHTML = "";
    data.forEach((value) => { // loops through the array of objects
        let valueDiv = document.createElement('div'); // creates new div

        valueDiv.classList.add('item'); // new class called item
        // creating the information of the booth
        valueDiv.innerHTML = `
            <div class="booth-header">
                <h2>${value.Title}</h2>
            </div>
            <div class="booth-description">
                <p>${value.Description}</p>
            </div>
            <div class="buttons">
                <button type="button" id="edit-button" onclick="editBooth()">EDIT</button>
                <button type="button" id="delete-button">DELETE</button>
            </div>`;
        box.appendChild(valueDiv); // appending the child to "box"
    })

}

var responseClone; // 1

function createBoothFunction() { //integrate it to create function button
    const formData = {
        title: document.getElementById('name').value,
        description: document.getElementById('description').value,
        schedules: document.getElementById('schedule').value,
        location: document.getElementById('location').value,
        boothIcon: null,//document.getElementById('').value, FOR NOW
        status: null, //document.getElementById('').value, FOR NOW
    };

    var responseClone; // 1

    fetch('http://localhost/CS-312-Course-Project/backend/php/boothOps/boothRoutes.php', {
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

        responseClone = response.clone()
        return response.json();
    }
)
    .then(data => {
        if (data.success) {
            console.log("Booth created successfully");
            alert("Booth created successfully");
            getData();
        } else {
            console.error(data.error);
            alert(data.error || 'Error creating booth');
        }
    },

   
    function (rejectionReason) { // 3
        console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
        responseClone.text() // 5
        .then(function (bodyText) {
            console.log('Received the following instead of valid JSON:', bodyText); // 6
        });

    }
    
    )
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}


getData();
