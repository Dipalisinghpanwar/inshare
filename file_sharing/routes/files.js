const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file')
const { v4: uuidv4 } = require('uuid');


//multer configuration
let storage = multer.diskStorage({

    destination: (req, file, cb) => cb(null, 'uploads/') ,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    } ,
});

let upload = multer({
    storage : storage,
    limits : { fileSize: 1000000 * 100 },   //File size 100MB
}).single('myfile')



router.post('/', (req, res) => {
    //Store file
    upload(req, res, async (err) => {
      //validate request
      if(!req.file){
        return res.status(422).send({ error: 'All fields are required.'})
      }
      if(err){
        return res.status(500).send({ error: err.message })
      }

      //Store into Database
      const file = new File({
          filename: req.file.filename,
          uuid: uuidv4(),
          size: req.file.size,
          path: req.file.path
      })
      const response = await file.save()
      // console.log(response)

      res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
       //  http://localhost:3000/files/da834a13-4a75-4ddc-ba5c-dfc29431186e
    })
}) 



router.post('/send', async (req, res) => {
  try{
      const { uuid, emailTo, emailFrom } = req.body

    //Validate request
    if(!uuid || !emailTo ||!emailFrom){
      return res.status(422).send({error: 'All fields are required.'})
    }
 
    //Get data from database
    const file = await File.findOne({
      uuid: uuid
    })
 
    if(file.sender){
      return res.status(422).send({ error: 'Email already sent.' })
    }
 
     file.sender = emailFrom,
     file.receiver = emailTo
 
     const response = await file.save()
 
  //  Send email
    const sendMail = require('../services/emailService')
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'inShare file sharing',
      text: `${emailFrom} shared a file with you`,
      html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: (file.size/1000) + 'KB',
            expires: '24 hours'
      })
    }).then((result) => {
      return res.send({ success: true });
    }).catch((e) => {
       console.log(e)
       return res.status(500).json({error: 'Email sending failed.'})
    })
  }catch(e){
    console.log(e)
    return res.status(500).send({error: 'Something went wrong.'})
  }
})



module.exports = router;