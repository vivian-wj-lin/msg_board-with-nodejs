// const { response } = require("express")
const fileInput = document.querySelector(".fileinput")
const textInput = document.querySelector(".textinput")
const previewImg = document.querySelector(".preivewed-img")
const submitBtn = document.querySelector(".submit-btn")
const submittedContentsDiv = document.querySelector(".submitted-contents")
const fileReader = new FileReader()

// let imageUrl = ""

function createSubmittedMsg(textInput, imageUrl) {
  let submittedTextContainer = document.createElement("div")
  submittedTextContainer.classList.add("submittedTextDiv")
  submittedContentsDiv.prepend(submittedTextContainer)

  let submittedText = document.createElement("div")
  submittedText.textContent = textInput
  submittedTextContainer.appendChild(submittedText)

  let submittedImg = document.createElement("img")
  submittedImg.src = imageUrl
  submittedTextContainer.appendChild(submittedImg)

  let Hr = document.createElement("hr")
  submittedTextContainer.appendChild(Hr)
}

//img preview
fileInput.addEventListener("change", (e) => {
  const image = e.target.files[0]
  console.log(image)

  fileReader.addEventListener("load", () => {
    imageUrl = reader.result
    console.log(imageUrl) //base64
    previewImg.src = `${imageUrl}`
  })
  reader.readAsDataURL(image) //readAsDataURL is to read blob or file contents
})

//POST submitted text and img
submitBtn.addEventListener("click", function () {
  const image = e.target.files[0]
  console.log(image)
  fileReader.readAsDataURL(image)
  fileReader.onload = () => {
    let imageData = fileReader.result
    fetch(`/uploadData`, {
      method: "POST",
      body: JSON.stringify({
        submittedText: textInput.value,
        submittedImg: imageData,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        if (response.status != 200) {
          alert("failed to upload")
          return
        }
        return response.json()
      })
      .then(function (data) {
        console.log(data)
        let imageUrl = data.data
        createSubmittedMsg(textInput, imageUrl)
      })
  }
})

function showSubmittedMsg() {
  fetch(`/showSubmittedMsg`, {
    method: "GET",
  })
    .then(function (response) {
      if (response.status != 200) {
        alert("failed to upload")
        return
      }
      return response.json()
    })
    .then(function (data) {
      console.log(data)
      msgs = data.data
      msgs.forEach((msg) => {
        let submittedText = msg.submittedText
        let imageUrl = msg.submittedImg
        createComment(submittedText, imageUrl)
      })
    })
}
showSubmittedMsg()
