const mongoose = require("mongoose");

const schema = mongoose.Schema;

mongoose.connect();



const Photo = mongoose.model("Photo", PhotoSchema);



// Photo.create({
//   title: 'Photo title 2',
//   description: 'lorem ipsum kanka',
// });



// find 

/* Photo.find().then((data) => console.log(data)) */


// update 

const id = "6477cd2ebbe0a368fa3622ea";
/*
Photo.findByIdAndUpdate(
  id,
  {
    title: "değişiyorum",
    description: "ben de değiştim"
  }, 
  {
    new: true
  }
).then((data) => console.log(data)); */



//delete a Photo
Photo.findByIdAndDelete(id).then((data) => console.log(data));