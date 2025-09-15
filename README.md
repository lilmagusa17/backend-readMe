Read.Me book app (backend)

This is the backend code for a social media app based on books, API REST developed with Node.js + Express + TypeScript + MongoDB (Mongoose) to manage users, books and reviwes.  
It includes JWT authenticantion and role permissions management (admin and reader).

---------------------------------------------------
To Run Local Proyect 
---------------------------------------------------

Requirenments
- Node.js >= 18
- MongoDB Atlas or local
- npm or yarn

Environment Variables
'.env' file with PORT and MONGODBURI must be created

Installing dependencies
npm install

#Execute in dev mode
npm run dev


---------------------------------------------------
Authentication
---------------------------------------------------

App uses JWT for its auth.
- Once loged in, a token is given
- Each protected request must have said token as a header:  
Authorization: Bearer <token>

---------------------------------------------------
Main Endpoints
---------------------------------------------------

Users (/users)

Type | Endpoint   | Descripción                          
-------|------------|--------------------------------------
POST   | /register  | User registration, defaul role: reader
POST   | /          | User creation, given role               
POST   | /login     | Logs in and returns token   
GET    | /          | Gets all users        
PUT    | /:id       | Updates an user                 
DELETE | /:id       | Deletes an user                    

---------------------------------------------------
Books (/books)
---------------------------------------------------

Type | Endpoint   | Descripción
-------|------------|----------------
POST   | /          | Creates a book
GET    | /          | Lists all books
PUT    | /:title    | Updates book
DELETE | /:title    | Deletes book

---------------------------------------------------
Reviews (/reviews)
---------------------------------------------------

Método | Endpoint     | Descripción
-------|--------------|-----------------------------
POST   | /            | Create review
GET    | /:id         | Finds review by id
GET    | /book/:id    | Lists reviews of a book
PUT    | /:id         | Updates review
DELETE | /:id         | Deletes review

---------------------------------------------
Keypoints
---------------------------------------------------
- In /register, the default role is 'reader'.
- Only admin can create users with an assigned rol.
- Most user and some book actions are only allowed by admin permission, so a logen in admin is required

-------------------------------------
DEPLOYMENT LINK
-------------------------------------

https://backend-read-me-git-main-mariana-agudelo-salazars-projects.vercel.app?_vercel_share=yBmKKiH0o5ZUONnKfFY97UKOR6RQ1cG8

