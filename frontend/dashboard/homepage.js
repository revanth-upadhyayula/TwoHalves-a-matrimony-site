// Toggle profile menu
function toggleProfileMenu() {
    document.getElementById("profileDropdown").classList.toggle("show");
}


document.getElementById('Profile').addEventListener('click', function() {
    window.location.href = '../profilepage/p.html'; // Path to profile page
});


// Close modal
function closeModal() {
    document.getElementById("profileModal").style.display = "none";
}

function displayProfiles(profiles) {
    const profileContainer = document.getElementById("profiles");
    profileContainer.innerHTML = ""; // Clear previous results
    
    profiles.forEach(profile => {
        const card = document.createElement("div");
        card.classList.add("profile-card");
        card.innerHTML = `
            <h3>${profile.name}</h3>
            <p>Date of Birth: ${profile.dob.split("T")[0]}</p>
            <p>Community: ${profile.community}</p>
            <p>City: ${profile.city}</p>
            <button onclick="expressInterest('${profile._id}', true)">Interested</button>
            <button onclick="expressInterest('${profile._id}', false)">Not Interested</button>
        `;
        profileContainer.appendChild(card);
    });
}

async function searchProfiles() {
    // const age = document.getElementById("age").value;
    // const profession = document.getElementById("profession").value;
    const community = document.getElementById("community").value;
    const job_location = document.getElementById("job_location").value;
    const userGender = localStorage.getItem('gender'); 
    console.log(userGender);
    const response = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ community, job_location , userGender }),
    });
    
    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers.get("content-type"));
    
    try {
        const profiles = await response.json(); // Try parsing JSON
        console.log("Profiles Data:", profiles);
        displayProfiles(profiles);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        const text = await response.text(); // Read the full response as text
        console.error("Full Response:", text);
    }
}
