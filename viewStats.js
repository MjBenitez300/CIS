const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  alert("Please login first.");
  window.location.href = "index.html";
}

const departmentSelect = document.getElementById("departmentSelect");
const monthSelect = document.getElementById("monthSelect");  // New element for month
const yearInput = document.getElementById("yearInput");  // New element for year
const statsSection = document.getElementById("statsSection");

// Load employee data from localStorage
function loadEmployeeData() {
  const allPatients = JSON.parse(localStorage.getItem("patients")) || [];
  return allPatients.filter(p => p.type === "employee");  // Only return employee records
}

// Helper function to filter by Month and Year based on walk-in date
function filterByMonthAndYear(p) {
  const selectedMonth = monthSelect.value;
  const selectedYear = parseInt(yearInput.value);

  // Use walkInDate if available, otherwise use p.date
  const walkInDate = p.walkInDate || p.date;  // Assuming walkInDate is in YYYY-MM-DD format
  const recordDate = new Date(walkInDate);  // Parse the walkInDate (or p.date) to a Date object

  // If the date is invalid, skip this record
  if (isNaN(recordDate)) {
    console.error("Invalid date:", walkInDate);  // Log invalid dates for debugging
    return false;  // Skip invalid dates
  }

  const recordMonth = recordDate.getMonth() + 1; // Months are 0-indexed, so add 1
  const recordYear = recordDate.getFullYear();

  console.log(`Checking record with walk-in date: ${walkInDate}, Year: ${recordYear}, Month: ${recordMonth}`);

  // Apply the filtering conditions
  return (
    (selectedMonth === "all" || recordMonth === parseInt(selectedMonth)) &&
    (isNaN(selectedYear) || recordYear === selectedYear)
  );
}

// Render Department History and Chief Complaint counts
function renderDepartmentHistory() {
  const selectedDepartment = departmentSelect.value;
  const patients = loadEmployeeData();
  const departmentStats = {};

  patients.forEach(p => {
    if (!filterByMonthAndYear(p)) return;  // Skip if the record doesn't match the filter

    if (p.department === "Unknown") return;

    if (selectedDepartment !== "all" && p.department !== selectedDepartment) return;

    const chiefComplaint = p.chiefComplaint || "Unknown";
    const department = p.department || "Unknown";

    if (!departmentStats[department]) {
      departmentStats[department] = {};
    }

    if (!departmentStats[department][chiefComplaint]) {
      departmentStats[department][chiefComplaint] = 0;
    }

    departmentStats[department][chiefComplaint]++;
  });

  if (Object.keys(departmentStats).length === 0) {
    statsSection.innerHTML = "<p>No records match the selected filters.</p>";
    return;
  }

  let html = "<table><thead><tr><th>Department</th><th>Chief Complaint</th><th>Count</th></tr></thead><tbody>";

  Object.keys(departmentStats).forEach(department => {
    Object.keys(departmentStats[department]).forEach(complaint => {
      const count = departmentStats[department][complaint];
      html += `<tr><td>${department}</td><td>${complaint}</td><td>${count}</td></tr>`;
    });
  });

  html += "</tbody></table>";
  statsSection.innerHTML = html;
}

// Render Medication History and counts
function renderMedicationHistory() {
  const selectedDepartment = departmentSelect.value;
  const patients = loadEmployeeData();
  const medicationStats = {};

  patients.forEach(p => {
    if (!filterByMonthAndYear(p)) return;  // Skip if the record doesn't match the filter

    if (p.department === "Unknown") return;

    if (selectedDepartment !== "all" && p.department !== selectedDepartment) return;

    const medication = p.medication || "Unknown";

    if (!medicationStats[medication]) {
      medicationStats[medication] = 0;
    }

    medicationStats[medication]++;
  });

  let html = "<table><thead><tr><th>Medication</th><th>Count</th></tr></thead><tbody>";

  Object.keys(medicationStats).forEach(medication => {
    const count = medicationStats[medication];
    html += `<tr><td>${medication}</td><td>${count}</td></tr>`;
  });

  html += "</tbody></table>";
  statsSection.innerHTML = html;
}

// Event listeners for "View Department History" and "View Medication History" buttons
document.getElementById("viewDeptBtn").addEventListener("click", renderDepartmentHistory);
document.getElementById("viewMedicationBtn").addEventListener("click", renderMedicationHistory);

// Export functionality for Excel (XLSX)
document.getElementById("exportBtn").addEventListener("click", () => {
  const table = statsSection.querySelector("table");

  if (!table) {
    alert("No data to export");
    return;
  }

  const rows = [...table.rows].map(row => 
    [...row.cells].map(cell => `"${cell.textContent}"`).join(",")
  );
  
  const csvContent = rows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "patient_stats.csv";
  a.click();
  URL.revokeObjectURL(url);
});
