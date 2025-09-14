import mongoose from "mongoose";


// Solo cargar dotenv en desarrollo
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const connectionString = process.env.MONGO_URL || "";

export const db = mongoose.connect(connectionString)
                                        .then( () => 
                                            console.log("Connected to Mongo")
                                        ).catch(
                                            (error) => console.error(error)
                                        )



