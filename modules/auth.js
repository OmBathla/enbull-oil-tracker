const USERS_KEY = "enbullUsers";
const SESSION_KEY = "enbullSession";

function loadUsers() {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(name, email, password) {
  const users = loadUsers();
  if (users.some(u => u.email === email)) {
    return { success: false, message: "An account with this email already exists." };
  }
  users.push({ name, email, password });
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));
  return { success: true };
}

export function login(email, password) {
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, message: "Incorrect email or password." };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
  return { success: true };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function requireAuth() {
  if (!getSession()) {
    window.location.href = "login.html";
  }
}