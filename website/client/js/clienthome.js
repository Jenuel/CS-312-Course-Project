let box = document.querySelector(".booth-container"); // where the child will be appended

let booths = [
    {
        status: "open",
        boothName: "booth 1",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }, 
    {
        status: "open",
        boothName: "booth 2",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }, 
    {
        status: "open",
        boothName: "booth 3",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }, 
    {
        status: "open",
        boothName: "booth 4",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }, 
    {
        status: "open",
        boothName: "booth 5",
        schedule: "8:30 - 9:30 am",
        location: "main campus",
        description: "booth for something"
    }, 
    {
        status: "open",
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

readBoothValues(); // runs the function