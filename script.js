// NAVIGATION
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function gotoSignUp() {
  showPage("signupPage");
}

function gotoLogin() {
  showPage("loginPage");
}

function showSignUpForm() {
  document.getElementById("signupFormFields").classList.remove("hidden");
  document.querySelector(".terms-box").classList.add("hidden");
}

// SHOW EXTRA FIELD BASED ON ROLE
function showExtraField() {
  const role = document.getElementById("roleSelect").value;
  const field = document.getElementById("extraField");
  if (role === "student") {
    field.placeholder = "Enter LRN";
    field.classList.remove("hidden");
  } else if (role === "teacher") {
    field.placeholder = "Enter Employee Number";
    field.classList.remove("hidden");
  } else {
    field.classList.add("hidden");
  }
}

// LOCAL STORAGE USERS
function signup() {
  const name = signupName.value.trim();
  const pass = signupPass.value.trim();
  const role = roleSelect.value;
  const extra = extraField.value.trim();

  if(!name || !pass || !role || !extra) return alert("Fill all fields.");
  
  let users = JSON.parse(localStorage.getItem("arkiboUsers")||"[]");
  if(users.find(u=>u.name===name)) return alert("User already exists.");
  
  users.push({name, pass, role, extra});
  localStorage.setItem("arkiboUsers", JSON.stringify(users));
  alert("Signup successful!");
  gotoLogin();
}

function login() {
  const name = loginName.value.trim();
  const pass = loginPass.value.trim();
  let users = JSON.parse(localStorage.getItem("arkiboUsers")||"[]");
  const user = users.find(u=>u.name===name && u.pass===pass);
  if(!user) return alert("Invalid credentials.");
  
  localStorage.setItem("arkiboCurrentUser", JSON.stringify(user));
  showPage("menuPage");
  loadArchivesButtons(); // load archives buttons when logged in
}

// PROFILE
function showProfile() {
  const user = JSON.parse(localStorage.getItem("arkiboCurrentUser"));
  profileName.innerText = "Name: "+user.name;
  profileRole.innerText = "Role: "+user.role.toUpperCase();
  showPage("profilePage");
}

function logout() {
  localStorage.removeItem("arkiboCurrentUser");
  gotoLogin();
}

// MAIN MENU NAVIGATION
function goTo(section){
  showPage(section+"Page");
}

function backToMenu(){
  showPage("menuPage");
}

// ARKIBO ARCHIVES TEACHERS LIST
const teacherArchives = [
  { name: "AMY POTENTE", subject: "GENERAL CHEMISTRY", link: "https://drive.google.com/drive/folders/1rCVPR80boQjAc_XR8hIAIfRCtqs9HzCG" },
  { name: "EIZEL TAGBACAOLA", subject: "PAGSUSULAT NG KULTURANG PILIPINO", link: "https://drive.google.com/drive/folders/1Vt8SV-GpAKlf4QdN-xDarZ2SNuYcUUQ6" },
  { name: "MARIFE DIEZ", subject: "ENTREPRENEURSHIP", link: "https://drive.google.com/drive/folders/1NzuUku6DC3nqoIbxhwlKXWYE1_EYP5Fg" },
  { name: "NENA HOYOHOY", subject: "GENERAL BIOLOGY", link: "https://drive.google.com/drive/folders/1pbX_Tt9ixr7sARh_thjvA7iWvptQKc0M" }
];

// dynamically load archive buttons
function loadArchivesButtons() {
  const archivesDiv = document.getElementById("archivesPage");
  archivesDiv.innerHTML = `<h2>Arkibo Study Archives</h2>
    <p class="warning">
      ⚠️ STRICT WARNING: Only teachers may upload files. Misbehavior or unauthorized uploading 
      will be penalized. Your Gmail account is visible when uploading.
    </p>
  `;

  teacherArchives.forEach(teacher => {
    const btn = document.createElement("button");
    btn.textContent = `TEACHER: ${teacher.name} - ${teacher.subject}`;
    btn.onclick = () => window.open(teacher.link);
    archivesDiv.appendChild(btn);
  });

  // Back to menu button
  const backBtn = document.createElement("button");
  backBtn.textContent = "Back to Menu";
  backBtn.className = "backBtn";
  backBtn.onclick = backToMenu;
  archivesDiv.appendChild(backBtn);
}

// MAIN MENU ADDITION: Arkibo Arcade Button
function addArcadeButton() {
  const menuDiv = document.querySelector("#menuPage .menu-buttons");
  const arcadeBtn = document.createElement("button");
  arcadeBtn.textContent = "🎮 Arkibo Arcade";
  arcadeBtn.onclick = () => window.open("https://malacatnicolorenzo-19.github.io/arkibo-arcade/");
  menuDiv.appendChild(arcadeBtn);
}

// STUDY SCHEDULER / REMINDERS with Directory + LocalStorage
function loadReminders() {
  const reminders = JSON.parse(localStorage.getItem("arkiboReminders") || "[]");
  const list = document.getElementById("reminderList");
  list.innerHTML = "";

  if (reminders.length === 0) {
    list.innerHTML = "<p>No reminders yet.</p>";
    return;
  }

  reminders.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${r.name} — ${new Date(r.date).toLocaleString()}`;
    const del = document.createElement("button");
    del.textContent = "🗑️";
    del.onclick = () => deleteReminder(i);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function loadSchedules() {
  const schedules = JSON.parse(localStorage.getItem("arkiboSchedules") || "[]");
  const list = document.getElementById("scheduleList");
  list.innerHTML = "";

  if (schedules.length === 0) {
    list.innerHTML = "<p>No study schedules yet.</p>";
    return;
  }

  schedules.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = `${s.subj} — ${new Date(s.time).toLocaleString()}`;
    const del = document.createElement("button");
    del.textContent = "🗑️";
    del.onclick = () => deleteSchedule(i);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function addReminder() {
  const name = reminderName.value.trim();
  const date = reminderDate.value;
  if (!name || !date) return alert("Please fill in all fields.");

  let reminders = JSON.parse(localStorage.getItem("arkiboReminders") || "[]");
  reminders.push({ name, date });
  localStorage.setItem("arkiboReminders", JSON.stringify(reminders));

  reminderName.value = "";
  reminderDate.value = "";
  alert("Reminder added successfully!");
}

function addSchedule() {
  const subj = subject.value.trim();
  const time = studyTime.value;
  if (!subj || !time) return alert("Please fill in all fields.");

  let schedules = JSON.parse(localStorage.getItem("arkiboSchedules") || "[]");
  schedules.push({ subj, time });
  localStorage.setItem("arkiboSchedules", JSON.stringify(schedules));

  subject.value = "";
  studyTime.value = "";
  alert("Study schedule added successfully!");
}

function deleteReminder(index) {
  let reminders = JSON.parse(localStorage.getItem("arkiboReminders") || "[]");
  reminders.splice(index, 1);
  localStorage.setItem("arkiboReminders", JSON.stringify(reminders));
  loadReminders();
}

function deleteSchedule(index) {
  let schedules = JSON.parse(localStorage.getItem("arkiboSchedules") || "[]");
  schedules.splice(index, 1);
  localStorage.setItem("arkiboSchedules", JSON.stringify(schedules));
  loadSchedules();
}

// Load reminders/schedules when pages are opened
document.getElementById("reminderListPage").addEventListener("mouseenter", loadReminders);
document.getElementById("scheduleListPage").addEventListener("mouseenter", loadSchedules);
document.getElementById("schedPage").addEventListener("mouseenter", () => {
  loadReminders();
  loadSchedules();
});

// ADD Arcade button when script loads
addArcadeButton();
