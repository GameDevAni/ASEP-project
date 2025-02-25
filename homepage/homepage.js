var imageInput = document.getElementById("image-input");
var previewImage = document.getElementById("preview-image");
imageInput.addEventListener("change", function(event){
  if(event.target.files.length == 0){
    return;
  }
  var tempUrL = URL.createObjectURL(event.target.files[0]);
  previewImage.setAttribute("src", tempUrL);
});

document.getElementById("contactform").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    let phone = document.querySelector("input[name='phone']").value;
    let location = document.querySelector("input[name='Location']").value;
    let message = document.querySelector("textarea[name='message']").value;
    let imageFile = document.querySelector("#image-input").files[0];

    let formData = new FormData();
    formData.append("phone", phone);
    formData.append("location", location);
    formData.append("message", message);
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        let response = await fetch("http://127.0.0.1:8090/api/collections/help_requests/records", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            alert("Form submitted successfully!");
            document.getElementById("contactform").reset();
        } else {
            alert("Failed to submit the form.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error submitting form.");
    }
});

