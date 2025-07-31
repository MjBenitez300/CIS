function filterRecords() {
  const selectedDate = document.getElementById("filterDate").value;
  const patients = JSON.parse(localStorage.getItem("patients")) || [];

  const filtered = patients.filter(p => p.walkInDate === selectedDate);

  const list = document.getElementById("recordList");
  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = "<li>No records for this date.</li>";
    return;
  }

  filtered.forEach(p => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${p.firstName} ${p.lastName}</strong><br>
      Age: ${p.age} | Sex: ${p.sex}<br>
      Phone: ${p.phone}<br>
      Email: ${p.email}<br>
      Address: ${p.address}<br>
      Department: ${p.department}<br>
      Civil Status: ${p.civilStatus} | Religion: ${p.religion}<br>
      Walk-in Date: ${p.walkInDate}<br>
      C/C: ${p.cc}<br>
      History: ${p.history}<br>
      Remarks: ${p.remarks}<br>
      Sick Leave: ${p.sickLeave}<br>
      From: ${p.dateFrom} → To: ${p.dateTo}<br>
      <hr>
    `;
    list.appendChild(item);
  });
}

function printRecords() {
  window.print();
}

function clearAll() {
  if (confirm("Delete ALL records? This cannot be undone.")) {
    localStorage.removeItem("patients");
    document.getElementById("recordList").innerHTML = "";
    alert("All records deleted.");
  }
}