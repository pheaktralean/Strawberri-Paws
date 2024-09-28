document.addEventListener('DOMContentLoaded', function() {
    function togglePetOptions() {
        const catType = document.getElementById('cattype');
        const dogType = document.getElementById('dogtype');
        const selectedPetType = document.querySelector('input[name="pettype"]:checked');

        if (catType && dogType && selectedPetType) {
            if (selectedPetType.value === 'cat') {
                catType.disabled = false;
                dogType.disabled = true;
            } else if (selectedPetType.value === 'dog') {
                catType.disabled = true;
                dogType.disabled = false;
            }
        } /*else {
            console.error('One or more elements not found in togglePetOptions');
        }*/
    }

    // Initialize pet options based on the current selection
    togglePetOptions();

    // Add event listeners for pet type selection
    document.querySelectorAll('input[name="pettype"]').forEach(function(el) {
        el.addEventListener('change', togglePetOptions);
    });

    // Form submission handler
    const findForm = document.getElementById('findForm');
    if (!findForm) {
        console.error('Form element with ID findForm not found');
        return;
    }

    findForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.error').forEach(function(el) {
            el.textContent = '';
        });

        let isValid = true;

        // Personal Information
        const firstname = document.getElementById('firstname')?.value.trim();
        const firstnameErrorElement = document.getElementById('firstnameError');
        if (!firstname) {
            if (firstnameErrorElement) firstnameErrorElement.textContent = 'First Name is required';
            isValid = false;
        }

        const lastname = document.getElementById('lastname')?.value.trim();
        const lastnameErrorElement = document.getElementById('lastnameError');
        if (!lastname) {
            if (lastnameErrorElement) lastnameErrorElement.textContent = 'Last Name is required';
            isValid = false;
        }

        const email = document.getElementById('email')?.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailErrorElement = document.getElementById('emailError');
        if (!email) {
            if (emailErrorElement) emailErrorElement.textContent = 'Email Address is required';
            isValid = false;
        } else if (!emailPattern.test(email)) {
            if (emailErrorElement) emailErrorElement.textContent = 'Please enter a valid email address';
            isValid = false;
        }

        const phoneNumber = document.getElementById('phonenumber')?.value.trim();
        const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        const phoneNumberErrorElement = document.getElementById('phonenumberError');
        if (!phoneNumber) {
            if (phoneNumberErrorElement) phoneNumberErrorElement.textContent = 'Phone Number is required';
            isValid = false;
        } else if (!phonePattern.test(phoneNumber)) {
            if (phoneNumberErrorElement) phoneNumberErrorElement.textContent = 'Please enter a valid phone number (ddd-ddd-dddd)';
            isValid = false;
        }

        // Pet Information
        const petType = document.querySelector('input[name="pettype"]:checked');
        const pettypeErrorElement = document.getElementById('pettypeError');
        if (!petType) {
            if (pettypeErrorElement) pettypeErrorElement.textContent = 'Pet Type is required';
            isValid = false;
        }

        const catTypeValue = document.getElementById('cattype')?.value.trim();
        const dogTypeValue = document.getElementById('dogtype')?.value.trim();
        const cattypeErrorElement = document.getElementById('cattypeError');
        const dogtypeErrorElement = document.getElementById('dogtypeError');
        if (petType && petType.value === 'cat' && !catTypeValue) {
            if (cattypeErrorElement) cattypeErrorElement.textContent = 'Cat Type is required';
            isValid = false;
        } else if (petType && petType.value === 'dog' && !dogTypeValue) {
            if (dogtypeErrorElement) dogtypeErrorElement.textContent = 'Dog Type is required';
            isValid = false;
        }

        const petAge = document.querySelector('input[name="petage"]:checked');
        const petageErrorElement = document.getElementById('petageError');
        if (!petAge) {
            if (petageErrorElement) petageErrorElement.textContent = 'Pet Age is required';
            isValid = false;
        }

        const petGender = document.querySelector('input[name="petgender"]:checked');
        const petgenderErrorElement = document.getElementById('petgenderError');
        if (!petGender) {
            if (petgenderErrorElement) petgenderErrorElement.textContent = 'Pet Gender is required';
            isValid = false;
        }

        const friendliness = document.getElementById('friendliness')?.value.trim();
        const friendlinessErrorElement = document.getElementById('friendlinessError');
        if (!friendliness) {
            if (friendlinessErrorElement) friendlinessErrorElement.textContent = 'Friendliness is required';
            isValid = false;
        }

        // Submit the form if valid
        if (isValid) {
            findForm.submit();
            /*const preferredPetType = petType ? petType.value : '';
            const preferredCatType = petType && petType.value === 'cat' ? catTypeValue : '';
            const preferredDogType = petType && petType.value === 'dog' ? dogTypeValue : '';
            const preferredAge = petAge ? petAge.value : '';
            const preferredGender = petGender ? petGender.value : '';
            const preferredFriendliness = friendliness;

            // Log the values to verify
            console.log({
                preferredPetType,
                preferredCatType,
                preferredDogType,
                preferredAge,
                preferredGender,
                preferredFriendliness
            });

            findForm.submit(); // Submit the form after logging

            // Define pets array
            const pets = [
                { id: 1, type: 'dog', breed: 'Labrador Retriever', age: '1-3 years', gender: 'Male', friendliness: 'very_friendly', image: 'max.jpeg' },
                { id: 2, type: 'dog', breed: 'German Shepherd', age: '1-3 years', gender: 'Female', friendliness: 'friendly', image: 'zuri.jpeg' },
                { id: 3, type: 'dog', breed: 'Golden Retriever', age: '1-3 years', gender: 'Male', friendliness: 'very_friendly', image: 'bella.jpeg' },
                { id: 4, type: 'dog', breed: 'Beagle', age: '1-3 years', gender: 'Female', friendliness: 'neutral', image: 'flynn.jpeg' },
                { id: 5, type: 'dog', breed: 'Mixed Breed', age: '1-3 years', gender: 'Male', friendliness: 'friendly', image: 'rocky.jpeg' },
                { id: 6, type: 'cat', breed: 'Siamese', age: '1-3 years', gender: 'Male', friendliness: 'very_friendly', image: 'dove.jpeg' },
                { id: 7, type: 'cat', breed: 'Birman', age: '4-7 years', gender: 'Male', friendliness: 'friendly', image: 'eve.jpeg' },
                { id: 8, type: 'cat', breed: 'Mixed Breed', age: '1-3 years', gender: 'Female', friendliness: 'neutral', image: 'coconut.jpeg' }
            ];

            // Filter pets based on preferred info
            const matchedPets = pets.filter(pet => {
                return (preferredPetType === '' || pet.type === preferredPetType) &&
                       (preferredPetType === 'cat' ? pet.breed === preferredCatType : pet.breed === preferredDogType) &&
                       pet.age === preferredAge &&
                       pet.gender === preferredGender &&
                       pet.friendliness === preferredFriendliness;
            });

            // Display matched pets
            const resultSection = document.getElementById('results');
            resultSection.innerHTML = ''; // Clear previous results

            if (matchedPets.length > 0) {
                matchedPets.forEach(pet => {
                    const petElement = document.createElement('div');
                    petElement.className = 'pet-result';
                    petElement.innerHTML = `
                        <h3>${pet.breed}</h3>
                        <img src="images/${pet.image}" alt="${pet.breed}" />
                        <p>Type: ${pet.type}</p>
                        <p>Age: ${pet.age}</p>
                        <p>Gender: ${pet.gender}</p>
                        <p>Friendliness: ${pet.friendliness}</p>
                    `;
                    resultSection.appendChild(petElement);
                });
            } else {
                resultSection.innerHTML = '<p>No pets found matching your criteria.</p>';
            }
            */

        } else {
            console.log("Form is invalid");
        }
    });
});
