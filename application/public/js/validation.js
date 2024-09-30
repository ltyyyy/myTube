const userName = document.getElementById('username');
const passWord = document.getElementById('password');
const iconElements = document.querySelectorAll(".icon");
const noerror = document.querySelectorAll(".error");
const confirm = document.getElementById('confirmpassword');



userName.addEventListener('focus', function (ev) {
    noerror[0].classList.remove("error-message");
});

userName.addEventListener('blur', function (ev) {
    noerror[0].classList.add("error-message");
});
passWord.addEventListener('focus', function (ev) {
    noerror[1].classList.remove("error-message");
});

passWord.addEventListener('blur', function (ev) {
    noerror[1].classList.add("error-message");
});

confirm.addEventListener('focus', function (ev) {
    noerror[2].classList.remove("error-message");
});

confirm.addEventListener('blur', function (ev) {
    noerror[2].classList.add("error-message");
});
userName.addEventListener('input', function (ev) {
    let username = userName.value;
    let firstChar = username.charAt(0);
    let isLetter = /^[A-Za-z]$/.test(firstChar);
    let isAlphanumeric = /^[A-Za-z0-9]{3,}$/.test(username);
    if (isLetter) {
        iconElements[0].classList.add("valid");
    } else {
        iconElements[0].classList.remove("valid");
    }
    if (isAlphanumeric) {
        iconElements[1].classList.add("valid");
    } else {
        iconElements[1].classList.remove("valid");
    }
    if (isLetter && isAlphanumeric) {
        noerror[0].classList.add("valid");
    } else {
        noerror[0].classList.remove("valid");
    }
});

passWord.addEventListener('input', function (ev) {
    let userpassword = passWord.value;
    let isLengthValid = userpassword.length >= 8;
    let hasUppercase = /[A-Z]/.test(userpassword);
    let hasNumber = /[0-9]/.test(userpassword);
    let hasChar = /[/\*\-\+\!@\#\$\^\&~\[\]]/.test(userpassword);
    let hasNumberChar = hasNumber && hasChar;
    if (isLengthValid) {
        iconElements[2].classList.add("valid");
    } else {
        iconElements[2].classList.remove("valid");
    }
    if (hasUppercase) {
        iconElements[3].classList.add("valid");
    } else {
        iconElements[3].classList.remove("valid");
    }
    if (hasNumberChar) {
        iconElements[4].classList.add("valid");
    } else {
        iconElements[4].classList.remove("valid");
    }
    if (isLengthValid && hasUppercase && hasNumberChar) {
        noerror[1].classList.add("valid");
    } else {
        noerror[1].classList.remove("valid");
    }
});
confirm.addEventListener('input', function (ev) {
    let confirmpassword = confirm.value;
    let userpassword = passWord.value;
    if (userpassword === confirmpassword) {
        iconElements[5].classList.add("valid");
        noerror[2].classList.add("valid");
    } else {
        iconElements[5].classList.remove("valid");
        noerror[2].classList.remove("valid");
    }
});

passWord.addEventListener('input', function (ev) {
    let confirmpassword = confirm.value;
    let userpassword = passWord.value;
    if (userpassword === confirmpassword) {
        iconElements[5].classList.add("valid");
        noerror[2].classList.add("valid");
    } else {
        iconElements[5].classList.remove("valid");
        noerror[2].classList.remove("valid");
    }
  });


function myfunc() {
    if (isnotValid()) {
        event.preventDefault();
    }
    if (!isUsernameValid()) {
        noerror[0].classList.remove("error-message");
    }
    if (!isPasswordValid()) {
        noerror[1].classList.remove("error-message");
    }
    if (!isConfirmPasswordValid()) {
        noerror[2].classList.remove("error-message");
    }
}

function isnotValid() {
    return !isUsernameValid() || !isPasswordValid() || !isConfirmPasswordValid();
}

function isUsernameValid() {
    let username = userName.value;
    let firstChar = username.charAt(0);
    let isLetter = /^[A-Za-z]$/.test(firstChar);
    let isAlphanumeric = /^[A-Za-z0-9]{3,}$/.test(username);
    return isLetter && isAlphanumeric;
}

function isPasswordValid() {
    let userpassword = passWord.value;
    let isLengthValid = userpassword.length >= 8;
    let hasUppercase = /[A-Z]/.test(userpassword);
    let hasNumber = /[0-9]/.test(userpassword);
    let hasChar = /[/\*\-\+\!@\#\$\^\&~\[\]]/.test(userpassword);
    let hasNumberChar = hasNumber && hasChar;
    return isLengthValid && hasUppercase && hasNumberChar;
}

function isConfirmPasswordValid() {
    let confirmpassword = confirm.value;
    let userpassword = passWord.value;
    return userpassword === confirmpassword;
}
