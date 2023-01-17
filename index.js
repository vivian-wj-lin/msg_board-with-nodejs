// const { response } = require("express")

const formfile = document.querySelector(".formfile")
const formtext = document.querySelector(".formtext")
const previewimg = document.querySelector(".preivew-img")
const submitBtn = document.querySelector(".submit-btn")
const submittedtext = document.querySelector(".submitted-text")
const submittedimg = document.querySelector(".submitted-img")
let image_url = ""
let image_type = ""

//img preview
formfile.addEventListener("change", (e) => {
  const image = e.target.files[0]
  console.log(image)
  const reader = new FileReader()
  reader.addEventListener("load", () => {
    image_url = reader.result
    console.log(image_url) //base64
    previewimg.src = `${image_url}`
  })
  reader.readAsDataURL(image) //readAsDataURL is to read blob or file contents
})

function showSubmittedMsg(formtext, formfile) {
  submittedtext.textContent = formtext.value
  submittedimg.src = `${image_url}`
}

//output of submitted text and img
submitBtn.addEventListener("click", function () {
  const image = e.target.files[0]
  console.log(image)
  const reader = new FileReader()
  reader.addEventListener("load", () => {
    image_url = reader.result
    console.log(image_url) //base64
    fetch(`uploadData`, {
      method: "POST",
      body: JSON.stringify({
        txt: formtext.value,
        img: image_url,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        if (response.status != 200) {
          alert("failed to upload")
        }
        return response.json()
      })
      .then(function (data) {
        console.log(data)
        let image_url = data.data
        showSubmittedMsg(formtext, image_url)
      })
  })
  reader.readAsDataURL(image)
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
    })
}
showSubmittedMsg()
