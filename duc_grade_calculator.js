
let textFileUrl = null;

let classRoom;

const States = {
    CLASS_NAME: 0,
    STUDENT_NAMES: 1,
    BOOK_NAMES: 2,
    EXAMS: 3
};

function $(id) {
    return document.getElementById(id);
}

function generateTextFileUrl(txt) {
    let fileData = new Blob([txt], {type: 'text/plain'});
    if (textFileUrl !== null) {
        window.URL.revokeObjectURL(textFile);
    }
    textFileUrl = window.URL.createObjectURL(fileData);
    return textFileUrl;
}

function addPrompt(txt) {
    // add prompt at top
    let h1 = document.createElement('h1');
    h1.id = 'prompt';
    h1.textContent = txt;
    $('container').append(h1);
}

function addSubmit(onClickFunc) {
    let button = document.createElement('button');
    button.type = 'button';
    button.id = 'button';
    button.textContent = 'Done';
    button.addEventListener('click', onClickFunc);
    $('container').append(button);
}

function onClassNameEntered() {
    classRoom.name = $('input').value;
    if (!classRoom.hasOwnProperty('students')) {
        classRoom.students = [];
    }
    classRoom.cState = States.STUDENT_NAMES;
    render();
}

function renderClassNameState() {
    $('container').textContent = '';

    addPrompt('Please enter the class name below: ');

    // add input for class Name
    let input = document.createElement('input');
    input.id = 'input';
    input.type = 'text';
    $('container').append(input);

    // Add submit button for class Name
    addSubmit(onClassNameEntered);
}

function onStudentNamesEntered() {
    // Will wipe data if this student already exists TODO
    $('console').querySelectorAll('input').forEach(function(i) {
        classRoom.students.push({
            name: i.value,
            books: []
        });
    });
    classRoom.cState = States.BOOK_NAMES;
    render();
}

function renderStudentNamesState() {
    $('container').textContent = '';

    // add prompt at top
    addPrompt('Please enter student names below: ');

    // add container for student name inputs
    let console = document.createElement('div');
    console.id = 'console';
    $('container').append(console);

    // Add 'add student' button
    let button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Add a Student';
    button.addEventListener('click', function() {
        let newInput = document.createElement('input');
        newInput.type = 'text';
        $('console').append(newInput);
        $('console').append(document.createElement('br'));
    });
    $('container').append(button);

    // Add submit button
    addSubmit(onStudentNamesEntered);
}

function onBookNamesEntered() {
    // TODO wipes data for book if it already existed.
    $('console').querySelectorAll('input').forEach(function(i) {
        classRoom.students.forEach(function(s) {
            s.books.push({
                name: i.value,
                exams: []
            });
        });
    });

    classRoom.cState = States.EXAMS;
    render();
}

function renderBookNamesState() {
    $('container').textContent = '';

    // add prompt at top
    addPrompt('Please enter book names below: ');

    // add container for book name inputs
    let console = document.createElement('div');
    console.id = 'console';
    $('container').append(console);

    // Add 'add book' button
    let button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Add a Book';
    button.addEventListener('click', function() {
        let newInput = document.createElement('input');
        newInput.type = 'text';
        $('console').append(newInput);
        $('console').append(document.createElement('br'));
    });
    $('container').append(button);

    // Add submit button
    addSubmit(onBookNamesEntered);
}

function onExamsEntered() {
    // add each exam to each student's each book
    classRoom.students.forEach(function(s) {
        s.books.forEach(function(b) {
            $('console').querySelectorAll('.examWrapper').forEach(function(eW) {
                b.exams.push({
                    name: eW.querySelector('.examNameInput').value,
                    totalPoints: eW.querySelector('.examPointInput').value,
                    score: eW.querySelectorAll('.scoreInput')[s.books.indexOf(b)].value
                });
            });
        });
    });
    console.log(classRoom);

    let link = document.createElement('a');
    link.id = 'link';
    link.download = classRoom.name + '_grades.json'
    link.href = generateTextFileUrl(JSON.stringify(classRoom));
    link.textContent = 'Download grades as JSON file.';
    $('container').append(link);
}

function onAddExamClicked() {
    let nameLabel = document.createElement('label');
    nameLabel.textContent = 'Exam Name: ';
    let nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.classList.add('examNameInput');

    // now for total points
    let pointLabel = document.createElement('label');
    pointLabel.textContent = 'Total Possible Points: ';
    let pointInput = document.createElement('input');
    pointInput.type = 'text';
    pointInput.classList.add('examPointInput');

    // wrap everything so that we can qs for each exam easily
    let w = document.createElement('div');
    w.classList.add('examWrapper');
    w.append(nameLabel, nameInput, document.createElement('br'));
    w.append(pointLabel, pointInput, document.createElement('br')); 

    // now create the inputs for each students scores for each book.
    // add them to wrapper
    classRoom.students.forEach(function(s) {
        // create heading
        let heading = document.createElement('h2');
        heading.textContent = 'Scores for ' + s.name + ' in this Exam: ';

        // wrap this in a div so we can look it up
        let scoreWrapper = document.createElement('div');
        scoreWrapper.classList.add('examScoreWrapper');
        scoreWrapper.append(heading);

        // now for each score
        s.books.forEach(function(b) {
            let scoreLabel = document.createElement('label');
            scoreLabel.textContent = s.name + "'s score in " + b.name + ': ';
            let scoreInput = document.createElement('input');
            scoreInput.type = 'text';
            scoreInput.classList.add('scoreInput'); //TODO needed?

            scoreWrapper.append(scoreLabel, scoreInput, document.createElement('br'));
        });
        w.append(scoreWrapper);
    });

    $('console').append(w);
    $('console').append(document.createElement('br'), document.createElement('hr'), document.createElement('br'));
}

function renderExamsState() {
    $('container').textContent = '';

    // add prompt at top
    addPrompt('Please enter Exam names and total possible points per book below: ');

    // add container for exam inputs
    let console = document.createElement('div');
    console.id = 'console';
    $('container').append(console);

    // Add 'add exam' button
    let button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Add an Exam';
    button.addEventListener('click', onAddExamClicked);
    $('container').append(button);

    // Add submit button
    addSubmit(onExamsEntered);
}

function render() {
    if (classRoom.cState == States.CLASS_NAME) {
        renderClassNameState();
    } else if (classRoom.cState == States.STUDENT_NAMES) {
        renderStudentNamesState();
    } else if (classRoom.cState == States.BOOK_NAMES) {
        renderBookNamesState();
    } else if (classRoom.cState == States.EXAMS) {
        renderExamsState();
    }
}

function ClassRoom(o) {
    this.init = function() {
        // set state of classRoom
        this.cState = States.CLASS_NAME;
        render();
    }
}

window.addEventListener('load', function() {
    classRoom = new ClassRoom();
    classRoom.init();
});
