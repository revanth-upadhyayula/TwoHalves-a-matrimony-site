function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    lightbox.style.display = 'flex'; // Show the lightbox
    lightboxImg.src = img.src; // Set the lightbox image source to the clicked image
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    lightbox.style.display = 'none'; // Hide the lightbox
}
document.getElementById('editProfile').addEventListener('click', function() {
    window.location.href = '../profile/profile.html'; // Path to profile page
});
// Function to open the lightbox with the clicked image
function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    lightbox.style.display = 'flex'; // Show the lightbox
    lightboxImg.src = img.src; // Set the lightbox image source to the clicked image
}

// Function to close the lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none'; // Hide the lightbox
}

// Event listener for 'editProfile' button
document.getElementById('editProfile').addEventListener('click', function() {
    window.location.href = '../profile/profile.jsp'; // Path to profile page
});

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    // Fetch the profile completion status and profile data from the servlet
    fetch('/ProfileCheckServlet')
        .then(response => response.json())
        .then(data => {
            // Update profile completion button
            const editProfileButton = document.getElementById('editProfile');
            if (data.profileCompleted) {
                editProfileButton.innerHTML = "Edit Profile";
                editProfileButton.onclick = function() {
                    window.location.href = "edit-profile.html"; // Redirect to edit profile page
                };
            } else {
                editProfileButton.innerHTML = "Complete Profile";
                editProfileButton.onclick = function() {
                    window.location.href = "complete-profile.html"; // Redirect to complete profile page
                };
            }
            
            /*// Update profile information
            document.getElementById('name').innerText = data.name;
            document.getElementById('fathers_name').innerText = data.fathers_name;
            document.getElementById('mothers_name').innerText = data.mothers_name;
            document.getElementById('dob').innerText = data.dob;
            document.getElementById('gender').innerText = data.gender;
            document.getElementById('weight').innerText = data.weight;
            document.getElementById('height').innerText = data.height;
            document.getElementById('community').innerText = data.community;
            
            document.getElementById('email').innerText = data.email;
            document.getElementById('phone').innerText = data.phone;
            document.getElementById('city').innerText = data.city;
            document.getElementById('address').innerText = data.address;
            
            document.getElementById('company_name').innerText = data.company_name;
            document.getElementById('position').innerText = data.position;
            document.getElementById('salary').innerText = data.salary;
            document.getElementById('job_location').innerText = data.job_location;

            // Update social media links
            document.getElementById('facebook').href = data.facebook;
            document.getElementById('instagram').href = data.instagram;
            document.getElementById('linkedin').href = data.linkedin;
            document.getElementById('youtube').href = data.youtube;*/
        })
        .catch(error => console.error('Error:', error));
});
