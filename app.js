require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
const S3 = require("aws-sdk/clients/s3")
const AWS = require("aws-sdk")
const mysql = require("mysql")
const pool = mysql.createPool({
  host: process.env.AWS_Myslq_Host,
  user: "admin",
  password: process.env.AWS_Myslq_Password,
  database: "msg_board",
  port: 3306,
})

const { renderFile } = require("ejs")
app.engine("html", require("ejs").renderFile)

const bodyParser = require("body-parser")
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: "200mb" }))
// app.use(express.json())
app.use(express.static("public"))
app.use(cors())

app.get("/", (req, res) => {
  res.render("index.html")
})

app.post("/upload", (req, res) => {
  const result = req.body
  const msgResult = result.textinput
  const imgResult = result.imagedata
  // console.log(result)
  // console.log(msgResult)
  // console.log(imgResult)
  let time = new Date().getTime()
  let imageBuffer = new Buffer.from(
    imgResult.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  )
  // console.log(imageBuffer)
  const params = {
    Bucket: "msg-board-s3-bucket",
    Key: `msgboard/${time}`,
    Body: imageBuffer,
    ContentEncoding: "base64",
    ContentType: "image/png",
    // ContentType: "mime/type",
  }
  // const s3 = new S3({ region, accessKeyId, secretAccessKey })

  const region = process.env.AWS_region
  const Bucket = process.env.AWS_BUCKET_NAME
  const accessKeyId = process.env.AWS_ACCESS_KEY
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  AWS.config.update({
    Bucket: Bucket,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
  })

  const s3 = new S3()
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).json({ result: "error" })
    } else {
      console.log("uploaded to s3")
      RDSUrl = "https://dk0tbawkd0lmu.cloudfront.net" + `/msgboard/${time}`
      // console.log(RDSUrl)
      pool.getConnection(function (err, connection) {
        let sql = "insert msg(txtContent, imgContent) values(?,?);"
        connection.query(
          sql,
          [msgResult, RDSUrl],
          function (error, res, fields) {
            if (error) {
              console.log(error)
              reject(error)
            } else {
              // resolve(RDSUrl)
              console.log("uploaded to RDS")
            }
          }
        )
        connection.release()
      })
      res.status(200).json({ result: "ok" })
    }
  })
})

app.get("/get", (req, res) => {
  pool.getConnection(function (err, connection) {
    let sql = "select * from msg order by id;"

    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err.message)
        return
      }
      res.send(result)
    })
    connection.release()
  })
})

app.listen(3000, function () {
  console.log("server started")
})
