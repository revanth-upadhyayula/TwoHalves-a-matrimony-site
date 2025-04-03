document.addEventListener('DOMContentLoaded', () => {
    // Handle tag inputs
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


    // Handle form submission
    const user = localStorage.getItem('userId');

    const form = document.getElementById('register-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            personalInfo: {
                fullName: document.getElementById('full-name').value,
                age: document.getElementById('age').value,
                dob: document.getElementById('dob').value,
                gender: document.getElementById('gender').value,
                height: document.getElementById('height').value,
                maritalStatus: document.getElementById('marital-status').value,
                location: document.getElementById('location').value,
                hometown: document.getElementById('hometown').value
            },
            aboutMe: {
                about: document.getElementById('about').value,
                languages: Array.from(document.getElementById('languages').children)
                    .map(tag => tag.textContent.slice(0, -1)),
                interests: Array.from(document.getElementById('interests').children)
                    .map(tag => tag.textContent.slice(0, -1))
            },
            educationCareer: {
                education: document.getElementById('education').value,
                university: document.getElementById('university').value,
                profession: document.getElementById('profession').value,
                company: document.getElementById('company').value
            },
            familyBackground: {
                familyType: document.getElementById('family-type').value,
                siblings: document.getElementById('siblings').value,
                fatherOccupation: document.getElementById('father-occupation').value,
                motherOccupation: document.getElementById('mother-occupation').value,
                familyValues: document.getElementById('family-values').value,
                familyBackground: document.getElementById('family-background').value
            },
            lifestyle: {
                diet: document.getElementById('diet').value,
                drinking: document.getElementById('drinking').value,
                smoking: document.getElementById('smoking').value,
                fitness: document.getElementById('fitness').value
            },
            partnerPreferences: {
                ageRange: document.getElementById('pref-age-range').value,
                heightRange: document.getElementById('pref-height-range').value,
                education: Array.from(document.getElementById('pref-education').children)
                    .map(tag => tag.textContent.slice(0, -1)),
                occupation: Array.from(document.getElementById('pref-occupation').children)
                    .map(tag => tag.textContent.slice(0, -1)),
                preferences: document.getElementById('partner-preferences').value
            },
            contactInfo: {
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            },
            userId:user
        };

        // Basic form validation
        if (!validateForm(formData)) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        // Save to localStorage (for demonstration)
        localStorage.setItem('matrimonyProfile', JSON.stringify(formData));
        
        // You can also send this data to a server using fetch
        
        fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Registration successful!');
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during registration.');
        });
        

        console.log('Form Data:', formData);
        alert('Profile saved successfully!');
        form.reset();
        clearTags();
    });

    // Basic form validation function
    function validateForm(data) {
        const { personalInfo, educationCareer, contactInfo } = data;
        
        // Check required personal info fields
        if (!personalInfo.fullName || !personalInfo.age || !personalInfo.dob ||
            !personalInfo.gender || !personalInfo.height || !personalInfo.maritalStatus ||
            !personalInfo.location) {
            return false;
        }

        // Check age constraints
        if (personalInfo.age < 18 || personalInfo.age > 100) {
            return false;
        }

        // Check required education/career fields
        if (!educationCareer.education || !educationCareer.profession) {
            return false;
        }

        // Check required contact info fields and basic format
        if (!contactInfo.email || !contactInfo.phone) {
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
            return false;
        }

        return true;
    }

    // Clear all tag lists
    function clearTags() {
        const tagLists = document.querySelectorAll('.tag-list');
        tagLists.forEach(list => {
            list.innerHTML = '';
        });
    }
});

// Add some basic CSS for tags (you can move this to your register.css)
const style = document.createElement('style');
style.textContent = `
    .tag {
        display: inline-flex;
        align-items: center;
        background: #f0f0f0;
        padding: 5px 10px;
        margin: 5px;
        border-radius: 15px;
    }
    .remove-tag {
        margin-left: 5px;
        cursor: pointer;
        font-weight: bold;
    }
    .remove-tag:hover {
        color: red;
    }
    .tag-input {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
    }
    .add-tag-btn {
        padding: 5px 10px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .add-tag-btn:hover {
        background: #45a049;
    }
`;
document.head.appendChild(style);