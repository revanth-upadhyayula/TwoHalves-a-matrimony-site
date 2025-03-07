document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem("token"); // ✅ Get JWT Token
        if (!token) {
            alert("User not logged in. Redirecting to login page...");
            window.location.href = "/frontend/login.html";
            return;
        }

        const response = await fetch("http://localhost:5000/api/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile data");
        }

        const profile = await response.json();

        // ✅ Populate Profile Data in HTML
        document.querySelector(".header-info h1").textContent = profile.name;
        document.querySelector(".header-info p").innerHTML = 
            `${profile.position} at ${profile.company}<br>Work Location: ${profile.job_location}`;

        document.querySelector(".section:nth-child(1) p:nth-child(2)").innerHTML = `<strong>Name:</strong> ${profile.name}`;
        document.querySelector(".section:nth-child(1) p:nth-child(3)").innerHTML = `<strong>Family name:</strong> ${profile.community}`;
        document.querySelector(".section:nth-child(1) p:nth-child(4)").innerHTML = `<strong>Date of birth:</strong> ${profile.dob}`;
        document.querySelector(".section:nth-child(1) p:nth-child(5)").innerHTML = `<strong>Weight:</strong> ${profile.weight}`;
        document.querySelector(".section:nth-child(1) p:nth-child(6)").innerHTML = `<strong>Religion:</strong> ${profile.religion || "N/A"}`;
        document.querySelector(".section:nth-child(1) p:nth-child(7)").innerHTML = `<strong>Company:</strong> ${profile.company}`;
        document.querySelector(".section:nth-child(1) p:nth-child(8)").innerHTML = `<strong>Salary:</strong> ${profile.salary}`;

        document.querySelector(".section:nth-child(1) p:nth-child(9)").innerHTML = `<strong>Father's name:</strong> ${profile.father_name}`;
        document.querySelector(".section:nth-child(1) p:nth-child(10)").innerHTML = `<strong>Mother's name:</strong> ${profile.mother_name}`;
        document.querySelector(".section:nth-child(1) p:nth-child(11)").innerHTML = `<strong>Age:</strong> ${profile.age || "N/A"}`;
        document.querySelector(".section:nth-child(1) p:nth-child(12)").innerHTML = `<strong>Height:</strong> ${profile.height} `;

        document.querySelector(".section:nth-child(2) p:nth-child(2)").innerHTML = `<strong>Phone:</strong> ${profile.phone}`;
        document.querySelector(".section:nth-child(2) p:nth-child(3)").innerHTML = `<strong>Email:</strong> ${profile.email}`;
        document.querySelector(".section:nth-child(2) p:nth-child(4)").innerHTML = `<strong>Address:</strong> ${profile.address}`;

        // ✅ Update Profile Picture
        const profileImage = document.querySelector(".profile-picture img");
        if (profile.profilePhoto) {
            profileImage.src = `http://localhost:5000/${profile.profilePhoto}`;
        } else {
            profileImage.src = "default-profile.jpg"; // Default image
        }

        // ✅ Populate Gallery Images
        const photoGallery = document.querySelector(".photos");
        photoGallery.innerHTML = ""; // Clear existing images
        if (profile.additionalPhotos.length > 0) {
            profile.additionalPhotos.forEach(photo => {
                const img = document.createElement("img");
                img.src = `http://localhost:5000/${photo}`;
                img.alt = "Gallery Photo";
                img.onclick = () => openLightbox(img);
                photoGallery.appendChild(img);
            });
        } else {
            photoGallery.innerHTML = "<p>No additional photos available.</p>";
        }

        // ✅ Edit Profile Button
        document.getElementById("editProfile").addEventListener("click", () => {
            window.location.href = "/frontend/profile/profile.html";
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error loading profile. Please try again.");
    }
});

// ✅ Lightbox Functions
function openLightbox(img) {
    document.getElementById("lightbox-img").src = img.src;
    document.getElementById("lightbox").style.display = "block";
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}
