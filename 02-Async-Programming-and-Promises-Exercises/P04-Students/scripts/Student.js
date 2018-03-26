class Student {
    constructor(id, firstName, lastName, facultyNumber, grade) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.facultyNumber = facultyNumber;
        this.grade = grade;
        this._element = this._createElement();
    }

    get id() {
        return this._id;
    }

    set id(value) {
        Student._isNumber(value);
        Student._isEmpty(value);
        this._id = Number(value);
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        Student._isEmpty(value);
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        Student._isEmpty(value);
        this._lastName = value;
    }

    get facultyNumber() {
        return this._facultyNumber;
    }

    set facultyNumber(value) {
        Student._isEmpty(value);
        this._facultyNumber = value;
    }

    get grade() {
        return this._grade;
    }

    set grade(value) {
        Student._isNumber(value);
        Student._isEmpty(value);
        this._grade = Number(value);
    }

    render(selector) {
        $(selector).append(this._element);
    }

    _createElement() {
        let container = $('<tr>');
        container.append($(`<td>${this.id}</td>`));
        container.append($(`<td>${this.firstName}</td>`));
        container.append($(`<td>${this.lastName}</td>`));
        container.append($(`<td>${this.facultyNumber}</td>`));
        container.append($(`<td>${this.grade}</td>`));

        return container;
    }

    static _isNumber(value) {
        if (isNaN(Number(value))) {
            throw new Error('Entry must be a number!');
        }
    }

    static _isEmpty(value) {
        if (value === '') {
            throw new Error('Entry must not be empty!');
        }
    }
}

module.exports = Student;