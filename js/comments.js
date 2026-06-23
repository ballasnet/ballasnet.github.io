import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-RWDPv06t_4TXvzU06DzPhsQXKZ1Bkec",
  authDomain: "ballasnet-100c0.firebaseapp.com",
  projectId: "ballasnet-100c0",
  storageBucket: "ballasnet-100c0.firebasestorage.app",
  messagingSenderId: "31456745285",
  appId: "1:31456745285:web:2db93eed879bb42b81102c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const page = "worldbox";

/* YORUM GÖNDER */
window.sendComment = async function () {
  const name = document.getElementById("name").value;
  const comment = document.getElementById("comment").value;
  const rating = document.querySelector('input[name="rating"]:checked')?.value || 0;
  const captcha = document.getElementById("captcha-answer").value;

  if (!name || !comment) return alert("Boş bırakma");

  // basit captcha (şimdilik 2+2 gibi düşün)
  if (captcha !== "4") return alert("Bot kontrolü başarısız");

  await addDoc(collection(db, "comments"), {
    name,
    comment,
    rating: Number(rating),
    page,
    status: "pending",
    createdAt: Date.now()
  });

  alert("Yorum gönderildi (onay bekliyor)");
};

/* YORUMLARI YÜKLE */
window.loadComments = async function () {
  const q = query(
    collection(db, "comments"),
    where("page", "==", page),
    where("status", "==", "approved")
  );

  const snap = await getDocs(q);

  const list = document.getElementById("comments-list");
  list.innerHTML = "";

  snap.forEach(doc => {
    const c = doc.data();

    list.innerHTML += `
      <div class="comment-item">
        <div class="comment-name">${c.name}</div>
        <div class="comment-stars">${"★".repeat(c.rating)}</div>
        <div class="comment-text">${c.comment}</div>
      </div>
    `;
  });
};

loadComments();