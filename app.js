const express = require("express")
const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use(express.json({ limit: "50mb" }))
app.use(express.static("public"))

// app.set("view engine", "ejs")
// app.set("views", "./views")

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html", function (err) {
    if (err) res.send(404)
  })
})

app.post("/uploadData", async (req, res) => {
  let msgDaga = await commentController.uploadData(req.body)
  if (msgDaga.status == 200) {
    let imgUrl = await msgDaga.data
    console.log(imgUrl)
    res.status(200).json({ ok: true, data: imgUrl })
  } else {
    let data = await msgDaga.data
    res.status(500).json({ ok: false, data: data })
  }
})

app.get("/showSubmittedMsg", async (req, res) => {
  let msgDaga = await commentController.showSubmittedMsg()
  if (msgDaga.status == 200) {
    let data = await msgDaga.data
    res.status(200).json({ ok: true, data: data })
  } else {
    let data = await msgDaga.data
    res.status(500).json({ ok: false, data: data })
  }
})

app.listen(3000, function () {
  console.log("server started")
})
