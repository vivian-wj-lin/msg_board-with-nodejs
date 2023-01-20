const fileInput = document.querySelector(".fileinput")
const textInput = document.querySelector(".textinput")
const submitBtn = document.querySelector(".submit-btn")
const contentsContainer = document.querySelector(".contentsContainer")
const fileReader = new FileReader()

fileInput.addEventListener("change", (e) => {
  const image = e.target.files[0]
  fileReader.addEventListener("load", () => {
    let imagedata = fileReader.result
    console.log(imagedata) //base64
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault()
      let data = {
        imagedata: imagedata, //base64
        textinput: textInput.value,
      }
      console.log(data)
      // send data to backend
      fetch("/upload", {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
        })
        .catch((error) => console.error("Error:", error))
    })
  })
  fileReader.readAsDataURL(image)
})

function createContents(textInput, imageUrl) {
  let ContentsDiv = document.createElement("div")
  ContentsDiv.classList.add("submitted-contents")
  contentsContainer.prepend(submittedTextContainer)

  let submittedText = document.createElement("div")
  submittedText.textContent = textInput
  contentsContainer.appendChild(submittedText)

  let submittedImg = document.createElement("img")
  submittedImg.src = imageUrl
  contentsContainer.appendChild(submittedImg)

  let Hr = document.createElement("hr")
  contentsContainer.appendChild(Hr)
}
