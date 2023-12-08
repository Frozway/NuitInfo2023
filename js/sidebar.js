var sidenav = document.getElementById("mySidenav");
var toggleBtn = document.getElementById("toggleBtn");
var burgerIcon = document.querySelector(".burger-icon");

toggleBtn.onclick = toggleNav;

function toggleNav() {
  if (sidenav.classList.contains("active")) {
    // Si le menu est déjà ouvert, fermez-le
    closeNav();
  } else {
    // Si le menu est fermé, ouvrez-le
    openNav();
  }
}

/* Set the width of the side navigation to 250px and activate the burger animation */
function openNav() {
  sidenav.classList.add("active");
  burgerIcon.classList.add("active");
}

/* Set the width of the side navigation to 0 and deactivate the burger animation */
function closeNav() {
  sidenav.classList.remove("active");
  burgerIcon.classList.remove("active");
}
