/**
 * Validates the input details like
 * @param {*} email 
 * @param {*} password 
 * @param {*} username 
 * @returns   a message if any error else returns null     
 */
function validateInput(email, password, username) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/;
    const usernameRegex = /^(.{6,})$/;
  
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    } else if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters and contain a special character.";
    } else if (!usernameRegex.test(username)) {
      return "Username must be at least 6 characters and contain a number.";
    }
  
    // If all validations pass, return null (indicating no errors)
    return null;
  }
