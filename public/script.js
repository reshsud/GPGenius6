var gradeData = {};

const numClassesInput = document.getElementById('numClasses');
const classInputsDiv = document.getElementById('classInputs');
const unweightedGPASpan = document.getElementById('unweightedGPA');
const weightedGPASpan = document.getElementById('weightedGPA');

function createInputFields() {
    const numClasses = parseInt(numClassesInput.value);
    const errorMessageDiv = document.getElementById('errorMessage');
    errorMessageDiv.textContent = ''; // Clears any previous error messages

    if (numClasses === 0) {
        errorMessageDiv.textContent = "Please enter a valid class number.";
        return;
    }

    if (numClasses > 28) {
        errorMessageDiv.textContent = "A student at Silver Creek High School is not able to take more than 28 classes.";
        return;
    }

    classInputsDiv.innerHTML = '';

    // Set GPA spans to 4.0
    unweightedGPASpan.textContent = '4.0';
    weightedGPASpan.textContent = '4.0';

    // Create table structure
    var table = document.createElement('table');
    table.className = 'class-table';

    // Table header
    var header = table.createTHead();
    var headerRow = header.insertRow(0);
    headerRow.innerHTML = '<th class="number-column">#</th><th class="input-column">Class Name</th><th class="select-column">Grade</th><th class="select-column">Course Type</th>';

    var body = table.createTBody();

    // Add input fields
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
    }

    classInputsDiv.appendChild(table);

    // Add event listeners to dropdowns
    const gradeDropdowns = document.querySelectorAll('.grade');
    const courseTypeDropdowns = document.querySelectorAll('.courseType');

    gradeDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', calculateGPA);
    });

    courseTypeDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', calculateGPA);
    });
}



// Function to calculate GPA
function calculateGPA() {
    const gradeDropdowns = document.querySelectorAll('.grade');
    const courseTypeDropdowns = document.querySelectorAll('.courseType');


    console.log("Grades: ", Array.from(gradeDropdowns).map(dropdown => dropdown.value));
    console.log("Course Types: ", Array.from(courseTypeDropdowns).map(dropdown => dropdown.value));

    let totalUnweightedPoints = 0;
    let totalWeightedPoints = 0;
    let totalClasses = gradeDropdowns.length;

    gradeDropdowns.forEach((dropdown, index) => {
        let grade = dropdown.value;
        let courseType = courseTypeDropdowns[index].value;

        let unweightedPoints = 0;
        let weightedPoints = 0;

        switch (grade) {
            case 'A+':
                unweightedPoints = 4.0;
                break;
            case 'A':
                unweightedPoints = 4.0;
                break;
            case 'A-':
                unweightedPoints = 4.0;
                break;
            case 'B+':
                unweightedPoints = 3.0;
                break;
            case 'B':
                unweightedPoints = 3.0;
                break;
            case 'B-':
                unweightedPoints = 3.0;
                break;
            case 'C+':
                unweightedPoints = 2.0;
                break;
            case 'C':
                unweightedPoints = 2.0;
                break;
            case 'C-':
                unweightedPoints = 2.0;
                break;
            case 'D+':
                unweightedPoints = 1.0;
                break;
            case 'D':
                unweightedPoints = 1.0;
                break;
            case 'D-':
                unweightedPoints = 1.0;
                break;
            case 'F':
                unweightedPoints = 0.0;
                break;
        }

        weightedPoints = unweightedPoints;

        if (courseType === 'AP') {
            weightedPoints += 1.0;
        }

        totalUnweightedPoints += unweightedPoints;
        totalWeightedPoints += weightedPoints;
    });

    let unweightedGPA = totalUnweightedPoints / totalClasses;
    let weightedGPA = totalWeightedPoints / totalClasses;

    unweightedGPASpan.textContent = unweightedGPA.toFixed(2);
    weightedGPASpan.textContent = weightedGPA.toFixed(2);
}

// Function to save GPA
function saveGpa() {
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

        const gpaData = {
            email,
            className,
            grade,
            courseType,
            unweightedGPA,
            weightedGPA,
        };

        fetch('http://localhost:5000/save-gpa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gpaData),
        })
        .then(response => response.json())
        .then(data => {
            console.log(`GPA saved successfully! Instance: ${data.instance}`);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}



function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont('Poppins');

    doc.setFontSize(20);
    doc.setTextColor('#FF8647');
    doc.text('Transcript', 105, 20, null, null, 'center');

    const tableData = [];

    const classNames = document.querySelectorAll('.className');
    const grades = document.querySelectorAll('.grade');
    const courseTypes = document.querySelectorAll('.courseType');

    classNames.forEach((className, index) => {
        tableData.push([index + 1, className.value, grades[index].value, courseTypes[index].value]);
    });

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

    const unweightedGPA = document.getElementById('unweightedGPA').textContent;
    const weightedGPA = document.getElementById('weightedGPA').textContent;

    doc.setFontSize(14);
    doc.setTextColor('#FF5700');
    doc.text(`Unweighted GPA: ${unweightedGPA}`, 40, yOffset + 20);
    doc.text(`Weighted GPA: ${weightedGPA}`, 140, yOffset + 20);

    doc.save('transcript.pdf');
}
