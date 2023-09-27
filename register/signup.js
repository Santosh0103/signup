
document.getElementById("signupForm").addEventListener("submit", async (e) => {

    e.preventDefault();
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


   //validiating the input format
   const validationError = validateInput(email, password, username);

  if (validationError) {
  // Display an alert with the validation error message
  alert(validationError);

   }
    else {
        // Send a POST request to the server to create a new user
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, username, password }),
        })

        const data = await response.json()


        if (response.status == 200) {
            document.getElementById("message").textContent =data.message
        }
        if (response.status == 500) {
            document.getElementById("message").textContent = data.message
        }

    }

});

document.getElementById("login").addEventListener("click", () => {
    window.location.href = "../login/index.html";
});