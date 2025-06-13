document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Create a div for messages to the user
    const messageDiv = document.createElement('div');
    messageDiv.id = 'form-message';
    messageDiv.style.marginTop = '20px';
    messageDiv.style.padding = '10px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.display = 'none'; // Initially hidden
    contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling); // Insert after the form

    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Reset previous messages
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
        messageDiv.style.backgroundColor = '';
        messageDiv.style.color = '';
        submitButton.disabled = true; // Disable button during submission
        submitButton.textContent = 'Sending...';

        // Basic Client-Side Validation
        if (nameInput.value.trim() === '') {
            displayMessage('Please enter your name.', 'error');
            return;
        }
        if (emailInput.value.trim() === '') {
            displayMessage('Please enter your email.', 'error');
            return;
        }
        if (!isValidEmail(emailInput.value.trim())) {
            displayMessage('Please enter a valid email address.', 'error');
            return;
        }
        if (messageInput.value.trim() === '') {
            displayMessage('Please enter your message.', 'error');
            return;
        }

        // Prepare form data using new FormData(formElement)
        // This object directly contains all form field values.
        const formData = new FormData(contactForm);

        // --- Your Zapier Webhook URL (Keep this) ---
        const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/20284283/uyeiosy/';
        // ------------------------------------------

        try {
            const response = await fetch(ZAPIER_WEBHOOK_URL, {
                method: 'POST',
                // ************************************************************
                // IMPORTANT: REMOVE THE HEADERS OBJECT FOR 'Content-Type'
                // When you send a FormData object directly as the body,
                // fetch will automatically set the 'Content-Type' to
                // 'multipart/form-data' which is considered a 'simple' type
                // and helps avoid CORS preflight issues.
                // ************************************************************
                // headers: {
                //     'Content-Type': 'application/json', // REMOVE THIS LINE
                //     'Accept': 'application/json'         // AND THIS ONE
                // },
                body: formData // Send the FormData object directly
            });

            // Zapier webhooks typically return a 200 OK status on success
            if (response.ok) {
                displayMessage('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset(); // Clear the form
            } else {
                // If Zapier webhook returns an error (e.g., non-2xx status)
                // We might not get JSON back for errors with multipart/form-data
                displayMessage('Oops! There was an error sending your message. Please try again or contact me directly.', 'error');
                console.error('Zapier webhook response status:', response.status);
                console.error('Zapier webhook response text:', await response.text());
            }
        } catch (error) {
            // Network errors or other unexpected issues
            displayMessage('Network error. Please check your internet connection and try again.', 'error');
            console.error('Fetch error:', error);
        } finally {
            submitButton.disabled = false; // Re-enable button
            submitButton.textContent = 'Send Message';
        }
    });

    // Helper function to display messages
    function displayMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda'; // Light green
            messageDiv.style.color = '#155724'; // Dark green
            messageDiv.style.borderColor = '#c3e6cb';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#f8d7da'; // Light red
            messageDiv.style.color = '#721c24'; // Dark red
            messageDiv.style.borderColor = '#f5c6cb';
        }
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }

    // Helper function for email validation
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});