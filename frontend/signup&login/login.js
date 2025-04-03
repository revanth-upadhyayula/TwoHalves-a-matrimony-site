document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // alert('Login Successful!');
            // console.log('Login Successful!');
            
            // ✅ Save token in localStorage for future authentication
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('gender',data.user.gender);


            console.log(localStorage.getItem('gender'));
            
            // ✅ Redirect to dashboard or profile
            window.location.href = '/frontend/dashboard/homepage.html';
        } else {
            alert(data.message); // Show error message from server
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
