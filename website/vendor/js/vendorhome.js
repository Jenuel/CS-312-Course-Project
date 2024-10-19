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

// array values that gives information to the children that will be appended on "box"
let booths = [
    {
        image: "1.png",
        boothName: "booth 1",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }, 
    {
        image: "2.png",
        boothName: "booth 2",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }, 
    {
        image: "3.png",
        boothName: "booth 3",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }, 
    {
        image: "4.png",
        boothName: "booth 4",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }, 
    {
        image: "5.png",
        boothName: "booth 5",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }, 
    {
        image: "5.png",
        boothName: "booth 6",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }
];

// function in appending values to the booth
function readBoothValues(){
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

readBoothValues(); // runs the function