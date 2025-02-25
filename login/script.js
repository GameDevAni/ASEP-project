let signUpButton = document.getElementById("signUpButton");
let signInButton = document.getElementById("signInButton");
let nameField = document.getElementById("name");
let title = document.getElementById("title");

signInButton.onclick = function(){
    nameField.style.maxHeight = "0";
    title.innerHTML = "Sign In";
    signUpButton.classList.add("disable");
    signInButton.classList.remove("disable");
}

signUpButton.onclick = function(){
    nameField.style.maxHeight = "60px";
    title.innerHTML = "Sign Up";
    signUpButton.classList.remove("disable");
    signInButton.classList.add("disable");
}