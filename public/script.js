const socket = new WebSocket(`ws://${window.location.host}`);
const form = document.getElementById("form");

const textInput = document.getElementById("text-input");
const textBtn = document.getElementById("text-btn");

const fileInput = document.getElementById("file-input");
const fileBtn = document.getElementById("file-btn");

const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
        console.log(data.filename)
      setTimeout(()=>{
        displayImage(data.filename);
      }, 1000)
    }
  } catch (error) {
    console.log("Error" + error);
  }
});

socket.onmessage = (event) => {
  console.log(event);
};
function displayImage(url) {
  const image = document.createElement("img");
  image.src = `/uploads/${url}`
  image.style.height = '300px'
  image.style.width = '300px'
  
  chatBox.append(image);
}
function displayMsg(text) {
  if (text) {
    const div = document.createElement("div");
    div.innerText = text;
    chatBox.append(div);
    textInput.value = ''
  }
}

textBtn.addEventListener("click", () => {
  const text = textInput.value.trim();
  displayMsg(text);
});
