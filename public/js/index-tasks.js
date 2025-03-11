function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // The months in JS are 0-11
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const dueDateElements = document.querySelectorAll('[data-due-date]');
  dueDateElements.forEach(element => {
    const dueDate = element.getAttribute('data-due-date');
    element.textContent = formatDate(dueDate);
  });
});