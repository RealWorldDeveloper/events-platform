
import mongoose from "mongoose";
const adminModel = new mongoose.Schema({
   name: {
        type: String,
        required: true
    },
        email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true,
        default: "0000"
    },
});
const Admin = mongoose.models.admin || mongoose.model("admin", adminModel);
export default Admin;