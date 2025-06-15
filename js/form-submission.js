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

        // Prepare form data from the input fields
        const data = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };

        // --- Your Formspree Endpoint URL ---
        const FORMSPREE_ENDPOINT_URL = 'https://formspree.io/f/mkgbbrwj'; 
        // ------------------------------------------

        try {
            const response = await fetch(FORMSPREE_ENDPOINT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Essential for Formspree to correctly parse your JSON data
                },
                body: JSON.stringify(data) // Send your form data as a JSON string
            });

            // Formspree returns a 2xx status code for success
            if (response.ok) {
                displayMessage('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset(); // Clear the form
            } else {
                // If Formspree returns an error, try to get the message from their response
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido.' }));
                displayMessage(`Oops! Error: ${errorData.message || 'There was an error sending your message. Please try again.'}`, 'error');
                console.error('Formspree error:', response.status, errorData);
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
