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


