const e = require('express')
const express = require('express')
const multer = require('multer')
const { WebSocketServer } = require('ws')
const path = require('path');
const app = express()
const port = 3000

app.use(express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const server = app.listen(port, () => console.log(`My Chat app listening on port ${port}!`))
const wss = new WebSocketServer({server})

wss.on('connection', (ws) =>{
    console.log("is this the user")
    ws.on('message', (data)=>{
        const message = data.toString()

        wss.clients.forEach(client =>{
            if (client.readyState === 1) {
                client.send(message)
            }
        })
        
    })
})

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/')
    },
    filename: (req, file, cb)=>{
        const uniqueSuffix = Date.now() + path.extname(file.originalname)
        cb(null, file.fieldname + "-" + uniqueSuffix )
    }
})
const upload = multer({storage: storage})

app.post('/upload',upload.single('avatar'), (req, res) =>{
  try {
    if(!req.file) {
        return res.status(400).json({message: 'Please upload a file'})
    }
    res.json({
        message: "File uploaded successfully!",
        filename: req.file.filename
    })
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})      
