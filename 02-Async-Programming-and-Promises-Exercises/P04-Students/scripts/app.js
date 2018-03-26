(() => {
    const Student = require('./Student.js');
    const request = require('./requestLauncher.js');

    const results = $('#tbody');
    const idInput = $('#id');
    const firstNameInput = $('#firstName');
    const lastNameInput = $('#lastName');
    const facNumberInput = $('#facultyNumber');
    const gradeInput = $('#grade');
    const addBtn = $('.add');

    loadStudents();

    addBtn.on('click', (event) => {
        event.preventDefault();

        let newStudent = new Student(
            idInput.val(),
            firstNameInput.val(),
            lastNameInput.val(),
            facNumberInput.val(),
            gradeInput.val()
        );

        let body = {
            ID: newStudent._id,
            FirstName: newStudent._firstName,
            LastName: newStudent._lastName,
            FacultyNumber: newStudent._facultyNumber,
            Grade: newStudent._grade
        };

        request('POST', body)
            .then(() => loadStudents())
            .catch(handleError);

        idInput.val('');
        firstNameInput.val('');
        lastNameInput.val('');
        facNumberInput.val('');
        gradeInput.val('');
    });

    function loadStudents() {
        request('GET', {})
            .then(displayStudents)
            .catch(handleError);
    }

    function displayStudents(data) {
        let header = results.find('tr:first-child');
        results.empty();

        data = data.sort((a, b) => a.ID - b.ID);

        for (let student of data) {
            let newStudent = new Student(
                student.ID,
                student.FirstName,
                student.LastName,
                student.FacultyNumber,
                student.Grade
            );

            newStudent.render('#results');
        }

        results.prepend(header);
    }

    function handleError(reason) {
        // Display error with status and message
        alert(`Error: ${reason.status} (${reason.statusText})`);
    }

})();