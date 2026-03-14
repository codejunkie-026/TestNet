// chat.js — connects chat system to backend
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return; // only show chat if logged in

  console.log("✅ chat.js loaded for", user.email);

  // Create floating chat bubble
  const chatBubble = document.createElement("div");
  chatBubble.innerHTML = "💬";
  Object.assign(chatBubble.style, {
    position: "fixed",
    bottom: "25px",
    right: "25px",
    background: "#ffa500",
    color: "white",
    fontSize: "20px",
    padding: "15px",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
    zIndex: "9999"
  });
  chatBubble.title = "Messages";
  document.body.appendChild(chatBubble);

  // Chat window
  const chatWindow = document.createElement("div");
  Object.assign(chatWindow.style, {
    position: "fixed",
    bottom: "90px",
    right: "25px",
    width: "320px",
    height: "420px",
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "10px",
    display: "none",
    flexDirection: "column",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: "9999"
  });
  document.body.appendChild(chatWindow);

  // Header
  const header = document.createElement("div");
  header.innerHTML = `<strong>Messages</strong>`;
  Object.assign(header.style, {
    background: "#ffa500",
    color: "white",
    padding: "10px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    textAlign: "center"
  });
  chatWindow.appendChild(header);

  // Chat body
  const chatBody = document.createElement("div");
  Object.assign(chatBody.style, {
    flex: "1",
    overflowY: "auto",
    padding: "10px"
  });
  chatWindow.appendChild(chatBody);

  // Input area
  const inputArea = document.createElement("div");
  inputArea.style.display = "flex";
  inputArea.style.padding = "8px";
  inputArea.innerHTML = `
    <input type="text" id="chatMessageInput" placeholder="Type a message..." 
      style="flex:1;padding:6px;border:1px solid #ccc;border-radius:6px;">
    <button id="sendMsgBtn" 
      style="margin-left:5px;background:#008000;color:white;border:none;
      padding:6px 10px;border-radius:6px;cursor:pointer;">Send</button>
  `;
  chatWindow.appendChild(inputArea);

  let activeChatId = null;

  // Toggle chat
  chatBubble.addEventListener("click", () => {
    chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
    chatBody.innerHTML = "<p style='text-align:center;color:#777;'>Select a seller or start chatting...</p>";
  });

  // Open chat manually from seller page
  window.openChatWithSeller = function() {
    const listing = JSON.parse(localStorage.getItem("selectedListing"));
    if (!listing) return alert("No seller found.");
    const sellerEmail = listing.sellerEmail || "seller@example.com";
    openChat(sellerEmail);
    chatWindow.style.display = "flex";
  };

  // Open chat
  function openChat(email) {
    activeChatId = [user.email, email].sort().join("_");
    renderMessages();
  }

  // Load messages from backend
  async function renderMessages() {
    if (!activeChatId) return;
    const receiver = activeChatId.replace(user.email, "").replace("_", "");
    chatBody.innerHTML = "<p style='text-align:center;color:#777;'>Loading...</p>";

    try {
      const res = await fetch(`http://localhost:58640/api/messages/${encodeURIComponent(user.email)}/${encodeURIComponent(receiver)}`);
      if (!res.ok) throw new Error("Failed to load messages");
      const msgs = await res.json();

      chatBody.innerHTML = "";
      msgs.forEach(m => {
        const msgDiv = document.createElement("div");
        msgDiv.style.margin = "5px 0";
        msgDiv.style.textAlign = m.sender === user.email ? "right" : "left";
        msgDiv.innerHTML = `
          <span style="display:inline-block;background:${m.sender === user.email ? '#008000':'#eaeaea'};
            color:${m.sender===user.email?'white':'#333'};
            padding:6px 10px;border-radius:10px;max-width:80%;
            word-wrap:break-word;">${m.text}</span>
        `;
        chatBody.appendChild(msgDiv);
      });
      chatBody.scrollTop = chatBody.scrollHeight;
    } catch (err) {
      console.error(err);
      chatBody.innerHTML = "<p style='color:red;text-align:center;'>Error loading messages.</p>";
    }
  }

  // ✅ Reliable send button event (delegated listener)
  chatWindow.addEventListener("click", async (e) => {
    if (e.target && e.target.id === "sendMsgBtn") {
      const input = document.getElementById("chatMessageInput");
      const text = input.value.trim();
      if (!text || !activeChatId) {
        alert("Please open a chat or type a message.");
        return;
      }

      const receiver = activeChatId.replace(user.email, "").replace("_", "");

      try {
        const res = await fetch(" http://192.168.43.29:59414/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: user.email, receiver, text })
        });
        if (!res.ok) throw new Error("Failed to send message");
        input.value = "";
        renderMessages(); // reload after sending
      } catch (err) {
        console.error(err);
        alert("Error sending message: " + err.message);
      }
    }
  });
});
