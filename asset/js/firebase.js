  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
  import { getDatabase, ref, push, set, onValue, serverTimestamp, query, limitToLast } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
 
  const firebaseConfig = {
    apiKey: "AIzaSyDNGMFeUMr6TiSX0X4msRrttIY0rjJJGO8",
    authDomain: "wedding03-ff818.firebaseapp.com",
    databaseURL: "https://wedding03-ff818-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wedding03-ff818",
    storageBucket: "wedding03-ff818.firebasestorage.app",
    messagingSenderId: "307470739649",
    appId: "1:307470739649:web:a4a6b0ffbe2ea2728e8c40"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const dbRef = ref(db, "ediagus");

  // DOM Elements
  const commentForm = document.getElementById("commentForm");
  const listKomentar = document.getElementById("listKomentar");

  // Handle Form Submission
  if (commentForm) {
    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const nama = document.getElementById("nama").value;
      const isi = document.getElementById("isi").value;
      const submitBtn = commentForm.querySelector('button[type="submit"]');
      const originalBtnContent = submitBtn.innerHTML;

      // Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Mengirim...`;

      try {
        const newCommentRef = push(dbRef);
        await set(newCommentRef, {
          nama: nama,
          isi: isi,
          timestamp: serverTimestamp()
        });
        
        // Success
        commentForm.reset();
      } catch (error) {
        console.error("Gagal mengirim komentar:", error);
        alert("Maaf, gagal mengirim ucapan. Silakan coba lagi.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
    });
  }

  // Helper to get random-ish gradient based on name
  const getAvatarGradient = (name) => {
    const colors = [
      "from-indigo-500 to-purple-700", // Deep Purple
      "from-blue-600 to-indigo-800",   // Royal Blue
      "from-emerald-600 to-teal-800",  // Deep Teal
      "from-orange-500 to-red-700",    // Rich Orange
      "from-fuchsia-600 to-purple-800"  // Vivid Fuchsia
    ];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  // Listen for Comments (Real-time)
  onValue(dbRef, (snapshot) => {
    if (listKomentar) {
      listKomentar.innerHTML = ""; // Bersihkan list sebelum isi ulang
      
      const data = snapshot.val();
      if (data) {
        // Balik urutan agar yang terbaru di atas
        const comments = Object.entries(data).reverse();
        
        comments.forEach(([key, comment]) => {
          const name = comment.nama || "Tamu Tanpa Nama";
          const initial = name.charAt(0).toUpperCase();
          const gradient = getAvatarGradient(name);
          const date = comment.timestamp ? new Date(comment.timestamp) : new Date();
          const timeString = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          const dateString = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

          const commentElement = `
            <div class="bg-white/60 p-6 rounded-3xl border border-white/80 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in-up">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-9 h-9 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold ring-2 ring-white shadow-sm uppercase">
                        ${initial}
                    </div>
                    <div class="flex flex-col">
                      <span class="font-bold text-gray-800 leading-none">${name}</span>
                      <span class="text-[9px] text-pink-400 mt-1 font-medium tracking-tighter">Tamu Undangan</span>
                    </div>
                    <div class="ml-auto text-right">
                        <span class="block text-[10px] text-gray-400 italic">${dateString}</span>
                        <span class="block text-[9px] text-gray-300 font-bold tracking-widest">${timeString}</span>
                    </div>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed italic pl-1 border-l-2 border-pink-100 ml-4">"${comment.isi}"</p>
            </div>
          `;
          listKomentar.insertAdjacentHTML('beforeend', commentElement);
        });

      } else {
        listKomentar.innerHTML = `
          <div class="py-12 text-center">
            <i class="fa-solid fa-feather text-pink-100 text-4xl mb-4"></i>
            <p class="text-gray-400 text-sm italic">Belum ada ucapan. Jadilah yang pertama memberikan doa!</p>
          </div>
        `;
      }
    }
  });
