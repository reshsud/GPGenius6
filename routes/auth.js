// Import the Express module
const express = require("express");

// Import the user controller that handles user-related operations
const userController = require('../controllers/users');

// Create a new router object
const router = express.Router();

// Define a route to handle user registration
// When a POST request is made to '/register', the register function from userController is called
router.post('/register',userController.register);

// Define a route to handle user login
// When a POST request is made to '/login', the login function from userController is called
router.post('/login',userController.login);

// Define a route to handle user logout
// When a GET request is made to '/logout', the logout function from userController is called
router.get('/logout',userController.logout);

// Export the router object so it can be used in other parts of the application
module.exports = router;