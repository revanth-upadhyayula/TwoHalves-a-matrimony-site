document.addEventListener("DOMContentLoaded", () => {
    // Select both 'Get started' buttons
    const getStartedButtons = document.querySelectorAll("button");

    // Loop through the buttons and add click event listeners
    getStartedButtons.forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = "../profile/profile.html";
        });
    });
});
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    const name = document.getElementById('username').value; // ✅ Changed from 'username' to 'name'
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }) // ✅ Use 'name' instead of 'username'
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Registration Successful!');
            window.location.href = '/frontend/profile/profile.html'; // Redirect to login page
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
