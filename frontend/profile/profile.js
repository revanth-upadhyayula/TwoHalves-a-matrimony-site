document.getElementById("profileForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // ✅ Retrieve User Data from Local Storage
    const user = JSON.parse(localStorage.getItem("user")); // Make sure user exists

    if (!user || !user.id) {
        alert("User is not logged in. Please login first.");
        return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("gender", document.getElementById("gender").value);
    formData.append("city", document.getElementById("city").value);
    formData.append("dob", document.getElementById("dob").value);
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

    // Handle file uploads
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

    // ✅ Get JWT Token from Local Storage (Assuming it's stored after login)
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:5000/api/profile", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}` // ✅ Send JWT Token
            }
        });
        console.log(response);
        const data = await response.json();
        if (response.ok) {
            alert("Profile updated successfully!");
            window.location.href = "/frontend/profilepage/p.html";
        } else {
            alert(`Error: ${data.message}`);
        }

    } catch (error) {
        console.error("Error submitting profile:", error);
        alert("An error occurred while submitting your profile.");
    }
});
