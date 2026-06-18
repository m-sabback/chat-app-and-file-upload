const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(`${protocol}//${window.location.host}`);

const form = document.getElementById("form");
const textInput = document.getElementById("text-input");
const textBtn = document.getElementById("text-btn");
const fileInput = document.getElementById("file-input");
const chatBox = document.getElementById("chat-box");

// 1. LISTEN FOR MESSAGES FROM THE SERVER
socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    
    // Check if the incoming message is a text message or an image
    if (data.type === 'text') {
      displayMsg(data.content);
    } else if (data.type === 'image') {
      displayImage(data.content);
    }
  } catch (err) {
    // Fallback if raw text is sent
    displayMsg(event.data);
  }
};

// 2. HANDLING TEXT INPUT
textBtn.addEventListener("click", () => {
  const text = textInput.value.trim();
  if (!text) return;

  // Create a structured message object
  const messageObj = { type: 'text', content: text };
  
  // Send it to the server via WebSocket!
  socket.send(JSON.stringify(messageObj));
  
  textInput.value = '';
});

// 3. HANDLING FILE UPLOADS
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const res = await fetch("/upload", { method: "POST", body: formData });
    const data = await res.json();
    
    if (res.ok) {
      // Create an image message object
      const messageObj = { type: 'image', content: data.filename };
      
      // Tell everyone via WebSocket that a new image is ready!
      socket.send(JSON.stringify(messageObj));
      form.reset();
    }
  } catch (error) {
    console.log("Error uploading file: " + error);
  }
});

function displayImage(url) {
  const image = document.createElement("img");
  image.src = `/uploads/${url}`;
  image.style.display = "block";
  image.style.maxWidth = "200px"; // Keeps images clean in the chat box
  chatBox.append(image);
}

function displayMsg(text) {
  if (text) {
    const div = document.createElement("div");
    div.innerText = text;
    chatBox.append(div);
  }
}