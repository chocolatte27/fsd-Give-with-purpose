import { auth, db } from "./firebase.js";
import { collection, addDoc, getDocs, query, where }
  from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

export async function addListing(data) {
  await addDoc(collection(db, "listings"), {
    ...data,
    sellerUid: auth.currentUser.uid,
    status: "available"
  });
}

export async function getListings(city) {
  const q = query(collection(db, "listings"),
    where("city", "==", city), where("status", "==", "available"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}