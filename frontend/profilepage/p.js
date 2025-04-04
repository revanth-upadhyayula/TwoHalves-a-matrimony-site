// p.js
document.addEventListener('DOMContentLoaded', () => {
    // Fetch the profile data when the page loads
    fetchProfileData();

    // Handle thumbnail clicks to change the main photo
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainPhoto = document.getElementById('main-photo');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            mainPhoto.src = thumbnail.src;
        });
    });

    // Handle tab switching
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Handle Edit Profile modal
    const editButton = document.getElementById('edit');
    const editModal = document.getElementById('edit-modal');
    const cancelButton = document.getElementById('cancel-btn');
    const editForm = document.getElementById('edit-profile-form');

    editButton.addEventListener('click', () => {
        editModal.style.display = 'flex';
    });

    cancelButton.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // Handle tag inputs in the modal
    const addTagButtons = document.querySelectorAll('.add-tag-btn');
    addTagButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const input = button.previousElementSibling;
            const tagList = document.getElementById(targetId);

            if (input.value.trim() !== '') {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.textContent = input.value.trim();

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'remove-tag';
                removeBtn.textContent = '×';
                removeBtn.onclick = () => tag.remove();

                tag.appendChild(removeBtn);
                tagList.appendChild(tag);
                input.value = '';
            }
        });
    });

    // Handle form submission for editing the profile
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            personalInfo: {
                fullName: document.getElementById('full-name').value,
                age: Number(document.getElementById('age').value),
                dob: document.getElementById('dob').value,
                gender: document.getElementById('gender')?.value || '', // Add if needed
                height: document.getElementById('height')?.value || '', // Add if needed
                maritalStatus: document.getElementById('marital-status')?.value || '', // Add if needed
                location: document.getElementById('current-location').value,
                hometown: document.getElementById('hometown').value
            },
            aboutMe: {
                about: document.getElementById('about').value,
                languages: Array.from(document.getElementById('languages').children)
                    .map(tag => tag.textContent.slice(0, -1)) || [],
                interests: Array.from(document.getElementById('interests').children)
                    .map(tag => tag.textContent.slice(0, -1)) || []
            },
            educationCareer: {
                education: document.getElementById('highest-degree').value,
                university: document.getElementById('university').value,
                profession: document.getElementById('profession').value,
                company: document.getElementById('company').value
            },
            familyBackground: {
                familyType: document.getElementById('family-type').value,
                siblings: Number(document.getElementById('siblings').value),
                fatherOccupation: document.getElementById('father-occupation').value,
                motherOccupation: document.getElementById('mother-occupation').value,
                familyValues: document.getElementById('family-values').value,
                familyBackground: document.getElementById('family-background').value
            },
            lifestyle: {
                diet: document.getElementById('diet')?.value || '', // Add if needed
                drinking: document.getElementById('drinking')?.value || '', // Add if needed
                smoking: document.getElementById('smoking')?.value || '', // Add if needed
                fitness: document.getElementById('fitness')?.value || '' // Add if needed
            },
            partnerPreferences: {
                ageRange: document.getElementById('pref-age-range').value,
                heightRange: document.getElementById('pref-height-range').value,
                education: Array.from(document.getElementById('pref-education').children)
                    .map(tag => tag.textContent.slice(0, -1)) || [],
                occupation: Array.from(document.getElementById('pref-occupation').children)
                    .map(tag => tag.textContent.slice(0, -1)) || [],
                preferences: document.getElementById('partner-preferences').value
            },
            contactInfo: {
                email: document.getElementById('email')?.value || '', // Add if needed
                phone: document.getElementById('phone')?.value || '' // Add if needed
            }
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Profile Update Success:', data);
            alert('Profile updated successfully!');
            editModal.style.display = 'none';
            fetchProfileData(); // Refresh the profile data
        } catch (error) {
            console.error('Profile Update Error:', error);
            alert('An error occurred while updating the profile: ' + error.message);
        }
    });
});

