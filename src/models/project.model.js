import { model, Schema } from "mongoose";

const projectSchema = Schema({
    project_name: {
        type: String,
        required: true,
        unique: true
    },
    project_description: {
        type: String,
        required: true
    },
})

const projectModel = model("project", projectSchema);

export {projectModel};