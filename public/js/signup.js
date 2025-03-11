(() => {
	'use strict';                                                                   // Activate 'scrict mode' to prevent silent errors and use good practices

	const forms = document.querySelectorAll('.needs-validation');                   // Select all forms with 'needs-validation' class

	Array.from(forms).forEach(form => {                                             // Iterate all selected forms
		form.addEventListener('submit', event => {                                  // Add an event when submitting a form
			if (!form.checkValidity()) {                                            // If the form is invalid, prevent it from being sent
				event.preventDefault();                                             // Prevent form submission
				event.stopPropagation();                                            // Stop the event propagation

				const inputs = form.querySelectorAll('input');                      // Validate each input when trying to sumbit the form
				inputs.forEach(input => {
					validateInput(input);                                           // Call a function of invidual validation for each input
				});
			}
				form.classList.add('was-validated');                                    // Set the form as validated to Bootstrap apply styles
			});

			const inputs = form.querySelectorAll('input');                              // Select all inputs within the form and add real-time validation
			inputs.forEach(input => {
				input.addEventListener('input', () => validateInput(input));            // Each time the user types in an input, it is executed a validation function
			});
	});

	function validateInput(input) {                                                 // Function to validate each input
		const feedbacks = input.parentElement.querySelectorAll('.invalid-feedback');// Clears previous messages by hiding all error messages associated with the input
		feedbacks.forEach(feedback => feedback.style.display = 'none');

		if (input.id === 'username') {
			if (input.validity.valueMissing) {
				const requiredFeedback = input.parentElement.querySelector('#username-required');
				if (requiredFeedback) requiredFeedback.style.display = 'block';
			} else if (input.validity.tooLong) {
				const invalidFeedback = input.parentElement.querySelector('#username-maxlength');
				if (invalidFeedback) invalidFeedback.style.display = 'block';
			}
		} else if (input.id === 'email') {
			if (input.validity.valueMissing) {
				const requiredFeedback = input.parentElement.querySelector('#email-required');
				if (requiredFeedback) requiredFeedback.style.display = 'block';
			} else if (input.validity.typeMismatch) {
				const invalidFeedback = input.parentElement.querySelector('#email-invalid');
				if (invalidFeedback) invalidFeedback.style.display = 'block';
			} else if(input.validity.tooLong){
				const invalidFeedback = input.parentElement.querySelector('#email-maxlength');
				if (invalidFeedback) invalidFeedback.style.display = 'block';
			}
		} else if (input.id === 'password') {
			if (input.validity.valueMissing) {
				const requiredFeedback = input.parentElement.querySelector('#password-required');
				if (requiredFeedback) requiredFeedback.style.display = 'block';
			} else if (input.validity.tooShort) {
				const invalidFeedback = input.parentElement.querySelector('#password-minlength');
				if (invalidFeedback) invalidFeedback.style.display = 'block';
			} else if(input.validity.tooLong){
				const invalidFeedback = input.parentElement.querySelector('#password-maxlength');
				if (invalidFeedback) invalidFeedback.style.display = 'block';
			}
		} else if (input.id === 'confirmPassword') {
			const password = document.getElementById('password').value;
			if (input.validity.valueMissing) {
				const requiredFeedback = input.parentElement.querySelector('#confirmPassword-required');
				if (requiredFeedback) requiredFeedback.style.display = 'block';
				input.setCustomValidity('');                                        // Clears any personalized error message
			} else if (input.value !== password) {
				const invalidFeedback = input.parentElement.querySelector('#confirmPassword-match');
				if (invalidFeedback) invalidFeedback.style.display = 'block';
				input.setCustomValidity('Las contraseñas no coinciden');            // Set a personalized error message
			} else {
				input.setCustomValidity('');                                        // Clears the error message if the password matches
			}
		}

		// Manage classes according to input status
		if (!input.validity.valid) {
			input.classList.add('is-invalid');                                      // Add the Bootstrap class to invalid inputs
			input.classList.remove('is-valid');                                     // Remove the Bootstrap class to valid inputs
		} else {
			input.classList.remove('is-invalid');                                   // Remove the Bootstrap class to invalid inputs
			input.classList.add('is-valid');                                        // Add the Bootstrap class to valid inputs
		}
	}
})();




// Buttons for password visibility
function passwordVisibility(){
	const passwordInput = document.getElementById("password");
	const imgPasswordEye = document.getElementById("imgPasswordEye");
	if(passwordInput.type == 'password'){
		passwordInput.type = 'text';
		imgPasswordEye.src = 'img/passwordEyeOn.png';
	}else{
		passwordInput.type = 'password';
		imgPasswordEye.src = 'img/passwordEyeOff.png';
	}
}

function confirmPasswordVisibility(){
	const confirmPasswordInput = document.getElementById("confirmPassword");
	const imgConfirmPasswordEye = document.getElementById("imgConfirmPasswordEye");
	if(confirmPasswordInput.type == 'password'){
		confirmPasswordInput.type = 'text';
		imgConfirmPasswordEye.src = 'img/passwordEyeOn.png';
	}else{
		confirmPasswordInput.type = 'password';
		imgConfirmPasswordEye.src = 'img/passwordEyeOff.png';
	}
}