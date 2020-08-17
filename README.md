# ICT Skills - Play Gym Application

An application written with node.js and Javascript. Handlebars templating engine used to dynamically serve content to the user.


## Your Project

On the front-end,

- The files found in the views folder are used to store the code for front-end look and feel
- The layouts subfolder is used to store the main.hbs file which contains the scripts for jQuery and Fomantic UI

On the back-end,

- The routes.js file (express router) determines which controller file and method should be called for a given route
- The relevant controller uses methods from the specific model to complete a given action and return the relevant data
- The models folder also contains the json files which are used to store the users' data.

