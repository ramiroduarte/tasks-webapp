document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAddTask");
  const taskTitle = document.getElementById("taskTitle");

  form.addEventListener("submit", (event) => {
    if (!taskTitle.value.trim()) {
      event.preventDefault(); // Prevents form submission
      event.stopPropagation();
      taskTitle.classList.add("is-invalid"); // Add error class
    } else {
      taskTitle.classList.remove("is-invalid"); // Remove the error if it's valid
    }
  });

  // Remove the error class when the user type something
  taskTitle.addEventListener("input", () => {
    if (taskTitle.value.trim()) {
      taskTitle.classList.remove("is-invalid");
    }
	});
	


	const modalAddTask = document.getElementById('modalAddTask');
	const formAddTask = document.getElementById('formAddTask');

	modalAddTask.addEventListener('hidden.bs.modal', () => {
		formAddTask.reset();
		// Remove Bootstrap validation classes
		formAddTask.classList.remove('was-validated');
		const invalidFeedbacks = formAddTask.querySelectorAll('.is-invalid');
		invalidFeedbacks.forEach((element) => {
			element.classList.remove('is-invalid');
		});
	});
});

function autoExpand(field) {
	field.style.height = 'inherit';
	const computed = window.getComputedStyle(field);
	const height =
		parseInt(computed.getPropertyValue('border-top-width'), 10) +
		parseInt(computed.getPropertyValue('padding-top'), 10) +
		field.scrollHeight +
		parseInt(computed.getPropertyValue('padding-bottom'), 10) +
		parseInt(computed.getPropertyValue('border-bottom-width'), 10);
	field.style.height = height + 'px';
}