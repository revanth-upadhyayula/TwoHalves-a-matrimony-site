document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not logged in. Redirecting to login...");
            window.location.href = "/frontend/login.html";
            return;
        }

        // ✅ Fetch user profile data
        const response = await fetch("http://localhost:5000/api/profile", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile data");
        }

        const profile = await response.json();

        // ✅ Populate form fields
        document.getElementById("name").value = profile.name || "";
        document.getElementById("email").value = profile.email || "";
        document.getElementById("phone").value = profile.phone || "";
        document.getElementById("gender").value = profile.gender || "Male";
        document.getElementById("dob").value = profile.dob ? profile.dob.split("T")[0] : "";
        document.getElementById("city").value = profile.city || "";
        document.getElementById("height").value = profile.height || "";
        document.getElementById("weight").value = profile.weight || "";
        document.getElementById("father_name").value = profile.father_name || "";
        document.getElementById("mother_name").value = profile.mother_name || "";
        document.getElementById("community").value = profile.community || "";
        document.getElementById("address").value = profile.address || "";
        document.getElementById("company").value = profile.company || "";
        document.getElementById("position").value = profile.position || "";
        document.getElementById("salary").value = profile.salary || "";
        document.getElementById("job_location").value = profile.job_location || "";
        document.getElementById("instagram").value = profile.instagram || "";
        document.getElementById("linkedin").value = profile.linkedin || "";
        document.getElementById("facebook").value = profile.facebook || "";
        document.getElementById("youtube").value = profile.youtube || "";

        // ✅ Show existing profile photo (if available)
        if (profile.profile_photo) {
            document.getElementById("current_profile_photo").src = profile.profile_photo;
        }

        // ✅ Show existing additional photos (if available)
        const additionalPhotosContainer = document.getElementById("current_additional_photos");
        additionalPhotosContainer.innerHTML = "";
        if (profile.additional_photos && profile.additional_photos.length > 0) {
            profile.additional_photos.forEach(photo => {
                const img = document.createElement("img");
                img.src = photo;
                img.width = 100;
                img.style.marginRight = "10px";
                additionalPhotosContainer.appendChild(img);
            });
        }

    } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error loading profile. Please try again.");
    }
});

// ✅ Handle Form Submission
document.getElementById("profileForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("User is not logged in.");
        return;
    }

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("gender", document.getElementById("gender").value);
    formData.append("dob", document.getElementById("dob").value);
    formData.append("city", document.getElementById("city").value);
    formData.append("height", document.getElementById("height").value);
    formData.append("weight", document.getElementById("weight").value);
    formData.append("father_name", document.getElementById("father_name").value);
    formData.append("mother_name", document.getElementById("mother_name").value);
    formData.append("community", document.getElementById("community").value);
    formData.append("address", document.getElementById("address").value);
    formData.append("company", document.getElementById("company").value);
    formData.append("position", document.getElementById("position").value);
    formData.append("salary", document.getElementById("salary").value);
    formData.append("job_location", document.getElementById("job_location").value);
    formData.append("instagram", document.getElementById("instagram").value);
    formData.append("linkedin", document.getElementById("linkedin").value);
    formData.append("facebook", document.getElementById("facebook").value);
    formData.append("youtube", document.getElementById("youtube").value);

    // ✅ Handle File Uploads Only If New Files Are Selected
    const profilePhotoInput = document.getElementById("profile_photo");
    if (profilePhotoInput.files.length > 0) {
        formData.append("profile_photo", profilePhotoInput.files[0]);
    }

    const additionalPhotosInput = document.getElementById("additional_photos");
    if (additionalPhotosInput.files.length > 0) {
        for (let file of additionalPhotosInput.files) {
            formData.append("additional_photos", file);
        }
    }

    try {
        const response = await fetch("http://localhost:5000/api/profile", {
            method: "POST",
            body: formData,
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        if (response.ok) {
            alert("Profile updated successfully!");
            setTimeout(() => {
                window.location.href = window.location.origin + "/frontend/profilepage/p.html";
            }, 10);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating your profile.");
    }
});
