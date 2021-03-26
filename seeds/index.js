
const mongoose=require("mongoose");
const Campsite=require("../models/campsite")
const cities=require("./cities")
const { places, descriptors }=require("../seeds/seedHelpers")
// const { truncate } = require("fs");

mongoose.connect("mongodb://localhost:27017/worldCamp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).catch(error => handleError(error));

const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const sample=array => array[Math.floor(Math.random()*array.length)];



const seedDB=async () => {
    await Campsite.deleteMany({});
    for (let i=0; i<=400; i++) {
        const random1000=Math.floor(Math.random()*1000)
        const price=Math.floor(Math.random()*20)+20;
        const camp=new Campsite({
            author: "604f54095a6c7b1eb481b734",
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,

            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum libero inventore non incidunt iusto voluptas necessitatibus, quaerat itaque ratione ipsa repellendus minus obcaecati pariatur tenetur at laudantium facere ullam tempore!",
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]

            },
            images: [
                {
                    url: 'https://res.cloudinary.com/sprocket/image/upload/v1615979658/worldCamp/ca5ykzshgwk0322mokcs.jpg',
                    filename: 'worldCamp/ca5ykzshgwk0322mokcs'
                },
                {
                    url: 'https://res.cloudinary.com/sprocket/image/upload/v1615979663/worldCamp/qwcfrkvfttxuonsya46d.jpg',
                    filename: 'worldCamp/qwcfrkvfttxuonsya46d'
                },
                {
                    url: 'https://res.cloudinary.com/sprocket/image/upload/v1615979664/worldCamp/iglszsntbjuh0lewybdb.jpg',
                    filename: 'worldCamp/iglszsntbjuh0lewybdb'
                },
                {
                    url: 'https://res.cloudinary.com/sprocket/image/upload/v1615979669/worldCamp/qza4p6un8vzixklvb1x8.jpg',
                    filename: 'worldCamp/qza4p6un8vzixklvb1x8'
                },
            ],
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})
