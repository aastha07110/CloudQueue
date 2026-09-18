const applications = JSON.parse(
  localStorage.getItem("cloudqueue-applications")
) || [];

const addApplicationButton = document.getElementById("add-application-button");
const applicationModal = document.getElementById("application-modal");
const closeModalButton = document.getElementById("close-modal-button");
const cancelButton = document.getElementById("cancel-button");
const saveApplicationButton = document.getElementById("save-application-button");

const companyInput = document.getElementById("company-input");
const roleInput = document.getElementById("role-input");
const statusInput = document.getElementById("status-input");
const nextStepInput = document.getElementById("next-step-input");

const recentList = document.getElementById("recent-list");
const totalCount = document.getElementById("total-count");
const progressCount = document.getElementById("progress-count");
const interviewCount = document.getElementById("interview-count");
const offerCount = document.getElementById("offer-count");

addApplicationButton.addEventListener("click", function () {
  applicationModal.classList.remove("hidden");
});

closeModalButton.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);

function closeModal() {
  applicationModal.classList.add("hidden");
}

saveApplicationButton.addEventListener("click", function () {
  const company = companyInput.value.trim();
  const role = roleInput.value.trim();
  const status = statusInput.value;
  const nextStep = nextStepInput.value.trim();

  if (company === "" || role === "") {
    alert("Please enter both company name and role.");
    return;
  }

  const application = {
    company: company,
    role: role,
    status: status,
    nextStep: nextStep,
    createdAt: new Date().toLocaleDateString()
  };

  applications.push(application);
  localStorage.setItem(
  "cloudqueue-applications",
  JSON.stringify(applications)
);

  renderApplications();
  updateStatistics();

  companyInput.value = "";
  roleInput.value = "";
  statusInput.value = "Wishlist";
  nextStepInput.value = "";

  closeModal();
});

function renderApplications() {
  recentList.innerHTML = "";

  applications.slice().reverse().forEach(function (application, reverseIndex) {
    const originalIndex = applications.length - 1 - reverseIndex;

    const row = document.createElement("div");

    row.className = "application-row";

    row.innerHTML = `
      <div class="company">
        <span class="company-icon">${application.company.charAt(0).toUpperCase()}</span>
        <strong>${application.company}</strong>
      </div>

      <p>${application.role}</p>

      <span class="status">${application.status}</span>

      <p>${application.nextStep || "No next step"}</p>

      <button class="delete-button" data-index="${originalIndex}">
        Delete
      </button>
    `;

    const deleteButton = row.querySelector(".delete-button");

    deleteButton.addEventListener("click", function () {
      applications.splice(originalIndex, 1);

      localStorage.setItem(
        "cloudqueue-applications",
        JSON.stringify(applications)
      );

      renderApplications();
      updateStatistics();
    });

    recentList.appendChild(row);
  });
}

function updateStatistics() {
  const total = applications.length;

  const inProgress = applications.filter(function (application) {
    return application.status === "Applied" || application.status === "Interviewing";
  }).length;

  const interviews = applications.filter(function (application) {
    return application.status === "Interviewing";
  }).length;

  const offers = applications.filter(function (application) {
    return application.status === "Offer";
  }).length;

  totalCount.textContent = total;
  progressCount.textContent = inProgress;
  interviewCount.textContent = interviews;
  offerCount.textContent = offers;
}
renderApplications();
updateStatistics();