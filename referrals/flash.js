const db = firebase.firestore();

// Function to load all flash sale products
const db = firebase.firestore();

// Real-time listener for flash sales
db.collection("flash_sale").orderBy("timestamp", "desc")
  .onSnapshot(snapshot => {
    const container = document.getElementById("flashContainer");
    container.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "flash-card";

      div.innerHTML = `
        <img src="${data.imageUrl}">
        <h3>${data.name}</h3>
        <p>${data.description}</p>
        <p>Old Price: ₦${data.oldPrice}</p>
        <p>Current Bid: ₦<span id="bid-${doc.id}">${data.startPrice}</span></p>
        <input type="number" id="input-${doc.id}" placeholder="Your Bid">
        <button onclick="placeBid('${doc.id}', ${data.startPrice})">Place Bid</button>
      `;

      container.appendChild(div);
    });
  });

// Place a bid
window.placeBid = async (id, currentBid) => {
  const input = document.getElementById(`input-${id}`);
  const bid = Number(input.value);

  if (!bid || bid <= currentBid) {
    alert("Your bid must be higher than the current bid!");
    return;
  }

  await db.collection("flash_sale").doc(id).update({
    startPrice: bid
  });

  alert("Bid placed successfully!");
};


// Function to place a bid
window.placeBid = async (id, currentBid) => {
  const input = document.getElementById(`input-${id}`);
  const bid = Number(input.value);

  if (!bid || bid <= currentBid) {
    alert("Your bid must be higher than the current bid!");
    return;
  }

  await db.collection("flash_sale").doc(id).update({
    startPrice: bid
  });

  document.getElementById(`bid-${id}`).innerText = bid;
  alert("Bid placed successfully!");
};

loadFlashSales();
