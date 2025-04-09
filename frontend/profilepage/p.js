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
            const activeTab = document.getElementById(tab.dataset.tab);
            activeTab.classList.add('active');
            // Re-populate data when tab is switched (optional, for dynamic updates)
            if (activeTab && typeof fetchProfileData === 'function') {
                fetchProfileData();
            }
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

    // Handle tag inputs and removals in the modal
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

                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-tag';
                removeBtn.textContent = '×';
                removeBtn.onclick = () => tag.remove();

                tag.appendChild(removeBtn);
                tagList.appendChild(tag);
                input.value = '';
            }
        });
    });

    // Handle existing tag removal
    document.querySelectorAll('.remove-tag').forEach(removeBtn => {
        removeBtn.addEventListener('click', (e) => {
            e.target.parentElement.remove();
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
                gender: document.getElementById('gender').value,
                height: document.getElementById('height').value,
                maritalStatus: document.getElementById('marital-status').value,
                community: document.getElementById('community').value,
                location: document.getElementById('location').value,
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
                education: document.getElementById('education').value,
                university: document.getElementById('university').value,
                fieldOfStudy: document.getElementById('fieldOfStudy').value,
                profession: document.getElementById('profession').value,
                company: document.getElementById('company').value,
                currentJob: document.getElementById('currentJob').value,
                achievements: document.getElementById('achievements').value,
                careerGoals: document.getElementById('careerGoals').value
            },
            familyBackground: {
                familyType: document.getElementById('family-type').value,
                siblings: Number(document.getElementById('siblings').value),
                fatherOccupation: document.getElementById('father-occupation').value,
                motherOccupation: document.getElementById('mother-occupation').value,
                familyValues: document.getElementById('family-values').value,
                familyLocation: document.getElementById('family-location').value,
                familyBackground: document.getElementById('family-background').value
            },
            lifestyle: {
                diet: document.getElementById('diet').value,
                drinking: document.getElementById('drinking').value,
                smoking: document.getElementById('smoking').value,
                fitness: document.getElementById('fitness').value,
                music: document.getElementById('music').value,
                movies: document.getElementById('movies').value,
                travel: document.getElementById('travel').value,
                books: document.getElementById('books').value
            },
            partnerPreferences: {
                ageRange: document.getElementById('pref-age-range').value,
                heightRange: document.getElementById('pref-height-range').value,
                education: Array.from(document.getElementById('pref-education').children)
                    .map(tag => tag.textContent.slice(0, -1)) || [],
                occupation: Array.from(document.getElementById('pref-occupation').children)
                    .map(tag => tag.textContent.slice(0, -1)) || [],
                locations: Array.from(document.getElementById('pref-locations').children)
                    .map(tag => tag.textContent.slice(0, -1)) || [],
                maritalStatus: Array.from(document.getElementById('pref-marital-status').children)
                    .map(tag => tag.textContent.slice(0, -1))[0] || '',
                preferences: document.getElementById('partner-preferences').value
            },
            contactInfo: {
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            }
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found. Please log in.');

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

        // Safely populate Profile Header
        const nameElement = document.querySelector('.name h2');
        if (nameElement) nameElement.innerHTML = `${profile.personalInfo.fullName}, ${profile.personalInfo.age} <i class="ri-verified-badge-fill verified"></i>`;
        
        const locationElement = document.querySelector('.location');
        if (locationElement) locationElement.innerHTML = `<i class="ri-map-pin-2-line loc"></i> ${profile.personalInfo.location}`;
        
        const profileTagsElement = document.querySelector('.profile-tags');
        if (profileTagsElement) profileTagsElement.innerHTML = `
            <span>${profile.educationCareer.profession}</span>
            <span>${profile.personalInfo.height || "Not specified"}</span>
            <span>${profile.personalInfo.maritalStatus || "Not specified"}</span>
            <span>${profile.personalInfo.community || "Hindu"}</span>
        `;
        
        const memberSinceElement = document.querySelector('.member-since');
        if (memberSinceElement) memberSinceElement.innerHTML = `<i class="ri-calendar-event-line cal"></i> Member since ${new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

        // Safely populate About Section
        const aboutParagraph = document.querySelector('#about p');
        if (aboutParagraph) aboutParagraph.textContent = profile.aboutMe.about || "Not specified";
        
        const dobElement = document.querySelector('#dob .sub-down');
        if (dobElement) dobElement.textContent = profile.personalInfo.dob || "Not specified";
        
        const jobElement = document.querySelector('#job .sub-down');
        if (jobElement) jobElement.textContent = `${profile.educationCareer.profession} at ${profile.educationCareer.company}` || "Not specified";
        
        const educationElement = document.querySelector('#education .sub-down');
        if (educationElement) educationElement.textContent = `${profile.educationCareer.education}, ${profile.educationCareer.university}` || "Not specified";
        
        const languageElement = document.querySelector('#language .sub-down');
        if (languageElement) languageElement.textContent = profile.aboutMe.languages.join(', ') || "Not specified";
        
        const hometownElement = document.querySelector('#hometown .sub-down');
        if (hometownElement) hometownElement.textContent = profile.personalInfo.hometown || "Not specified";
        
        const interestTags = document.querySelector('#interest-tags');
        if (interestTags) interestTags.innerHTML = profile.aboutMe.interests.map(interest => `<span>${interest}</span>`).join('') || "Not specified";

        // Safely populate Family Section
        const familyParagraph = document.querySelector('#family p');
        if (familyParagraph) familyParagraph.textContent = profile.familyBackground.familyBackground || "Not specified";
        
        const familyTypeElement = document.querySelector('#family .personal-info p:nth-child(1) .sub-down');
        if (familyTypeElement) familyTypeElement.textContent = profile.familyBackground.familyType || "Not specified";
        
        const fatherOccupationElement = document.querySelector('#family .personal-info p:nth-child(2) .sub-down');
        if (fatherOccupationElement) fatherOccupationElement.textContent = profile.familyBackground.fatherOccupation || "Not specified";
        
        const motherOccupationElement = document.querySelector('#family .personal-info p:nth-child(3) .sub-down');
        if (motherOccupationElement) motherOccupationElement.textContent = profile.familyBackground.motherOccupation || "Not specified";
        
        const siblingsElement = document.querySelector('#family .personal-info p:nth-child(4) .sub-down');
        if (siblingsElement) siblingsElement.textContent = profile.familyBackground.siblings || "0";
        
        const familyValuesElement = document.querySelector('#family .more-info p:nth-child(1) .sub-down');
        if (familyValuesElement) familyValuesElement.textContent = profile.familyBackground.familyValues || "Not specified";
        
        const familyLocationElement = document.querySelector('#family .more-info p:nth-child(2) .sub-down');
        if (familyLocationElement) familyLocationElement.textContent = profile.familyBackground.familyLocation || "Not specified";

        // Safely populate Lifestyle Section
        const lifestyleParagraph = document.querySelector('#lifestyle p');
        if (lifestyleParagraph) lifestyleParagraph.textContent = "I believe in maintaining a balanced and healthy lifestyle while enjoying hobbies that enrich my life.";
        
        const dietElement = document.querySelector('#lifestyle .personal-info p:nth-child(1) .sub-down');
        if (dietElement) dietElement.textContent = profile.lifestyle.diet || "Not specified";
        
        const drinkingElement = document.querySelector('#lifestyle .personal-info p:nth-child(2) .sub-down');
        if (drinkingElement) drinkingElement.textContent = profile.lifestyle.drinking || "Not specified";
        
        const smokingElement = document.querySelector('#lifestyle .personal-info p:nth-child(3) .sub-down');
        if (smokingElement) smokingElement.textContent = profile.lifestyle.smoking || "Not specified";
        
        const fitnessElement = document.querySelector('#lifestyle .personal-info p:nth-child(4) .sub-down');
        if (fitnessElement) fitnessElement.textContent = profile.lifestyle.fitness || "Not specified";
        
        const musicElement = document.querySelector('#lifestyle .more-info p:nth-child(1) .sub-down');
        if (musicElement) musicElement.textContent = profile.lifestyle.music || "Not specified";
        
        const moviesElement = document.querySelector('#lifestyle .more-info p:nth-child(2) .sub-down');
        if (moviesElement) moviesElement.textContent = profile.lifestyle.movies || "Not specified";
        
        const travelElement = document.querySelector('#lifestyle .more-info p:nth-child(3) .sub-down');
        if (travelElement) travelElement.textContent = profile.lifestyle.travel || "Not specified";
        
        const booksElement = document.querySelector('#lifestyle .more-info p:nth-child(4) .sub-down');
        if (booksElement) booksElement.textContent = profile.lifestyle.books || "Not specified";

        // Safely populate Education Section
        const educationQualificationElement = document.querySelector('#education .personal-info p:nth-child(1) .sub-down');
        if (educationQualificationElement) educationQualificationElement.textContent = profile.educationCareer.education || "Not specified";
        
        const educationUniversityElement = document.querySelector('#education .personal-info p:nth-child(2) .sub-down');
        if (educationUniversityElement) educationUniversityElement.textContent = profile.educationCareer.university || "Not specified";
        
        const educationFieldElement = document.querySelector('#education .personal-info p:nth-child(3) .sub-down');
        if (educationFieldElement) educationFieldElement.textContent = profile.educationCareer.fieldOfStudy || "Not specified";
        
        const educationJobElement = document.querySelector('#education .more-info p:nth-child(1) .sub-down');
        if (educationJobElement) educationJobElement.textContent = profile.educationCareer.currentJob || "Not specified";
        
        const educationAchievementsElement = document.querySelector('#education .more-info p:nth-child(2) .sub-down');
        if (educationAchievementsElement) educationAchievementsElement.textContent = profile.educationCareer.achievements || "Not specified";
        
        const educationGoalsElement = document.querySelector('#education .more-info p:nth-child(3) .sub-down');
        if (educationGoalsElement) educationGoalsElement.textContent = profile.educationCareer.careerGoals || "Not specified";

        // Safely populate Preferences Section
        const preferencesParagraph = document.querySelector('#preferences p');
        if (preferencesParagraph) preferencesParagraph.textContent = profile.partnerPreferences.preferences || "Not specified";
        
        const prefAgeRangeElement = document.querySelector('#preferences .personal-info p:nth-child(1) .sub-down');
        if (prefAgeRangeElement) prefAgeRangeElement.textContent = profile.partnerPreferences.ageRange || "Not specified";
        
        const prefHeightRangeElement = document.querySelector('#preferences .personal-info p:nth-child(2) .sub-down');
        if (prefHeightRangeElement) prefHeightRangeElement.textContent = profile.partnerPreferences.heightRange || "Not specified";
        
        const prefEducationElement = document.querySelector('#preferences .more-info p:nth-child(1) .sub-down');
        if (prefEducationElement) prefEducationElement.textContent = profile.partnerPreferences.education.join(', ') || "Not specified";
        
        const prefOccupationElement = document.querySelector('#preferences .more-info p:nth-child(2) .sub-down');
        if (prefOccupationElement) prefOccupationElement.textContent = profile.partnerPreferences.occupation.join(', ') || "Not specified";
        
        const prefMaritalStatusElement = document.querySelector('#preferences .more-info p:nth-child(3) .sub-down');
        if (prefMaritalStatusElement) prefMaritalStatusElement.textContent = profile.partnerPreferences.maritalStatus || "Not specified";
        
        const prefLocationsElement = document.querySelector('#preferences .more-info p:nth-child(4) .sub-down');
        if (prefLocationsElement) prefLocationsElement.textContent = profile.partnerPreferences.locations.join(', ') || "Not specified";

        // Safely populate Contact Information
        const phoneElement = document.querySelector('.contact-item:nth-child(1) .hidden-info');
        if (phoneElement) phoneElement.textContent = profile.contactInfo.phone || "Not specified";
        
        const emailElement = document.querySelector('.contact-item:nth-child(2) .hidden-info');
        if (emailElement) emailElement.textContent = profile.contactInfo.email || "Not specified";

        // Populate Edit Modal with Current Data
        populateEditModal(profile);
    } catch (error) {
        console.error('Fetch Profile Error:', error);
        alert('An error occurred while fetching the profile: ' + error.message);
    }
};

// Function to populate the Edit Modal with current profile data
function populateEditModal(profile) {
    document.getElementById('full-name').value = profile.personalInfo.fullName || '';
    document.getElementById('age').value = profile.personalInfo.age || '';
    document.getElementById('dob').value = profile.personalInfo.dob ? profile.personalInfo.dob.split('T')[0] : '';
    document.getElementById('gender').value = profile.personalInfo.gender || 'male';
    document.getElementById('height').value = profile.personalInfo.height || '';
    document.getElementById('marital-status').value = profile.personalInfo.maritalStatus || 'never-married';
    document.getElementById('community').value = profile.personalInfo.community || '';
    document.getElementById('location').value = profile.personalInfo.location || '';
    document.getElementById('hometown').value = profile.personalInfo.hometown || '';

    document.getElementById('education').value = profile.educationCareer.education || '';
    document.getElementById('university').value = profile.educationCareer.university || '';
    document.getElementById('fieldOfStudy').value = profile.educationCareer.fieldOfStudy || '';
    document.getElementById('profession').value = profile.educationCareer.profession || '';
    document.getElementById('company').value = profile.educationCareer.company || '';
    document.getElementById('currentJob').value = profile.educationCareer.currentJob || '';
    document.getElementById('achievements').value = profile.educationCareer.achievements || '';
    document.getElementById('careerGoals').value = profile.educationCareer.careerGoals || '';

    document.getElementById('family-type').value = profile.familyBackground.familyType || '';
    document.getElementById('siblings').value = profile.familyBackground.siblings || '';
    document.getElementById('father-occupation').value = profile.familyBackground.fatherOccupation || '';
    document.getElementById('mother-occupation').value = profile.familyBackground.motherOccupation || '';
    document.getElementById('family-values').value = profile.familyBackground.familyValues || '';
    document.getElementById('family-location').value = profile.familyBackground.familyLocation || '';
    document.getElementById('family-background').value = profile.familyBackground.familyBackground || '';

    document.getElementById('diet').value = profile.lifestyle.diet || 'vegetarian';
    document.getElementById('drinking').value = profile.lifestyle.drinking || 'never';
    document.getElementById('smoking').value = profile.lifestyle.smoking || 'non-smoker';
    document.getElementById('fitness').value = profile.lifestyle.fitness || '';
    document.getElementById('music').value = profile.lifestyle.music || '';
    document.getElementById('movies').value = profile.lifestyle.movies || '';
    document.getElementById('travel').value = profile.lifestyle.travel || '';
    document.getElementById('books').value = profile.lifestyle.books || '';

    document.getElementById('pref-age-range').value = profile.partnerPreferences.ageRange || '';
    document.getElementById('pref-height-range').value = profile.partnerPreferences.heightRange || '';
    document.getElementById('partner-preferences').value = profile.partnerPreferences.preferences || '';

    const languagesList = document.getElementById('languages');
    if (languagesList) languagesList.innerHTML = profile.aboutMe.languages.map(lang => `<span class="tag">${lang}<span class="remove-tag">×</span></span>`).join('');
    const interestsList = document.getElementById('interests');
    if (interestsList) interestsList.innerHTML = profile.aboutMe.interests.map(interest => `<span class="tag">${interest}<span class="remove-tag">×</span></span>`).join('');
    const prefEducationList = document.getElementById('pref-education');
    if (prefEducationList) prefEducationList.innerHTML = profile.partnerPreferences.education.map(edu => `<span class="tag">${edu}<span class="remove-tag">×</span></span>`).join('');
    const prefOccupationList = document.getElementById('pref-occupation');
    if (prefOccupationList) prefOccupationList.innerHTML = profile.partnerPreferences.occupation.map(occ => `<span class="tag">${occ}<span class="remove-tag">×</span></span>`).join('');
    const prefLocationsList = document.getElementById('pref-locations');
    if (prefLocationsList) prefLocationsList.innerHTML = profile.partnerPreferences.locations.map(loc => `<span class="tag">${loc}<span class="remove-tag">×</span></span>`).join('');
    const prefMaritalStatusList = document.getElementById('pref-marital-status');
    if (prefMaritalStatusList) prefMaritalStatusList.innerHTML = profile.partnerPreferences.maritalStatus.map(status => `<span class="tag">${status}<span class="remove-tag">×</span></span>`).join('');

    document.getElementById('email').value = profile.contactInfo.email || '';
    document.getElementById('phone').value = profile.contactInfo.phone || '';
}