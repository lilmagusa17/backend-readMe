import mongoose from "mongoose";

process.loadEnvFile();

const connectionString = process.env.MONGO_URL || "";

export const db = mongoose.connect(connectionString)
                                        .then( () => 
                                            console.log("Connected to Mongo")
                                        ).catch(
                                            (error) => console.error(error)
                                        )



