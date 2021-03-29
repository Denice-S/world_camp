# World Camp


### This is a full CRUD express app that showcases camping sites around the world.The app is hosted on Heroku with a mongoDB atlas database.
[World Camp](https://secret-springs-92057.herokuapp.com/)



Users Can:

1. View camsites on a cluster map.
2. View all campsites with images and details.
3. View more detailed information about a particular campiste, which includes reviews and a centered local map.
4. register and log in, add their own campsites and leave reviews on others they may have stayed at.
5. Users must be logged in to leave reviews,add campsites,edit or delete them.



Tech Used:
1. NodeJs
2. Express
3. MongoDB
4. Mongoose
5. Passport for authentication
6. Mapbox API for maps.


Platforms:
1. Cloudinary for image storage
2. Heroku for hosting the app
3. MongoDB Atlas for hosting the mongo database

### Credits:

All images on the site are from unsplash


---

*Known Bugs/issues or improvements needed:*
1. *Limit the number of file uploads. and file sizes as this is not currently implemented.*
2. *Add an indicator that data is being saved as currently the app does nothing until successful and then redirects to a new page which is not a good user experience.*
3. *Add validation to maps as users can currently mistype a location and this will not render on the map.*
