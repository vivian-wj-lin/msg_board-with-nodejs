const fileInput = document.querySelector(".fileinput")
const textInput = document.querySelector(".textinput")
const submitBtn = document.querySelector(".submit-btn")
const contentsContainer = document.querySelector(".contentsContainer")
const fileReader = new FileReader()

function createContents(textInput, imageUrl) {
  let postDiv = document.createElement("div")
  let submittedText = document.createElement("div")
  submittedText.textContent = textInput
  let submittedImg = document.createElement("img")
  submittedImg.src = imageUrl
  let Hr = document.createElement("hr")

  postDiv.appendChild(submittedText)
  postDiv.appendChild(submittedImg)
  postDiv.appendChild(Hr)
  contentsContainer.prepend(postDiv)
}

submitBtn.addEventListener("click", (e) => {
  e.preventDefault()
  fileReader.readAsDataURL(fileInput.files[0])
  fileReader.onload = () => {
    let imagedata = fileReader.result
    let data = {
      imagedata: imagedata, //base64
      textinput: textInput.value,
    }
    console.log(data)
    // send data to backend
    console.log(imagedata) //base64
    fetch("/upload", {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      // .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          createContents(textInput.value, imagedata)
        }
        return res.json()
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => console.error("Error:", error))
  }
})

async function loadContents() {
  try {
    const response = await fetch("/get", {
      method: "GET",
      headers: new Headers({
        "content-type": "application/json",
      }),
    })
    const data = await response.json()
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      createContents(data[i].txtContent, data[i].imgContent)
    }
  } catch (error) {
    console.error(error)
  }
}
loadContents()
