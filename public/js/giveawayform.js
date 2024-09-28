document.addEventListener('DOMContentLoaded', function() {
    
    fetch('/check-auth', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (!data.isLoggedIn) {
                // If the user is not logged in, redirect to the login page
                alert('You must be logged in to access this page.');
                window.location.href = '/login';
            }
            else{
                updateMenuForAuthenticatedUser();
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
            alert('An error occurred. Please try again later.');
        });


    function getOrdinalSuffix(day) {
        if(day > 3 && day < 21) return 'th';
        switch(day %10){
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    function updateDateTime(){
        const now = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        let day = now.getDate();
        let suffix = getOrdinalSuffix(day);
        const dateString = now.toLocaleDateString('en-CA', options).replace(day, day + suffix);
        const timeString = now.toLocaleTimeString('en-CA');
        document.getElementById('datetime').innerText = `${dateString}, Time: ${timeString}`;
    }

    setInterval(updateDateTime, 1000);
    window.onload = updateDateTime;

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

    document.getElementById('giveawayForm').addEventListener('submit', function(event){
        event.preventDefault();

        document.querySelectorAll('.error').forEach(function(el){
            el.textContent='';
        });

        let isValid = true;
        const petType = document.querySelector('input[name="pettype"]:checked');
        const catType = document.getElementById('cattype');
        const dogType = document.getElementById('dogtype');

        const firstName = document.getElementById('firstname').value.trim();
        if (!firstName) {
            document.getElementById('firstnameError').textContent = 'First Name is required';
            isValid = false;
        }

        const lastName = document.getElementById('lastname').value.trim();
        if (!lastName) {
            document.getElementById('lastnameError').textContent = 'Last Name is required';
            isValid = false;
        }

        const address = document.getElementById('address').value.trim();
        if (!address) {
            document.getElementById('addressError').textContent = 'Address is required';
            isValid = false;
        }

        const email = document.getElementById('email').value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email) {
            document.getElementById('emailError').textContent = 'Email Address is required';
            isValid = false;
        } else if (!emailPattern.test(email)) {
            document.getElementById('emailError').textContent = 'Invalid Email Address format';
            isValid = false;
        }

        const phoneNumber = document.getElementById('phonenumber').value.trim();
        if (!phoneNumber) {
            document.getElementById('phonenumberError').textContent = 'Phone Number is required';
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

        const petAge = document.getElementById('age').value;
        if (!petAge) {
            document.getElementById('ageError').textContent = 'Pet Age is required';
            isValid = false;
        }

        const petGender = document.querySelector('input[name="petgender"]:checked');
        if (!petGender) {
            document.getElementById('petgenderError').textContent = 'Pet Gender is required';
            isValid = false;
        }

        const friendliness = document.getElementById('friendliness').value;
        if (!friendliness) {
            document.getElementById('friendlinessError').textContent = 'Friendliness Level is required';
            isValid = false;
        }

        const adaptability = document.getElementById('adaptability').value;
        if (!adaptability) {
            document.getElementById('adaptabilityError').textContent = 'Adaptability Level is required';
            isValid = false;
        }

        const suitability = document.querySelector('input[name="suitability"]:checked');
        if (!suitability) {
            document.getElementById('suitabilityError').textContent = 'Suitability is required';
            isValid = false;
        }

        if (isValid) {
           // alert("Form submitted successfully!");
           // document.getElementById('giveawayForm').submit();

           const username = localStorage.getItem('username');

           fetch('/submitGiveawayForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                firstname: document.getElementById('firstname').value.trim(),
                lastname: document.getElementById('lastname').value.trim(),
                address: document.getElementById('address').value.trim(),
                email: document.getElementById('email').value.trim(),
                phonenumber: document.getElementById('phonenumber').value.trim(),
                pettype: document.querySelector('input[name="pettype"]:checked').value,
                cattype: document.getElementById('cattype').value.trim(),
                dogtype: document.getElementById('dogtype').value.trim(),
                age: document.getElementById('age').value,
                petgender: document.querySelector('input[name="petgender"]:checked').value,
                friendliness: document.getElementById('friendliness').value,
                adaptability: document.getElementById('adaptability').value,
                suitability: document.querySelector('input[name="suitability"]:checked').value,
                description: document.getElementById('description').value.trim()
            })
        }).then(response => response.text())
          .then(result => {
              alert("Form submitted successfully!");
              window.location.reload();
              updateMenuForAuthenticatedUser();
          })
          .catch(error => {
              console.error('Error:', error); 
              //alert('An error occurred while submitting the form.');
          });
        }

        
    });

    document.querySelectorAll('input[name="pettype"]').forEach(function(el) {
        el.addEventListener('change', togglePetOptions);
    });

    togglePetOptions();
});

function updateMenuForAuthenticatedUser(){
    const menuItems = document.querySelectorAll('#sideMenu ul li');
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.href.includes('/login') || link.href.includes('/signup')) {
            item.style.display = 'none';
        }
    });

    const logoutForm = document.createElement('li');
    logoutForm.innerHTML = `
        <form id="logoutForm" action="/logout" method="POST" style="display: inline;">
            <button type="submit" style="background:none;border:none;color:black; font-family: 'Times New Roman', Times, serif; font-size: 18px;">
                Logout
            </button>
        </form>
    `;
    document.querySelector('#sideMenu ul').appendChild(logoutForm);

}