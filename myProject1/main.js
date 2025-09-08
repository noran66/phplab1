document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault(); 

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let message = document.getElementById("message").value.trim();

  
  let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (name === "" || email === "" || message === "") {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  if (!email.match(emailPattern)) {
    alert("❌ Please enter a valid email address.");
    return;
  }

 
  alert("✅ Thank you " + name + "! Your message has been sent successfully.");
  
  
  document.getElementById("contact-form").reset();
});
const hiddenElements = document.querySelectorAll('.hidden');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

hiddenElements.forEach(el => observer.observe(el));

const toggleBtn = document.getElementById('theme-toggle');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
});

function animateCounter(counter) {
  let target = +counter.getAttribute("data-target");
  let count = 0;
  let speed = target / 200; // سرعة العداد

  let updateCounter = setInterval(() => {
    count += speed;
    if (count >= target) {
      counter.textContent = target;
      clearInterval(updateCounter);
    } else {
      counter.textContent = Math.floor(count);
    }
  }, 20);
}

const counters = document.querySelectorAll(".counter");
const countersSection = document.querySelector("#counters");
let started = false;

window.addEventListener("scroll", () => {
  let sectionTop = countersSection.offsetTop - window.innerHeight + 100;
  if (!started && window.scrollY > sectionTop) {
    counters.forEach(counter => animateCounter(counter));
    started = true;
  }
});

const backToTopBtn = document.getElementById("backToTop");

window.onscroll = function() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
};


backToTopBtn.addEventListener("click", function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
