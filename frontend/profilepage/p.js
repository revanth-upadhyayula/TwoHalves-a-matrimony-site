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
            // Refetch data on tab switch to ensure all tabs are populated
            fetchProfileData();
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
                languages: Array.from(document.getElementById('languages').children).map(tag => tag.textContent.slice(0, -1)) || [],
                interests: Array.from(document.getElementById('interests').children).map(tag => tag.textContent.slice(0, -1)) || []
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
                education: Array.from(document.getElementById('pref-education').children).map(tag => tag.textContent.slice(0, -1)) || [],
                occupation: Array.from(document.getElementById('pref-occupation').children).map(tag => tag.textContent.slice(0, -1)) || [],
                locations: Array.from(document.getElementById('pref-locations').children).map(tag => tag.textContent.slice(0, -1)) || [],
                maritalStatus: Array.from(document.getElementById('pref-marital-status').children).map(tag => tag.textContent.slice(0, -1))[0] || '',
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
            fetchProfileData();
        } catch (error) {
            console.error('Profile Update Error:', error);
            alert('An error occurred while updating the profile: ' + error.message);
        }
    });
});

async function fetchProfileData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to view your profile.');
            window.location.href = 'login.html';
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
        const profile = data.profile || {};

        // Profile Header
        const nameElement = document.querySelector('.name h2');
        if (nameElement) nameElement.innerHTML = `${profile.personalInfo?.fullName || ''}, ${profile.personalInfo?.age || ''} <i class="ri-verified-badge-fill verified"></i>`;
        
        const locationElement = document.querySelector('.location');
        if (locationElement) locationElement.innerHTML = `<i class="ri-map-pin-2-line loc"></i> ${profile.personalInfo?.location?.replace(/,([^ ])/g, ', $1') || ''}`;
        
        const profileTagsElement = document.querySelector('.profile-tags');
        if (profileTagsElement) profileTagsElement.innerHTML = `
            <span>${profile.educationCareer?.profession || ''}</span>
            <span>${profile.personalInfo?.height || ''}</span>
            <span>${profile.personalInfo?.maritalStatus || ''}</span>
            <span>${profile.personalInfo?.community || 'Hindu'}</span>
        `;
        
        const memberSinceElement = document.querySelector('.member-since');
        if (memberSinceElement) memberSinceElement.innerHTML = `<i class="ri-calendar-event-line cal"></i> Member since ${new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

        // About Section
        const aboutParagraph = document.querySelector('#about p');
        if (aboutParagraph) aboutParagraph.textContent = profile.aboutMe?.about || 'Not specified';
        
        const dobElement = document.getElementById('dob-value');
        if (dobElement) dobElement.textContent = profile.personalInfo?.dob ? new Date(profile.personalInfo.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not specified';
        
        const jobElement = document.getElementById('job-value');
        if (jobElement) jobElement.textContent = `${profile.educationCareer?.profession || ''} at ${profile.educationCareer?.company || ''}`.trim() || 'Not specified';
        
        const educationElement = document.getElementById('education-value');
        if (educationElement) educationElement.textContent = `${profile.educationCareer?.education || ''}, ${profile.educationCareer?.university || ''}`.trim() || 'Not specified';
        
        const languageElement = document.getElementById('language-value');
        if (languageElement) languageElement.textContent = (profile.aboutMe?.languages || []).join(', ') || 'Not specified';
        
        const hometownElement = document.getElementById('hometown-value');
        if (hometownElement) hometownElement.textContent = profile.personalInfo?.hometown || 'Not specified';
        
        const interestTags = document.getElementById('interest-tags');
        if (interestTags) interestTags.innerHTML = (profile.aboutMe?.interests || []).map(interest => `<span>${interest}</span>`).join('') || 'Not specified';

        // Family Section
        const familyParagraph = document.querySelector('#family p');
        if (familyParagraph) familyParagraph.textContent = profile.familyBackground?.familyBackground || 'Not specified';
        
        const familyTypeElement = document.getElementById('family-type-value');
        if (familyTypeElement) familyTypeElement.textContent = profile.familyBackground?.familyType ? `${profile.familyBackground.familyType.charAt(0).toUpperCase() + profile.familyBackground.familyType.slice(1)} Family` : 'Not specified';
        
        const fatherOccupationElement = document.getElementById('father-occupation-value');
        if (fatherOccupationElement) fatherOccupationElement.textContent = profile.familyBackground?.fatherOccupation || 'Not specified';
        
        const motherOccupationElement = document.getElementById('mother-occupation-value');
        if (motherOccupationElement) motherOccupationElement.textContent = profile.familyBackground?.motherOccupation || 'Not specified';
        
        const siblingsElement = document.getElementById('siblings-value');
        if (siblingsElement) siblingsElement.textContent = profile.familyBackground?.siblings || '0';
        
        const familyValuesElement = document.getElementById('family-values-value');
        if (familyValuesElement) familyValuesElement.textContent = profile.familyBackground?.familyValues || 'Not specified';
        
        const familyLocationElement = document.getElementById('family-location-value');
        if (familyLocationElement) familyLocationElement.textContent = profile.familyBackground?.familyLocation || 'Not specified';

        // Lifestyle Section
        const lifestyleParagraph = document.querySelector('#lifestyle p');
        if (lifestyleParagraph) lifestyleParagraph.textContent = 'I believe in maintaining a balanced and healthy lifestyle while enjoying hobbies that enrich my life.';
        
        const dietElement = document.getElementById('diet-value');
        if (dietElement) dietElement.textContent = profile.lifestyle?.diet || 'Not specified';
        
        const drinkingElement = document.getElementById('drinking-value');
        if (drinkingElement) drinkingElement.textContent = profile.lifestyle?.drinking || 'Not specified';
        
        const smokingElement = document.getElementById('smoking-value');
        if (smokingElement) smokingElement.textContent = profile.lifestyle?.smoking || 'Not specified';
        
        const fitnessElement = document.getElementById('fitness-value');
        if (fitnessElement) fitnessElement.textContent = profile.lifestyle?.fitness || 'Not specified';
        
        const musicElement = document.getElementById('music-value');
        if (musicElement) musicElement.textContent = profile.lifestyle?.music || 'Not specified';
        
        const moviesElement = document.getElementById('movies-value');
        if (moviesElement) moviesElement.textContent = profile.lifestyle?.movies || 'Not specified';
        
        const travelElement = document.getElementById('travel-value');
        if (travelElement) travelElement.textContent = profile.lifestyle?.travel || 'Not specified';
        
        const booksElement = document.getElementById('books-value');
        if (booksElement) booksElement.textContent = profile.lifestyle?.books || 'Not specified';

        // Education Section
        const educationTabParagraph = document.querySelector('#education p');
        if (educationTabParagraph) educationTabParagraph.textContent = 'Education has played a crucial role in shaping my personal and professional journey.';
        
        const highestQualificationElement = document.getElementById('highest-qualification-value');
        if (highestQualificationElement) highestQualificationElement.textContent = profile.educationCareer?.education || 'Not specified';
        
        const universityElement = document.getElementById('university-value');
        if (universityElement) universityElement.textContent = profile.educationCareer?.university || 'Not specified';
        
        const fieldOfStudyElement = document.getElementById('field-of-study-value');
        if (fieldOfStudyElement) fieldOfStudyElement.textContent = profile.educationCareer?.fieldOfStudy || 'Not specified';
        
        const currentJobElement = document.getElementById('current-job-value');
        if (currentJobElement) currentJobElement.textContent = profile.educationCareer?.currentJob || 'Not specified';
        
        const achievementsElement = document.getElementById('achievements-value');
        if (achievementsElement) achievementsElement.textContent = profile.educationCareer?.achievements || 'Not specified';
        
        const careerGoalsElement = document.getElementById('career-goals-value');
        if (careerGoalsElement) careerGoalsElement.textContent = profile.educationCareer?.careerGoals || 'Not specified';

        // Preferences Section
        const preferencesParagraph = document.querySelector('#preferences p');
        if (preferencesParagraph) preferencesParagraph.textContent = `I'm looking for someone who is ${profile.partnerPreferences?.preferences || 'kind, intelligent, and values family'}.`;
        
        const ageRangeElement = document.getElementById('pref-age-range-value');
        if (ageRangeElement) ageRangeElement.textContent = profile.partnerPreferences?.ageRange || 'Not specified';
        
        const heightRangeElement = document.getElementById('pref-height-range-value');
        if (heightRangeElement) heightRangeElement.textContent = profile.partnerPreferences?.heightRange || 'Not specified';
        
        const educationPrefElement = document.getElementById('pref-education-value');
        if (educationPrefElement) educationPrefElement.textContent = (profile.partnerPreferences?.education || []).join(', ') || 'Not specified';
        
        const occupationPrefElement = document.getElementById('pref-occupation-value');
        if (occupationPrefElement) occupationPrefElement.textContent = (profile.partnerPreferences?.occupation || []).join(', ') || 'Not specified';
        
        const maritalStatusElement = document.getElementById('pref-marital-status-value');
        if (maritalStatusElement) maritalStatusElement.textContent = profile.partnerPreferences?.maritalStatus || 'Not specified';
        
        const partnerPreferencesElement = document.getElementById('partner-preferences-value');
        if (partnerPreferencesElement) partnerPreferencesElement.textContent = profile.partnerPreferences?.preferences || 'Not specified';

        // Contact Information
        const phoneElement = document.getElementById('phone-value');
        if (phoneElement) {
            if (user.isPremium) {
                phoneElement.textContent = profile.contactInfo?.phone || 'Not specified';
            } else {
                phoneElement.textContent = profile.contactInfo?.phone ? profile.contactInfo.phone.replace(/\d(?=\d{4})/g, 'x') : 'Upgrade to view';
            }
        }
        
        const emailElement = document.getElementById('email-value');
        if (emailElement) {
            if (user.isPremium) {
                emailElement.textContent = profile.contactInfo?.email || 'Not specified';
            } else {
                emailElement.textContent = profile.contactInfo?.email ? profile.contactInfo.email.replace(/(.{1}).*?(@.*)/, '$1xxx$2') : 'Upgrade to view';
            }
        }

        const socialElement = document.getElementById('social-value');
        if (socialElement) socialElement.textContent = profile.contactInfo?.socialProfiles || 'xxxxxx';

        // Populate Edit Modal
        populateEditModal(profile);
    } catch (error) {
        console.error('Fetch Profile Error:', error);
        alert('An error occurred while fetching the profile: ' + error.message);
    }
}

