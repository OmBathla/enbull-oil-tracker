import { signup, login } from "./modules/auth.js";
import { showToast } from "./modules/toast.js";

const loginPanel = document.getElementById("loginPanel");
const signupPanel = document.getElementById("signupPanel");

document.getElementById("showSignup").addEventListener("click", (e) => {
  e.preventDefault();
  loginPanel.style.display = "none";
  signupPanel.style.display = "block";
});

document.getElementById("showLogin").addEventListener("click", (e) => {
  e.preventDefault();
  signupPanel.style.display = "none";
  loginPanel.style.display = "block";
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const result = login(email, password);
  if (result.success) {
    window.location.href = "index.html";
  } else {
    showToast(result.message, "error");
  }
});

document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const result = signup(name, email, password);
  if (result.success) {
    window.location.href = "index.html";
  } else {
    showToast(result.message, "error");
  }
});