// reference to Firebase services
const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById("flashSaleForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const oldPrice = Number(document.getElementById("oldPrice").value);
    const startPrice = Number(document.getElementById("startPrice").value);
    const seller = document.getElementById("seller").value;
    const file = document.getElementById("image").files[0];

    // Upload image
    const storageRef = storage.ref("flashsale-images/" + file.name);
    const uploadTask = await storageRef.put(file);
    const imageUrl = await uploadTask.ref.getDownloadURL();

    // Save data into Firestore
    await db.collection("flash_sale").add({
        name,
        description,
        oldPrice,
        startPrice,
        seller,
        imageUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Flash sale product posted!");
});
