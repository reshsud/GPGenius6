// Global object to store grade data
var gradeData = {};

// HTML element references for user inputs and GPA displays
const numClassesInput = document.getElementById('numClasses');
const classInputsDiv = document.getElementById('classInputs');
const unweightedGPASpan = document.getElementById('unweightedGPA');
const weightedGPASpan = document.getElementById('weightedGPA');

// Function to create input fields based on the number of classes entered
function createInputFields() {
    const numClasses = parseInt(numClassesInput.value); // Parse the number of classes from input
    const errorMessageDiv = document.getElementById('errorMessage');
    errorMessageDiv.textContent = ''; // Clears any previous error messages

    // Validate the number of classes entered
    if (numClasses === 0) {
        errorMessageDiv.textContent = "Please enter a valid class number.";
        return;
    }

    // Create Error Message if a student trys to input more than the maximum amount of classes 
    if (numClasses > 28) {
        errorMessageDiv.textContent = "A student at Silver Creek High School is not able to take more than 28 classes.";
        return;
    }

    classInputsDiv.innerHTML = '';

    // Clear previous class inputs and reset GPA displays
    unweightedGPASpan.textContent = '4.0';
    weightedGPASpan.textContent = '4.0';

    // Create a table for class inputs
    var table = document.createElement('table');
    table.className = 'class-table';

    // Create Table header
    var header = table.createTHead();
    var headerRow = header.insertRow(0);
    headerRow.innerHTML = '<th class="number-column">#</th><th class="input-column">Class Name</th><th class="select-column">Grade</th><th class="select-column">Course Type</th>';
    
    // Create table body
    var body = table.createTBody();

    // Create input fields for each class
    for (let i = 1; i <= numClasses; i++) {
        var row = body.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.innerHTML = i;
        cell2.innerHTML = `<input type="text" class="className mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0" style="width: 100px; height: 30px; font-size: 12px; border-radius: 10px; margin-left: 11%; text-align: center;">`;
        cell3.innerHTML = `<select name="grades" class="grade mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0" style="width: 100px; height: 30px; font-size: 12px; border-radius: 10px; margin-left: 11%; text-align: center;" + placeholder="Class Name" >
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="B-">B-</option>
                                <option value="C+">C+</option>
                                <option value="C">C</option>
                                <option value="C-">C-</option>
                                <option value="D+">D+</option>
                                <option value="D">D</option>
                                <option value="D-">D-</option>
                                <option value="F">F</option>
                           </select>`;
        cell4.innerHTML = `<select class="courseType mt-1 block w-full rounded-md bg-gray-200 focus:bg-white focus:ring-0" style="width: 10px; height: 30px; font-size: 12px; border-radius: 10px; margin-left: 11%; text-align: center;">
                                <option value="Regular">Regular</option>
                                <option value="AP">AP</option>
                           </select>`;

        // Stores Data in local storage to ensure data is kept even when the page reloads
        const storedClassName = localStorage.getItem(`className${i}`);
        const storedGrade = localStorage.getItem(`grade${i}`);
        const storedCourseType = localStorage.getItem(`courseType${i}`);

        if (storedClassName) {
            cell2.querySelector('.className').value = storedClassName;
        }
        if (storedGrade) {
            cell3.querySelector('.grade').value = storedGrade;
        }
        if (storedCourseType) {
            cell4.querySelector('.courseType').value = storedCourseType;
        }
    }

    // Append the table to the class inputs div
    classInputsDiv.appendChild(table);

    // Add event listeners to the grade and course type dropdowns
    const classNameInputs = document.querySelectorAll('.className');
    const gradeDropdowns = document.querySelectorAll('.grade');
    const courseTypeDropdowns = document.querySelectorAll('.courseType');

    classNameInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            localStorage.setItem(`className${index + 1}`, input.value);
        });
    });

    gradeDropdowns.forEach((dropdown, index) => {
        dropdown.addEventListener('change', () => {
            localStorage.setItem(`grade${index + 1}`, dropdown.value);
            calculateGPA();
        });
    });

    courseTypeDropdowns.forEach((dropdown, index) => {
        dropdown.addEventListener('change', () => {
            localStorage.setItem(`courseType${index + 1}`, dropdown.value);
            calculateGPA();
        });
    });
}

