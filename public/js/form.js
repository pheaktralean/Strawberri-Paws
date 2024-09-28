function togglePetOptions() {
    const catType = document.getElementById('cattype');
    const dogType = document.getElementById('dogtype');
    const selectedPetType = document.querySelector('input[name="pettype"]:checked').value;

    if (selectedPetType === 'cat') {
        catType.disabled = false;
        dogType.disabled = true;
    } else if (selectedPetType === 'dog') {
        catType.disabled = true;
        dogType.disabled = false;
    }
}

document.querySelectorAll('input[name="pettype"]').forEach(function(el) {
    el.addEventListener('change', togglePetOptions);
});

document.getElementById('petForm').addEventListener('submit', function(event) {
    event.preventDefault();

    document.querySelectorAll('.error').forEach(function(el) {
        el.textContent = '';
    });

    let isValid = true;
    const petType = document.querySelector('input[name="pettype"]:checked');
    const catType = document.getElementById('cattype');
    const dogType = document.getElementById('dogtype');

    const name = document.getElementById('name').value;
    if (!name) {
        document.getElementById('nameError').textContent = 'Adopter Name is required';
        isValid = false;
    }

    const coname = document.getElementById('coname').value;
    if (!coname) {
        document.getElementById('conameError').textContent = 'Co-Adopter Name is required';
        isValid = false;
    }

    const email = document.getElementById('email').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.getElementById('emailError').textContent = 'Email Address is required';
        isValid = false;
    }else if(!emailPattern.test(email)){
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }

    const phoneNumber = document.getElementById('phonenumber').value;
    if (!phoneNumber) {
        document.getElementById('phonenumberError').textContent = 'Phone Number is required';
        isValid = false;
    }

    const address = document.getElementById('address').value;
    if (!address) {
        document.getElementById('addressError').textContent = 'Address is required';
        isValid = false;
    }

    if (!petType) {
        document.getElementById('pettypeError').innerText = 'Pet Type is required';
        isValid = false;
    } else if (petType.value === 'cat' && !catType.value) {
        document.getElementById('cattypeError').innerText = 'Cat Type is required';
        isValid = false;
    } else if (petType.value === 'dog' && !dogType.value) {
        document.getElementById('dogtypeError').innerText = 'Dog Type is required';
        isValid = false;
    }

    const petName = document.getElementById('petname').value;
    if (!petName) {
        document.getElementById('petnameError').textContent = 'Pet Name is required';
        isValid = false;
    }

    const petID = document.getElementById('petid').value;
    if (!petID) {
        document.getElementById('petidError').textContent = 'Pet ID is required';
        isValid = false;
    }
    const petAge = document.querySelector('input[name="petage"]:checked');
    if (!petAge) {
        document.getElementById('petageError').textContent = 'Pet Age is required';
        isValid = false;
    }

    const petGender = document.querySelector('input[name="petgender"]:checked');
    if (!petGender) {
        document.getElementById('petgenderError').textContent = 'Pet Gender is required';
        isValid = false;
    }


    if (isValid) {
        alert("Form submitted successfully!");
        document.getElementById('petForm').submit();
    }
});

togglePetOptions();