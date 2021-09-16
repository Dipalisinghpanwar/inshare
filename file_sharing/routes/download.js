const express = require('express');
const router = express.Router();
const File = require('../models/file')


router.get('/:uuid', async (req,res) => {
   try{
        const file = await File.findOne({
        uuid: req.params.uuid
    })
    console.log(file)
    if(!file){
        return res.status(500).send({error: 'Link has been expired.'})
    }
  
    const filepath = `${__dirname}/../${file.path}`
  // console.log(filepath)
    res.download(filepath)
    }catch(e){
      console.log(e)
      return res.status(500).send({Message:e})
   }
})



module.exports = router;