// Function to calculate GPA based on selected grades and course types
function calculateGPA() {
    const gradeDropdowns = document.querySelectorAll('.grade');
    const courseTypeDropdowns = document.querySelectorAll('.courseType');

    // Debugging logs to check selected grades and course types
    console.log("Grades: ", Array.from(gradeDropdowns).map(dropdown => dropdown.value));
    console.log("Course Types: ", Array.from(courseTypeDropdowns).map(dropdown => dropdown.value));

    let totalUnweightedPoints = 0;
    let totalWeightedPoints = 0;
    let totalClasses = gradeDropdowns.length;

    // Calculate total points for unweighted and weighted GPA
    gradeDropdowns.forEach((dropdown, index) => {
        let grade = dropdown.value;
        let courseType = courseTypeDropdowns[index].value;

        let unweightedPoints = 0;
        let weightedPoints = 0;

        // Assign points based on the grade
        switch (grade) {
            case 'A+':
            case 'A':
            case 'A-':
                unweightedPoints = 4.0;
                break;
            case 'B+':
            case 'B':
            case 'B-':
                unweightedPoints = 3.0;
                break;
            case 'C+':
            case 'C':
            case 'C-':
                unweightedPoints = 2.0;
                break;
            case 'D+':
            case 'D':
            case 'D-':
                unweightedPoints = 1.0;
                break;
            case 'F':
                unweightedPoints = 0.0;
                break;
        }

        weightedPoints = unweightedPoints;

        // Add extra point for AP courses
        if (courseType === 'AP') {
            weightedPoints += 1.0;
        }

        // Accumulate total points
        totalUnweightedPoints += unweightedPoints;
        totalWeightedPoints += weightedPoints;
    });

    // Calculate unweighted and weighted GPA
    let unweightedGPA = totalUnweightedPoints / totalClasses;
    let weightedGPA = totalWeightedPoints / totalClasses;

    // Update GPA displays
    unweightedGPASpan.textContent = unweightedGPA.toFixed(2);
    weightedGPASpan.textContent = weightedGPA.toFixed(2);
}

// Function to save GPA
function saveGpa() {
    // creates variables from the information collected 
    const classNameElements = document.querySelectorAll('.className');
    const gradeElements = document.querySelectorAll('.grade');
    const courseTypeElements = document.querySelectorAll('.courseType');
    const unweightedGPA = document.getElementById('unweightedGPA').textContent;
    const weightedGPA = document.getElementById('weightedGPA').textContent;
    const email = document.getElementById('signedInMessage').textContent;

    classNameElements.forEach((element, index) => {
        const className = element.value;
        const grade = gradeElements[index].value;
        const courseType = courseTypeElements[index].value;
        //array of the information inside the gpa data
        const gpaData = {
            email,
            className,
            grade,
            courseType,
            unweightedGPA,
            weightedGPA,
        };

        fetch('http://localhost:5555/save-gpa', {  //fetches and saves gpa information
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gpaData),
        })
        .then(response => response.json())
        .then(data => { //gpa is saved
            console.log(`GPA saved successfully! Instance: ${data.instance}`);
        })
        .catch(error => { //gpa is not saved correctly
            console.error('Error:', error);
        });
    });
}
// function that downloads pdf and formats information into the pdf
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set font and style for the PDF
    doc.setFont('Poppins');

    doc.setFontSize(20);
    doc.setTextColor('#FF8647');
    doc.text('Transcript', 105, 20, null, null, 'center');

    const tableData = [];
    // Collect the information from the query such as class name and saves into variables
    const classNames = document.querySelectorAll('.className');
    const grades = document.querySelectorAll('.grade');
    const courseTypes = document.querySelectorAll('.courseType');

    classNames.forEach((className, index) => {
        tableData.push([index + 1, className.value, grades[index].value, courseTypes[index].value]);
    });


    // Add class data to the PDF
    doc.setFontSize(12);
    doc.setTextColor('#FF8647');
    doc.text('Class Name', 40, 40);
    doc.text('Grade', 90, 40);
    doc.text('Course Type', 140, 40);

    let yOffset = 50;
    tableData.forEach(row => {
        doc.text(row[1], 40, yOffset);
        doc.text(row[2], 90, yOffset);
        doc.text(row[3], 140, yOffset);
        yOffset += 10;
    });

    // Add GPA data to the PDF
    const unweightedGPA = document.getElementById('unweightedGPA').textContent;
    const weightedGPA = document.getElementById('weightedGPA').textContent;

    //Set PDF style for Weighted and Unweighted GPA
    doc.setFontSize(14);
    doc.setTextColor('#FF5700');
    doc.text(`Unweighted GPA: ${unweightedGPA}`, 40, yOffset + 20);
    doc.text(`Weighted GPA: ${weightedGPA}`, 140, yOffset + 20);

    doc.save('transcript.pdf');
}

// Load previously saved data from localStorage
window.onload = function() {
    const storedNumClasses = localStorage.getItem('numClasses');
    if (storedNumClasses) {
        numClassesInput.value = storedNumClasses;
        createInputFields();
    }
};

// Save number of classes to localStorage
numClassesInput.addEventListener('input', () => {
    localStorage.setItem('numClasses', numClassesInput.value);
    createInputFields();
});

// Event listener for logout link
logoutLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior (navigation)

    // Clear local storage
    localStorage.clear();

    // Redirect to logout page
    window.location.href = logoutLink.href;
});