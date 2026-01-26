//this middleware for store images for website and gernate the urls for images that will be store in DB

import multer from "multer"
let storage=multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,"./Public")  
    },
    filename:(req,file,cb)=>{
      cb(null,file.originalname)  
    }
})
const upload = multer({storage})

export default upload

