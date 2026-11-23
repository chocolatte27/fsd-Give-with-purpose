import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { collection, addDoc, getDocs, getDoc, doc, query, where,
         updateDoc, increment, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

let currentUser = null, userData = null, selectedNgo = null;
const ngoCache = {};

// ---------- Auth state ----------
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  userData = user ? (await getDoc(doc(db, "users", user.uid))).data() : null;
  const btn = document.querySelector(".login-btn");
  btn.textContent = user ? "Logout" : "Login";
  btn.onclick = user ? () => signOut(auth) : () => window.openLogin();
  if (userData) loadNgos(userData.city);
});

// ---------- Login ----------
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("loginMsg");
  try {
    await signInWithEmailAndPassword(auth,
      document.getElementById("loginEmail").value,
      document.getElementById("loginPassword").value);
    msg.textContent = "✓ Logged in";
    setTimeout(() => closeModal("loginModal"), 1000);
  } catch (err) { msg.textContent = err.message; }
});

async function ensureUserData() {
  if (!userData && currentUser) {
    const snap = await getDoc(doc(db, "users", currentUser.uid));
    userData = snap.data();
    if (userData) loadNgos(userData.city);
  }
  return userData;
}

function compressImage(file, maxSize = 600) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * scale;
      c.height = img.height * scale;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// ---------- Sell / list an item ----------
window.submitSell = async () => {
  if (!currentUser) return alert("Please log in first");
  if (!(await ensureUserData())) return alert("Profile not found. Please log out and sign up again.");
  const title = document.getElementById("sellTitle").value.trim();
  const category = document.getElementById("sellCategory").value.toLowerCase();
  const price = Number(document.getElementById("sellPrice").value);
  if (!title || !price) return alert("Fill all fields");
  const file = document.getElementById("sellPhoto").files[0];
  const photo = file ? await compressImage(file) : null;
  try {
    await addDoc(collection(db, "listings"), {
      title, category, price, type: "sell",
      photo,
      sellerUid: currentUser.uid, sellerName: userData.name,
      city: userData.city, status: "available",
      createdAt: serverTimestamp()
    });
    alert("Item listed!");
    loadListings();
    closeModal("sellModal");
  } catch (err) { alert(err.message); }
};

// ---------- NGOs for the donor's city ----------
async function loadNgos(city) {
  const snap = await getDocs(query(collection(db, "ngos"),
    where("verified", "==", true), where("city", "==", city)));
    if (snap.empty) return;               // keeps your static cards if none found
    document.querySelector(".ngo-list").innerHTML = snap.docs.map(d => {
    const n = d.data(); ngoCache[d.id] = n.name;
    return `
    <div class="ngo-card">
      <div class="ngo-top">
        <div class="ngo-logo">${n.name[0]}</div>
        <div><h3>${n.name}</h3><span class="verified">✓ Verified organisation</span></div>
      </div>
      <p>${n.focus || ""}</p>
      <div class="need-box"><span>Currently needed</span>
        <div class="needs">
          ${n.needsBooks > 0 ? `<b>📚 ${n.needsBooks} Books</b>` : ""}
          ${n.needsClothes > 0 ? `<b>👕 ${n.needsClothes} Clothes</b>` : ""}
        </div>
      </div>
      <div class="ngo-bottom"><span>📍 ${n.city}</span>
        <button onclick="openDonation('${d.id}')">Donate</button></div>
    </div>`;
  }).join("");
}

// ---------- Donate ----------
const origOpenDonation = window.openDonation;
window.openDonation = (ngoId) => {
  selectedNgo = ngoId ? { id: ngoId, name: ngoCache[ngoId] } : null;
  origOpenDonation();
};

window.submitDonation = async () => {
  if (!currentUser) return alert("Please log in first");
  if (!(await ensureUserData())) return alert("Profile not found. Please log out and sign up again.");
  const quantity = Number(document.getElementById("donationQuantity").value);
  if (!quantity) return alert("Enter a quantity");
  try {
    await addDoc(collection(db, "donations"), {
      donorUid: currentUser.uid,
      ngoId: selectedNgo?.id ?? null, ngoName: selectedNgo?.name ?? null,
      type: document.getElementById("donationType").value,
      quantity,
      delivery: document.getElementById("donationDelivery").value,
      status: "pending", createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, "users", currentUser.uid), { points: increment(quantity * 5) });
    alert("Donation created! Points added.");
    closeModal("donationModal");
  } catch (err) { alert(err.message); }
};

const demoCount = products.length;   // your 6 demo items from script.js

async function loadListings() {
  products.length = demoCount;       // avoids duplicates on reload
  const snap = await getDocs(query(collection(db, "listings"),
    where("status", "==", "available")));
  snap.docs.forEach(d => {
    const l = d.data();
    products.push({
      name: l.title, category: l.category, price: l.price,
      photo: l.photo || null,
      seller: l.sellerName, transactions: 0,
      icon: l.category === "book" ? "📘" : "👕"
    });
  });
  displayProducts(products);
}
loadListings();