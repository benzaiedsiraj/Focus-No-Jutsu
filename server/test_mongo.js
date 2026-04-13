const mongoose = require('mongoose');

const uri = "mongodb+srv://walaeuro10_db_user:PqB9qAty7q82UQvn@cluster0.cuujaoi.mongodb.net/focusflow?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection Error:", err);
    process.exit(1);
  });
