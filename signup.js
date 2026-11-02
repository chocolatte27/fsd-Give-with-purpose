import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, sendEmailVerification }
  from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

export async function signUp(name, email, password, city) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(cred.user);
  await setDoc(doc(db, "users", cred.user.uid), {
    name, email, city,
    role: "user",
    points: 0,
    successfulTransactions: 0,
    createdAt: serverTimestamp()
  });
}
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await signUp(
      document.getElementById("name").value,
      document.getElementById("email").value,
      document.getElementById("password").value,
      document.getElementById("city").value
    );
    alert("Account created! Check your email to verify.");
    closeModal("loginModal");
  } catch (err) {
    alert(err.message);
  }
});