function populateEditModal(profile) {
    document.getElementById('full-name').value = profile.personalInfo?.fullName || '';
    document.getElementById('age').value = profile.personalInfo?.age || '';
    document.getElementById('dob').value = profile.personalInfo?.dob ? new Date(profile.personalInfo.dob).toISOString().split('T')[0] : '';
    document.getElementById('gender').value = profile.personalInfo?.gender || 'male';
    document.getElementById('height').value = profile.personalInfo?.height || '';
    document.getElementById('marital-status').value = profile.personalInfo?.maritalStatus || 'never-married';
    document.getElementById('community').value = profile.personalInfo?.community || '';
    document.getElementById('location').value = profile.personalInfo?.location || '';
    document.getElementById('hometown').value = profile.personalInfo?.hometown || '';

    document.getElementById('education').value = profile.educationCareer?.education || '';
    document.getElementById('university').value = profile.educationCareer?.university || '';
    document.getElementById('fieldOfStudy').value = profile.educationCareer?.fieldOfStudy || '';
    document.getElementById('profession').value = profile.educationCareer?.profession || '';
    document.getElementById('company').value = profile.educationCareer?.company || '';
    document.getElementById('currentJob').value = profile.educationCareer?.currentJob || '';
    document.getElementById('achievements').value = profile.educationCareer?.achievements || '';
    document.getElementById('careerGoals').value = profile.educationCareer?.careerGoals || '';

    document.getElementById('family-type').value = profile.familyBackground?.familyType || '';
    document.getElementById('siblings').value = profile.familyBackground?.siblings || '';
    document.getElementById('father-occupation').value = profile.familyBackground?.fatherOccupation || '';
    document.getElementById('mother-occupation').value = profile.familyBackground?.motherOccupation || '';
    document.getElementById('family-values').value = profile.familyBackground?.familyValues || '';
    document.getElementById('family-location').value = profile.familyBackground?.familyLocation || '';
    document.getElementById('family-background').value = profile.familyBackground?.familyBackground || '';

    document.getElementById('diet').value = profile.lifestyle?.diet || 'vegetarian';
    document.getElementById('drinking').value = profile.lifestyle?.drinking || 'never';
    document.getElementById('smoking').value = profile.lifestyle?.smoking || 'non-smoker';
    document.getElementById('fitness').value = profile.lifestyle?.fitness || '';
    document.getElementById('music').value = profile.lifestyle?.music || '';
    document.getElementById('movies').value = profile.lifestyle?.movies || '';
    document.getElementById('travel').value = profile.lifestyle?.travel || '';
    document.getElementById('books').value = profile.lifestyle?.books || '';

    document.getElementById('pref-age-range').value = profile.partnerPreferences?.ageRange || '';
    document.getElementById('pref-height-range').value = profile.partnerPreferences?.heightRange || '';
    document.getElementById('partner-preferences').value = profile.partnerPreferences?.preferences || '';

    const languagesList = document.getElementById('languages');
    if (languagesList) languagesList.innerHTML = (profile.aboutMe?.languages || []).map(lang => `<span class="tag">${lang}<span class="remove-tag">×</span></span>`).join('');
    const interestsList = document.getElementById('interests');
    if (interestsList) interestsList.innerHTML = (profile.aboutMe?.interests || []).map(interest => `<span class="tag">${interest}<span class="remove-tag">×</span></span>`).join('');
    const prefEducationList = document.getElementById('pref-education');
    if (prefEducationList) prefEducationList.innerHTML = (profile.partnerPreferences?.education || []).map(edu => `<span class="tag">${edu}<span class="remove-tag">×</span></span>`).join('');
    const prefOccupationList = document.getElementById('pref-occupation');
    if (prefOccupationList) prefOccupationList.innerHTML = (profile.partnerPreferences?.occupation || []).map(occ => `<span class="tag">${occ}<span class="remove-tag">×</span></span>`).join('');
    const prefLocationsList = document.getElementById('pref-locations');
    if (prefLocationsList) prefLocationsList.innerHTML = (profile.partnerPreferences?.locations || []).map(loc => `<span class="tag">${loc}<span class="remove-tag">×</span></span>`).join('');
    const prefMaritalStatusList = document.getElementById('pref-marital-status');
    if (prefMaritalStatusList) prefMaritalStatusList.innerHTML = (profile.partnerPreferences?.maritalStatus ? [profile.partnerPreferences.maritalStatus] : []).map(status => `<span class="tag">${status}<span class="remove-tag">×</span></span>`).join('');

    document.getElementById('email').value = profile.contactInfo?.email || '';
    document.getElementById('phone').value = profile.contactInfo?.phone || '';
}