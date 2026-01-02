document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
});

function loadNavbar() {
  const navbarContainer = document.getElementById("navbar-container");
  if (!navbarContainer) return;

  // Determine path to navbar.html based on current location
  // Assuming this script is always loaded from a file structure where:
  // root/index.html -> uses "components/navbar.html" (relative to src/) or similar
  // We need to be careful. Let's try to detect the depth.
  
  let componentsPath = "components/navbar.html"; 
  
  // Check if we are in a subfolder (e.g. pages/)
  if (window.location.pathname.includes("/pages/")) {
      componentsPath = "../components/navbar.html";
  }
  
  // Adjust for local file system difference if needed, but relative paths usually work best
  // However, since we are fetching HTML, we need the correct fetch path.

  fetch(componentsPath)
    .then((response) => {
        if (!response.ok) throw new Error("Failed to load navbar");
        return response.text();
    })
    .then((html) => {
      navbarContainer.innerHTML = html;
      
      // Fix links based on location
      fixNavLinks();
      
      // Initialize Navbar Logic
      initNavbar();
      initNavbarActiveState();
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

function fixNavLinks() {
    // If we are in the pages directory, we need to update links to point back to root or other pages correctly
    const isPagesDir = window.location.pathname.includes("/pages/");
    
    if (isPagesDir) {
        const logo = document.querySelector('.navbar .logo');
        if (logo) logo.setAttribute('href', '../../index.html'); // Assuming index.html is in src/ (parent of pages is src) -> actually src/index.html is sibling of src/pages, so ../index.html

        // Fix logic:
        // Structure:
        // src/index.html
        // src/pages/Login.html
        // src/components/navbar.html
        
        // If in pages/, index is ../index.html
        if (logo) logo.setAttribute('href', '../index.html');

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('index.html')) {
                link.setAttribute('href', '../' + href);
            }
        });
        
        // Fix Auth buttons if they are relative to src/
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        
        // In navbar.html they are "pages/Login.html"
        // If we are in pages/, we should just start with "Login.html" or stay same?
        // "pages/Login.html" from "src/" works.
        // "pages/Login.html" from "src/pages/" fails (looks for src/pages/pages/Login.html).
        
        if (loginBtn) loginBtn.setAttribute('href', 'Login.html');
        if (signupBtn) signupBtn.setAttribute('href', 'Signup.html');
        
    } else {
        // We are in src/ (root for the app)
        // Links are already "index.html#..." which is correct.
        // Auth links are "pages/Login.html" which is correct.
    }
}

/* ===== NAVBAR LOGIC (Moved from main.js) ===== */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  // Scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
      document.body.classList.toggle("nav-open");
    });
  }
  
  // Dropdown Toggle for Mobile
  const dropdownTrigger = document.querySelector('.dropdown-trigger');
  const dropdownItem = document.querySelector('.nav-item-dropdown');
  
  if (dropdownTrigger && dropdownItem) {
      dropdownTrigger.addEventListener('click', function(e) {
          // Only for mobile (screen width check or just toggle behavior)
          if (window.innerWidth <= 1024) {
              e.preventDefault();
              dropdownItem.classList.toggle('active');
          }
      });
  }

  // Close mobile nav on link click
  const navLinkItems = document.querySelectorAll(".nav-link:not(.dropdown-trigger), .dropdown-link");
  navLinkItems.forEach((link) => {
    link.addEventListener("click", function () {
      navToggle.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.classList.remove("nav-open");
    });
  });

  // Close on outside click
  document.addEventListener("click", function (e) {
    if (
        !navbar.contains(e.target) && 
        navLinks.classList.contains("active") && 
        !e.target.closest('.nav-toggle') // don't close if clicking toggle
    ) {
      navToggle.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.classList.remove("nav-open");
    }
  });
}

function initNavbarActiveState() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {
    let current = "";
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      // Check if href ends with #current
      const href = link.getAttribute("href");
      if (href && href.includes("#" + current) && current !== "") {
        link.classList.add("active");
      }
    });
  });
}
