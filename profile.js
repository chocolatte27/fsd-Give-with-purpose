import { auth, db } from "./firebase.js";
import { onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs }
  from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const esc = s => String(s ?? "").replace(/[&<>"']/g,
  c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// show the Profile button only when logged in
onAuthStateChanged(auth, user => {
  document.getElementById("profileBtn").style.display = user ? "inline-block" : "none";
});

window.openProfile = async () => {
  const user = auth.currentUser;
  if (!user) return window.openLogin();

  document.getElementById("profileModal").classList.add("show");
  const body = document.getElementById("profileBody");
  body.innerHTML = "Loading...";

  try {
    const [uSnap, dSnap, lSnap] = await Promise.all([
      getDoc(doc(db, "users", user.uid)),
      getDocs(query(collection(db, "donations"), where("donorUid", "==", user.uid))),
      getDocs(query(collection(db, "listings"), where("sellerUid", "==", user.uid)))
    ]);

    const u = uSnap.data();
    if (!u) { body.innerHTML = "Profile not found. Please log out and sign up again."; return; }

    // newest first (sorted here to avoid needing a Firestore index)
    const donations = dSnap.docs.map(d => d.data())
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    const listings = lSnap.docs.map(d => d.data());
    const itemsDonated = donations.reduce((sum, d) => sum + (d.quantity || 0), 0);

    body.innerHTML = `
      <h2>${esc(u.name)}</h2>
      <p>${esc(u.email)} · 📍 ${esc(u.city)}<br>
         ${user.emailVerified ? "✓ Email verified" : "⚠ Email not verified"}</p>

      <div class="profile-stats">
        <div><strong>${u.points || 0}</strong><small>Points</small></div>
        <div><strong>${itemsDonated}</strong><small>Items donated</small></div>
        <div><strong>${donations.length}</strong><small>Donations</small></div>
        <div><strong>${listings.length}</strong><small>Listings</small></div>
      </div>

      <h3>My donations</h3>
      ${donations.length ? donations.map(d => `
        <div class="profile-row">
          <span>${esc(d.quantity)} × ${esc(d.type)} → ${esc(d.ngoName || "Any NGO")}</span>
          <small>${esc(d.status)}</small>
        </div>`).join("") : "<p>No donations yet.</p>"}

      <h3>My listings</h3>
      ${listings.length ? listings.map(l => `
        <div class="profile-row">
          <span>${esc(l.title)} · ₹${esc(l.price)}</span>
          <small>${esc(l.status)}</small>
        </div>`).join("") : "<p>No listings yet.</p>"}
    `;
  } catch (err) {
    body.innerHTML = "Could not load profile: " + esc(err.message);
  }
};