import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";

dotenv.config();

const app = express();
app.use(express.json()); // This is middleware

const { PORT, MONGO_NAME, PASSWORD } = process.env;
const port = PORT || 3000;

const main = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${MONGO_NAME}:${PASSWORD}@cluster15.h7tlojn.mongodb.net/?retryWrites=true&w=majority`);
        console.log("Connected to MongoDB");

        const studentSchema = new mongoose.Schema({
            name: String,
            age: Number
        });
        const Student = mongoose.model("Student", studentSchema);

        app.post("/", [
            body("age").isNumeric().withMessage("Age must be a number")
                .custom((value, { req }) => {
                    if (value < 18) {
                        throw new Error('Age must be greater than or equal to 18');
                    }
                    return true;
                })
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } else {
                const newStudent = new Student(req.body);
                newStudent.save()
                    .then(data => res.json(data))
                    .catch(err => console.log(err));
            }
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

main();
