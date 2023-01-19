require("dotenv").config()
const mysql = require("mysql")
const pool = mysql.createPool({
  host: process.env.AWS_Myslq_Host,
  user: "admin",
  password: process.env.AWS_Myslq_Password,
  database: "msg_board",
  port: 3306,
})
const cloudFront = process.env.cloudFront
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS = require("aws-sdk")
const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
})

class msgModel {
  async showSubmittedMsg() {
    return await new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        let sql = "select * from comment order by id;"

        connection.query(sql, function (error, result, fields) {
          if (error) {
            console.log(error)
            reject(error)
          } else {
            resolve(result)
          }
        })
        connection.release()
      })
    })
  }

  async uploadData(data) {
    return await new Promise((resolve, reject) => {
      let commentMes = data.comment
      let imageData = data.image
      let imageBuffer = Buffer.from(
        imageData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      )
      s3.upload(
        {
          Bucket: "msg_board",
          Body: imageBuffer,
          ContentEncoding: "base64",
          ContentType: "image/jpeg",
        },
        (error, data) => {
          if (error) {
            console.log(error)
          } else {
            console.log("done")

            let imgUrl = `https://${cloudFront}/msg_board/`

            pool.getConnection(function (err, connection) {
              let sql = "insert comment(message, image) values(?,?);"
              connection.query(
                sql,
                [commentMes, imgUrl],
                function (error, res, fields) {
                  if (error) {
                    console.log(error)
                    reject(error)
                  } else {
                    resolve(imgUrl)
                  }
                }
              )
              connection.release()
            })
          }
        }
      )
    })
  }
}

module.exports = msgModel
