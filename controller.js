const model = require("./model")
const msgModel = new model()

class msgController {
  async showSubmittedMsg() {
    return await new Promise((resolve, reject) => {
      try {
        let msgs = msgModel.showSubmittedMsg()
        resolve({ status: 200, data: msgs })
      } catch (error) {
        reject({ status: 500, data: error })
      }
    })
  }

  async uploadData(data) {
    return await new Promise((resolve, reject) => {
      try {
        let imgUrl = msgModel.uploadData(data)
        resolve({ status: 200, data: imgUrl })
      } catch (error) {
        reject({ status: 500, data: error })
      }
    })
  }
}

module.exports = msgController
