//selectors
const currentGrade = document.querySelector('.current-grade');
const examWeight = document.querySelector('.exam-weight');
const desiredSemesterGrade = document.querySelector('.desired-semester-grade');
const submitBtn = document.querySelector('.submit-btn');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('#modal-close');
const youNeed = document.querySelector('.you-need');
const message = document.querySelector('.message');

//Listeners 

submitBtn.addEventListener('click', calculateGrades);
modalClose.addEventListener('click', closeModal);

//Functions

function calculateGrades() {
    modal.style.display = 'flex'
    if (isNaN(currentGrade.value) || isNaN(examWeight.value) || isNaN(desiredSemesterGrade.value) || currentGrade.value.length == 0 || examWeight.value.length == 0 || desiredSemesterGrade.value.length == 0) {
        message.innerText = "Arrr matey! Give me the numbers ye have for yer grades, and I'll tally up yer final score for ye!";
        youNeed.innerText = "";
    }
    else {
        examGrade = (desiredSemesterGrade.value - (currentGrade.value * ((100 - examWeight.value) / 100))) / (examWeight.value / 100);
        examGrade = examGrade.toFixed(0);
        youNeed.innerText = "You need a " + examGrade + "% to get a " + desiredSemesterGrade.value + "% in the class.";
        if (examGrade > 100) {
            message.innerText = "Ye be needin' a miracle, matey!";
        } else if (examGrade == 100) {
            message.innerText = "Ye gotta be perfect, ye scallywag!";
        } else if (examGrade > 95) {
            message.innerText = "It'll be a tough haul, but I believe in ye, matey!";
        } else if (examGrade > 90) {
            message.innerText = "There be a chance, arr!";
        } else if (examGrade > 80) {
            message.innerText = "Ye got this, matey, it's easy as plunderin!";
        } else if (examGrade > 70) {
            message.innerText = "Give it yer best shot, ye seadog!";
        } else if (examGrade > 60) {
            message.innerText = "Don't waste yer time studyin', matey!";
        } else if (examGrade > 50) {
            message.innerText = "Ye don't even have to try, matey!";
        } else if (examGrade == 50) {
            message.innerText = "If ye be wearin' a blindfold and pickin' answers at random on a true or false quiz, ye'd have a 50% chance, savvy?"
        } else if (examGrade < 50) {
            message.innerText = "No need to strain when the sea might just bring the gold to ye!"
        }
    }
}

function closeModal() {
    modal.style.display = "none";
    currentGrade.value = "";
    examWeight.value = "";
    desiredSemesterGrade.value = "";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        currentGrade.value = "";
        examWeight.value = "";
        desiredSemesterGrade.value = "";
    }
}
