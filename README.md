# PetSittr

## [See the App!](https://petsittr-app.adaptable.app/)

![App Logo](https://raw.githubusercontent.com/Mercedes-amor/petSittr/main/public/images/logo.png)


## Description
Plataforma de enlace entre dueños de mascotas y cuidadores.

 
## User Stories



- **Signup:**
    - Comprobación no existe usuario previo con mismo email
    - Doble comprobación contraseña
    - Cifrado contraseña
    - Características contraseña: Mayus, minus, carácter -especial y número.
    - Redirección directa sin pasar por login

- **Login**
    - Autentificación
    - Autorización
    - Remember me: Cookies
    - Visualización menús según role
    - Nombre y role visible en cabecera

- **Logout**

- **User Owner:**
    - CRUD PET- Con 1 base relacional
    - CRUD JOB-Con 2 bases relacionales
    - Mensajes error campos obligatorios vacios
    - Mantener valores preseleccionados al editar
    - Mantener valores preseleccionados al volver atrás
    - Mantener valores preseleccionados al introducir datos erróneos
    - Subida y actualización de imágenes con cloudinary
    - Cambiar status del job a “concluded” una vez pasada la fecha actual
    - Fechas:
        - Cambiar formato más amigable para visualización en html
        - Comprobación fecha inicio debe ser anterior a fecha fin
         - Comprobación fecha inicio/fin no puede ser anterior a fecha actual.		
- **User Sittr:**
    - Visualización listado completo de todos los Jobs
    - Filtro de búsqueda de jobs:
        - Ciudad
        - Tipo mascota
        - Fechas: Se establece un rango de búsqueda
    - Mantener valores preseleccionados en la búsqueda
    - Visualización ficha/perfil de las mascotas ligadas a cada job
    - Botón aceptación Job: Cambio del estado a “executing”
    - Visualización de jobs aceptados por el sittr


## Backlog Functionalities

**NOTE -** Historial del user Sittr de trabajos realizados y valoraciones de los usuarios Owners

## Technologies used

- HTML 
- CSS 
- Bootstrap
- Javascript
- Node
- Express
- MongoDB
- Handlebars
- Sessions & Cookies
- Cloudinary


## Routes


**Auth:**

**GET "/signup" => Enseñar vista de formulario**
- This route handles HTTP GET requests to "/signup".
- When a user accesses this route, it renders the "signup.hbs" view, which presumably contains a form for user registration.

**POST "/signup" => Enviar los datos del formulario a la DB**
- This route handles HTTP POST requests to "/signup".
- It expects data to be submitted via a form, including fields such as `username`, `email`, `password`, `password2`, and `userType`.
- It performs validation checks on the submitted data:
- Checks if all required fields are filled (username, email, password, userType), and if the passwords match (`password` and `password2`).
- Checks if the password follows certain criteria (at least one uppercase letter, one lowercase letter, one special character, and a length of 5 or more characters).
- If any validation fails, it renders the "signup.hbs" view with corresponding error messages.
- If validation succeeds, it checks if a user with the same email already exists in the database.
- If no user with the same email exists, it hashes the password using bcrypt, creates a new user record in the database, and sets up a user session.
- Depending on the user's `userType`, it redirects them to different pages: "/owner/petlist" for "owner" users and "/sittr/job-list-accepted" for "sittr" users.
- If any errors occur during this process, the route forwards the error to the error-handling middleware.

**Index:**

**GET "/" => Render Home Page:**
- Handles a GET request to the root path ("/").
- Renders the "index" view, which presumably represents the home page of the application.

**POST "/" => User Login:**
- Handles a POST request to the root path ("/") for user login.
- Expects user credentials (`email`, `password`, `RememberMe`) from the request body.
- Checks if a user with the provided email exists in the database.
- Compares the provided password with the hashed password stored in the database using `bcrypt.compare`.
- If the email and password are correct, it creates an active session for the user, storing session data such as `_id`, `userType`, and `userName`.
- Depending on the user's `userType`, it redirects them to different pages: "/owner/petlist" for "owner" users and "/sittr/job-list-accepted" for "sittr" users.
- If login is unsuccessful (incorrect password or email), it renders the "index.hbs" view with an error message.

**GET "/logout" => User Logout:**
- Handles a GET request to "/logout".
- Destroys the user's session using `req.session.destroy`.
- Redirects the user to the root path ("/") after logout.

**Owners:**

**GET "/owner/petlist" => Display List of Owner's Pets:**
- Handles a GET request to "/owner/petlist".
- Retrieves all pets belonging to the currently logged-in owner (`req.session.user._id`).
- Formats date of birth for display in HTML.
- Renders the "owner/petlist.hbs" view, displaying a list of owner's pets.

**GET "/owner/add-pet" => Display Pet Addition Form:**
- Handles a GET request to "/owner/add-pet".
- Renders the "owner/addpet.hbs" view, allowing the owner to add a new pet.

**POST "/owner/add-pet" => Add Pet to Database:**
- Handles a POST request to "/owner/add-pet".
- Expects pet information (`name`, `animalType`, `race`, `size`, `dateOfBirth`, `comment`) from the request body.
- Validates and handles uploaded pet picture using the `uploader` middleware.
- Adds the pet to the database with the provided information and redirects to "/owner/petlist" upon success.

**GET "/owner/edit-pet/:petId" => Display Pet Editing Form:**
- Handles a GET request to "/owner/edit-pet/:petId".
- Retrieves the pet with the specified ID and populates relevant fields for editing.
- Renders the "owner/editpet.hbs" view, pre-populating form fields for editing.

**POST "/owner/edit-pet/:petId" => Edit Pet in Database:**
- Handles a POST request to "/owner/edit-pet/:petId".
- Expects updated pet information (`name`, `animalType`, `race`, `size`, `dateOfBirth`, `comment`) from the request body.
- Validates and handles uploaded pet picture using the `uploader` middleware.
- Updates the pet's information in the database and redirects to "/owner/petlist" upon success.

**GET "/owner/delete-pet/:petId" => Delete Pet from Database:**
- Handles a GET request to "/owner/delete-pet/:petId".
- Deletes the pet with the specified ID from the database and redirects to "/owner/petlist" upon success.

**GET "/owner/add-job" => Display Job Addition Form:**
- Handles a GET request to "/owner/add-job".
- Retrieves the pets owned by the currently logged-in owner.
- Renders the "owner/jobadd.hbs" view, allowing the owner to add a new job with relevant pet options.

**POST "/owner/add-job" => Add Job to Database:**
- Handles a POST request to "/owner/add-job".
- Expects job information (`pet`, `city`, `price`, `startDate`, `endDate`, `comment`) from the request body.
- Validates job details, including date constraints.
- Adds the job to the database and redirects to "/owner/joblist" upon success.

**GET "/owner/joblist" => Display List of Owner's Jobs:**
- Handles a GET request to "/owner/joblist".
- Retrieves all jobs created by the currently logged-in owner.
- Formats dates for display in HTML and marks pending jobs.
- Renders the "owner/joblist.hbs" view, displaying a list of owner's jobs.

**GET "/owner/delete-job/:jobId" => Delete Job from Database:**
- Handles a GET request to "/owner/delete-job/:jobId".
- Deletes the job with the specified ID from the database, only if it's in pending status.
- Redirects to "/owner/joblist" upon success.

**GET "/owner/edit-job/:jobId" => Display Job Editing Form:**
- Handles a GET request to "/owner/edit-job/:jobId".
- Retrieves the job with the specified ID and associated pet data for editing, only if the job is in pending status.
- Renders the "owner/jobedit.hbs" view, pre-populating form fields for editing.

**POST "/owner/edit-job/:jobId" => Edit Job in Database:**
- Handles a POST request to "/owner/edit-job/:jobId".
- Expects updated job information (`pet`, `city`, `price`, `startDate`, `endDate`, `comment`) from the request body.
- Validates job details, including date constraints.
- Updates the job's information in the database and redirects to "/owner/joblist" upon success.

**Sittr:**

**GET "/sittr/joblist/" => Display List of Pending Jobs:**
- Handles a GET request to "/sittr/joblist/".
- Retrieves all pending jobs.
- Formats dates for display in HTML using the `dateFixer` utility.
- Renders the "sittr/joblist.hbs" view, displaying a list of pending jobs.

**POST "/sittr/joblist" => Display Filtered List of Jobs:**
- Handles a POST request to "/sittr/joblist".
- Retrieves filter parameters (`city`, `animalType`, `startDate`, `endDate`) from the request body.
- Validates filter parameters and animal types.
- Filters jobs based on filter criteria and animal type.
- Renders the "sittr/joblist.hbs" view with filtered job list.

**GET "/sittr/view-pet/:petId" => Display Pet Details:**
- Handles a GET request to "/sittr/view-pet/:petId".
- Retrieves details of the specified pet (`petId`) and formats date of birth.
- Renders the "sittr/viewpet.hbs" view, displaying details of the selected pet.

**GET "/sittr/accept-job/:jobId" => Accept a Job:**
- Handles a GET request to "/sittr/accept-job/:jobId".
- Updates the status of the specified job (`jobId`) to "executing".
- Associates the sitter's ID (`req.session.user._id`) with the job.
- Redirects to "/sittr/joblist" upon successful acceptance.

**GET "/sittr/job-list-accepted" => Display List of Accepted Jobs:**
- Handles a GET request to "/sittr/job-list-accepted".
- Retrieves all jobs accepted by the current sitter (`req.session.user._id`).
- Formats dates for display in HTML using the `dateFixer` utility.
- Renders the "sittr/joblistaccepted.hbs" view, displaying a list of accepted jobs.





## Models

User model
 
```
email:
        type: String,
        required: true,
        unique: true  

username:
        type: String,
        required: true

password:
        type: String,
        required: true
    
userType:
        type: String,
        enum: ["sittr", "owner"],
        required: true
```

Pet model

```
    name:
        type: String,
        required: true
    
    animalType: 
        type: String,
        enum: ["dog", "cat"],
        required: true
    
    race: 
        type: String,
    
    size:
        type: String,
        enum: ["small", "medium", "big"],
        required: true
    
    dateOfBirth:
        type: Date,
    
    owner:
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    
    comment: String,

    picture:
        type: String
``` 

Job model

```
    sittr:
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    owner:
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    
    pet: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    }],
    city:
        type: String,
        required: true
    
    startDate:
        type: Date,
        required: true
    
    endDate:
        type: Date,
        required: true
    
    status:
        type: String,
        enum: ["pending", "executing", "concluded"],
        default: "pending"
    
    price:
       type: Number,
       required: true 
    
    comment: String
```

## Links

## Collaborators

[Mercedes Amor](https://github.com/Mercedes-amor)

[Rishi Daryanani](https://github.com/kekonline)

### Project

[Repository Link](https://github.com/Mercedes-amor/petSittr.git)

[Deploy Link](https://petsittr-app.adaptable.app/)


### Slides

[Slides Link](https://docs.google.com/presentation/d/1SgCsyVTkTt3sK0f6L5ia7fkHogkCkHKeUXVv7-dTvyw/edit#slide=id.g27483d092c2_1_29)

[Trello Link](https://trello.com/b/Qm7Q3bGM/petsittr)
