document.getElementById("clinicForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const form = e.target;

  const data = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    age: form.age.value,
    sex: form.sex.value,
    phone: form.phone.value,
    email: form.email.value,
    address: form.address.value,
    walkInDate: form.walkInDate.value,
    department: form.department.value,
    civilStatus: form.civilStatus.value,
    religion: form.religion.value,
    cc: form.cc.value,
    history: form.history.value,
    remarks: form.remarks.value,
    sickLeave: form.sickLeave.value,
    dateFrom: form.dateFrom.value,
    dateTo: form.dateTo.value
  };

  let records = JSON.parse(localStorage.getItem("patients")) || [];
  records.push(data);
  localStorage.setItem("patients", JSON.stringify(records));

  alert("Record added successfully!");
  form.reset();
});