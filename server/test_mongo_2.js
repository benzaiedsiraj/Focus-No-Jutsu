const mongoose = require('mongoose');

const uri = "mongodb://walaeuro10_db_user:PqB9qAty7q82UQvn@ac-sgm2qmk-shard-00-00.cuujaoi.mongodb.net:27017,ac-sgm2qmk-shard-00-01.cuujaoi.mongodb.net:27017,ac-sgm2qmk-shard-00-02.cuujaoi.mongodb.net:27017/focusflow?ssl=true&replicaSet=atlas-sgm2qmk-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection Error:", err);
    process.exit(1);
  });
