// AOS
AOS.init({
  once: true,
});


// Set the date we're counting down to
const countDownDate = new Date("Feb 1, 2026 08:30:00").getTime();

// Update the countdown every 1 second
const x = setInterval(function () {
  // Get today's date and time
  const now = new Date().getTime();

  // Find the distance between now and the countdown date
  const distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result
  document.getElementById("days").querySelector("div:first-child").innerHTML =
    days.toString().padStart(2, "0");
  document.getElementById("hours").querySelector("div:first-child").innerHTML =
    hours.toString().padStart(2, "0");
  document
    .getElementById("minutes")
    .querySelector("div:first-child").innerHTML = minutes
    .toString()
    .padStart(2, "0");
  document
    .getElementById("seconds")
    .querySelector("div:first-child").innerHTML = seconds
    .toString()
    .padStart(2, "0");

  // If the countdown is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("days").querySelector("div:first-child").innerHTML =
      "00";
    document
      .getElementById("hours")
      .querySelector("div:first-child").innerHTML = "00";
    document
      .getElementById("minutes")
      .querySelector("div:first-child").innerHTML = "00";
    document
      .getElementById("seconds")
      .querySelector("div:first-child").innerHTML = "00";
  }
}, 1000);
// music
document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById("play-and-navigate");
  const audio = document.getElementById("wedding-music");
  const heroSection = document.getElementById("hero");

  window.scrollTo(0, 0);

  function disableScroll(event) {
    event.preventDefault();
  }

  window.addEventListener("scroll", disableScroll);
  window.addEventListener("wheel", disableScroll, { passive: false });
  window.addEventListener("touchmove", disableScroll, { passive: false });
  window.addEventListener("keydown", function (event) {
    if (
      ["ArrowUp", "ArrowDown", "Space", "PageUp", "PageDown"].includes(
        event.key
      )
    ) {
      event.preventDefault();
    }
  });

  playButton.addEventListener("click", function (event) {
    event.preventDefault();

    window.removeEventListener("scroll", disableScroll);
    window.removeEventListener("wheel", disableScroll);
    window.removeEventListener("touchmove", disableScroll);

    if (audio.paused) {
      audio
        .play()
        .catch((error) => console.error("Gagal memutar musik:", error));
    }

    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// My Form
window.addEventListener("load", function () {
  const form = document.getElementById("rsvpForm");
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnContent = submitBtn.innerHTML;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Set Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <div class="flex items-center justify-center gap-2">
        <i class="fa-solid fa-circle-notch animate-spin"></i>
        <span class="tracking-widest uppercase text-sm">Mengirim...</span>
      </div>
    `;

    const data = new FormData(form);
    const action = e.target.action;

    fetch(action, {
      method: "POST",
      body: data,
    })
      .then(() => {
        alert("Terima kasih! Kehadiran Anda telah terkonfirmasi 😊");
        form.reset();
      })
      .catch((error) => {
        alert("Maaf, terjadi kesalahan. Silakan coba lagi nanti.");
        console.error("Error!", error.message);
      })
      .finally(() => {
        // Reset Button State
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      });
  });
});