// Function to fetch profile data and populate the page
async function fetchProfileData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to view your profile.');
            window.location.href = 'login.html'; // Redirect to login page
            return;
        }

        const response = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Profile Data:', data);
        const profile = data.profile;

        // Populate Profile Header
        document.querySelector('.name h2').innerHTML = `${profile.personalInfo.fullName}, ${profile.personalInfo.age} <i class="ri-verified-badge-fill verified"></i>`;
        document.querySelector('.location').innerHTML = `<i class="ri-map-pin-2-line loc"></i> ${profile.personalInfo.location}`;
        document.querySelector('.profile-tags').innerHTML = `
            <span>${profile.educationCareer.profession}</span>
            <span>${profile.personalInfo.height || "Not specified"}</span>
            <span>${profile.personalInfo.maritalStatus || "Not specified"}</span>
            <span>${profile.personalInfo.community || "Hindu"}</span>
        `;
        document.querySelector('.member-since').innerHTML = `<i class="ri-calendar-event-line cal"></i> Member since ${new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

        // Populate About Section
        document.querySelector('#about p').textContent = profile.aboutMe.about || "Not specified";
        document.querySelector('#dob .sub-down').textContent = profile.personalInfo.dob || "Not specified";
        document.querySelector('#job .sub-down').textContent = `${profile.educationCareer.profession} at ${profile.educationCareer.company}` || "Not specified";
        document.querySelector('#eduaction .sub-down').textContent = `${profile.educationCareer.education}, ${profile.educationCareer.university}` || "Not specified";
        document.querySelector('#language .sub-down').textContent = profile.aboutMe.languages.join(', ') || "Not specified";
        document.querySelector('#location .sub-down').textContent = profile.personalInfo.hometown || "Not specified";
        const interestTags = document.querySelector('#interest-tags');
        interestTags.innerHTML = profile.aboutMe.interests.map(interest => `<span>${interest}</span>`).join('') || "Not specified";

        // Populate Family Section
        document.querySelector('#family p').textContent = profile.familyBackground.familyBackground || "Not specified";
        document.querySelector('#family .personal-info p:nth-child(1) .sub-down').textContent = profile.familyBackground.familyType || "Not specified";
        document.querySelector('#family .personal-info p:nth-child(2) .sub-down').textContent = profile.familyBackground.fatherOccupation || "Not specified";
        document.querySelector('#family .personal-info p:nth-child(3) .sub-down').textContent = profile.familyBackground.motherOccupation || "Not specified";
        document.querySelector('#family .personal-info p:nth-child(4) .sub-down').textContent = profile.familyBackground.siblings || "0";
        document.querySelector('#family .more-info p .sub-down').textContent = profile.familyBackground.familyValues || "Not specified";

        // Populate Lifestyle Section
        document.querySelector('#lifestyle p').textContent = "I believe in maintaining a balanced and healthy lifestyle while enjoying hobbies that enrich my life.";
        document.querySelector('#lifestyle .personal-info p:nth-child(1) .sub-down').textContent = profile.lifestyle.diet || "Not specified";
        document.querySelector('#lifestyle .personal-info p:nth-child(2) .sub-down').textContent = profile.lifestyle.drinking || "Not specified";
        document.querySelector('#lifestyle .personal-info p:nth-child(3) .sub-down').textContent = profile.lifestyle.smoking || "Not specified";
        document.querySelector('#lifestyle .personal-info p:nth-child(4) .sub-down').textContent = profile.lifestyle.fitness || "Not specified";

        // Populate Education Section
        document.querySelector('#education .personal-info p:nth-child(1) .sub-down').textContent = profile.educationCareer.education || "Not specified";
        document.querySelector('#education .personal-info p:nth-child(2) .sub-down').textContent = profile.educationCareer.university || "Not specified";
        document.querySelector('#education .personal-info p:nth-child(3) .sub-down').textContent = profile.educationCareer.fieldOfStudy || "Computer Science & AI";
        document.querySelector('#education .more-info p:nth-child(1) .sub-down').textContent = `${profile.educationCareer.profession} at ${profile.educationCareer.company}` || "Not specified";

        // Populate Preferences Section
        document.querySelector('#preferences p').textContent = profile.partnerPreferences.preferences || "Not specified";
        document.querySelector('#preferences .personal-info p:nth-child(1) .sub-down').textContent = profile.partnerPreferences.ageRange || "Not specified";
        document.querySelector('#preferences .personal-info p:nth-child(2) .sub-down').textContent = profile.partnerPreferences.heightRange || "Not specified";
        document.querySelector('#preferences .more-info p:nth-child(1) .sub-down').textContent = profile.partnerPreferences.education.join(', ') || "Not specified";
        document.querySelector('#preferences .more-info p:nth-child(2) .sub-down').textContent = profile.partnerPreferences.occupation.join(', ') || "Not specified";
        document.querySelector('#preferences .more-info p:nth-child(3) .sub-down').textContent = profile.partnerPreferences.maritalStatus || "Not specified";

        // Populate Contact Information
        document.querySelector('.contact-item:nth-child(1) .hidden-info').textContent = profile.contactInfo.phone || "Not specified";
        document.querySelector('.contact-item:nth-child(2) .hidden-info').textContent = profile.contactInfo.email || "Not specified";

        // Populate Edit Modal with Current Data
        populateEditModal(profile);
    } catch (error) {
        console.error('Fetch Profile Error:', error);
        alert('An error occurred while fetching the profile: ' + error.message);
    }
}

// Function to populate the Edit Modal with current profile data
function populateEditModal(profile) {
    document.getElementById('full-name').value = profile.personalInfo.fullName || '';
    document.getElementById('age').value = profile.personalInfo.age || '';
    document.getElementById('dob').value = profile.personalInfo.dob || '';
    document.getElementById('current-location').value = profile.personalInfo.location || '';
    document.getElementById('hometown').value = profile.personalInfo.hometown || '';
    document.getElementById('profession').value = profile.educationCareer.profession || '';
    document.getElementById('company').value = profile.educationCareer.company || '';
    document.getElementById('highest-degree').value = profile.educationCareer.education || '';
    document.getElementById('university').value = profile.educationCareer.university || '';
    document.getElementById('about').value = profile.aboutMe.about || '';

    // Populate Languages
    const languagesList = document.getElementById('languages');
    languagesList.innerHTML = profile.aboutMe.languages.map(lang => `<span class="tag">${lang} <button type="button" class="remove-tag">×</button></span>`).join('');

    // Populate Interests
    const interestsList = document.getElementById('interests');
    interestsList.innerHTML = profile.aboutMe.interests.map(interest => `<span class="tag">${interest} <button type="button" class="remove-tag">×</button></span>`).join('');

    // Populate Family Information
    document.getElementById('family-type').value = profile.familyBackground.familyType || '';
    document.getElementById('siblings').value = profile.familyBackground.siblings || '';
    document.getElementById('father-occupation').value = profile.familyBackground.fatherOccupation || '';
    document.getElementById('mother-occupation').value = profile.familyBackground.motherOccupation || '';
    document.getElementById('family-values').value = profile.familyBackground.familyValues || '';
    document.getElementById('family-background').value = profile.familyBackground.familyBackground || '';

    // Populate Partner Preferences
    document.getElementById('pref-age-range').value = profile.partnerPreferences.ageRange || '';
    document.getElementById('pref-height-range').value = profile.partnerPreferences.heightRange || '';
    const prefEducationList = document.getElementById('pref-education');
    prefEducationList.innerHTML = profile.partnerPreferences.education.map(edu => `<span class="tag">${edu} <button type="button" class="remove-tag">×</button></span>`).join('');
    const prefOccupationList = document.getElementById('pref-occupation');
    prefOccupationList.innerHTML = profile.partnerPreferences.occupation.map(occ => `<span class="tag">${occ} <button type="button" class="remove-tag">×</button></span>`).join('');
    document.getElementById('partner-preferences').value = profile.partnerPreferences.preferences || '';
}