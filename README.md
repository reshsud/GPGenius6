- Title: GPGenius

- Description: GPGenius is meant to make GPA calculations efficient for all Silver Creek High School students through a GPA calculator based on Silver Creek’s GPA scale, a downloadable transcript, and a chatbot for assistance.

- Prerequisites: To run the code through an IDE, SQL (for data storage) and Node.js (for running the code) will be required


- Steps to run the code through VSCode:
  - Step 1: Set Up Your Project
    - Create a New Project Folder:
      - Create a new folder for your project.
    - Open the Folder in VS Code:
      - Open VS Code.
      - Go to File > Open Folder and select your project folder.
  - Step 2: Set Up Your MySQL Database
    - Install MySQL:
      - If you haven't installed MySQL, download and install it from MySQL website.
    - Create a Database and Table gpa_courses, gpa_data;
      - Open your MySQL command line or a MySQL client like MySQL Workbench and run the following commands to create a database and a table:

CREATE DATABASE gpa_database;

USE gpa_database;


CREATE TABLE gpa_courses (
   				id INT AUTO_INCREMENT PRIMARY KEY,
    				name VARCHAR(255) NOT NULL,
    				course_name VARCHAR(255) NOT NULL,
    				grade VARCHAR(5) NOT NULL,
    				course_type VARCHAR(50) NOT NULL
);


CREATE TABLE gpa_data (
   				 id INT AUTO_INCREMENT PRIMARY KEY,
    				name VARCHAR(255) NOT NULL,
    				weighted_gpa DECIMAL(3, 2) NOT NULL,
    				unweighted_gpa DECIMAL(3, 2) NOT NULL
);

Select * from gpa_courses;

Select * from gpa_data;


  - Step 3: Set Up a Node.js Server
    - Initialize a Node.js Project:
      - Open your terminal, navigate to your project directory, and run the following commands:

npm init -y
npm install express mysql body-parser cors cookie-parser nodemailer hbs dotenv

  - Step 4: Run the Server
    - Start Your Node.js Server:
      - Open your terminal, navigate to your project directory, and run:

	node app.js





- Directories and Purposes:
  -  app.js - Sets up the server and database connection
  - auth.js - Authentication or 2FA
  - pages.js - Routes for rendering the pages
  - script.js - GPA calculation and user interactions
  - users.js - Session management and authentication
  - header.hbs - structure for page header and sidebar navigation
  - home.hbs - Template to render home page
  - index.hbs - Main HTML for the login page
  - info.hbs - Template to render information page
  - profile.hbs - Template for rendering user profile page and history page
  - qa.hbs - Template to render QA page
  - register.hbs - Template to render registrations page
  - verify.hbs - Template to render verification page
  - home.css - Style for the home page
  - info.css - Style for the information page
  - qa.css - Style for the QA page
  - register.css - Style for the register page
  - sidebar.css - Style for the sidebar page
  - style.css - Style for the css page
  - verify.css - Style for the verification page

- Features:
  - 2 Factor Authentication
  - Downloadable Transcript
  - Information and FAQ Page
  - Personalized GPA calculations
  - Interactive chatbot to navigate
  - History page where previously entered classes, grades, class types, and GPA is saved

- Contributions:
  - Your feedback is valuable to us, so if you happen to have any suggestions, please enter them in the form below.
  - https://shorturl.at/m8TVB

- Contact Information:
  - mandalaishaan@gmail.com
  - resh.sud12@gmail.com
  - notmikimnguyen@gmail.com

- Acknowledgements:
  - SQL
  - VSCode
  - Javascript
  - HTML
  - HBS
  - CSS
  - Node.JS
  - Express.JS
