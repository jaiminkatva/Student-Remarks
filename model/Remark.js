import mongoose from "mongoose";

const remarkSchema = new mongoose.Schema({
  text: String,
  date: {
    type: Date,
    default: Date.now(),
  },
  student: String,
});

export default mongoose.model("Remark", remarkSchema);
