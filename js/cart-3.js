document.addEventListener('DOMContentLoaded', function() {
  var inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"]');

  inputs.forEach(function(input) {
    input.addEventListener('blur', function() {
      toggleLabel(input);
      validateField(input);
    });

    input.addEventListener('input', function() {
      if (input.getAttribute('id') === 'postal-code' && input.value.length === 6) {
        fetchCityAndStreet(input.value);
        validateField(input);
      } else {
        toggleLabel(input);
        if (!input.value) {
          var wrapper = input.closest('.x-wrapper');
          wrapper.classList.remove('valid');
          wrapper.classList.remove('error');
          var errorLabel = wrapper.querySelector('.error-label');
          if (errorLabel) {
            wrapper.removeChild(errorLabel);
          }
        }
      }
    });

    // Збереження стану заповненого поля після завантаження сторінки
    if (input.value) {
      toggleLabel(input);
      validateField(input);
    }
  });

  var submitButton = document.querySelector('.primary-button');
  submitButton.addEventListener('click', function(event) {
    if (!validateFields()) {
      event.preventDefault();
    }
  });
});

function toggleLabel(input) {
  var label = input.previousElementSibling;
  if (input.value) {
    input.classList.add('has-value');
    label.classList.add('has-value');
  } else {
    input.classList.remove('has-value');
    label.classList.remove('has-value');
  }

  if (input.value) {
    var wrapper = input.closest('.x-wrapper');
    wrapper.classList.remove('error');
    var errorLabel = wrapper.querySelector('.error-label');
    if (errorLabel) {
      wrapper.removeChild(errorLabel);
    }
  }
}

function validateField(input) {
  var valid = true;
  var wrapper = input.closest('.x-wrapper');
  var errorLabel = wrapper.querySelector('.error-label');
  var isVisible = wrapper.offsetParent !== null;

  if (isVisible) {
    if (!input.value) {
      valid = false;
      addError(wrapper, 'Обов’язкове поле');
    } else {
      var fieldType = input.getAttribute('type');
      var fieldName = input.getAttribute('name');

      switch (fieldType) {
        case 'email':
          if (!validateEmail(input.value)) {
            valid = false;
            addError(wrapper, 'У введеному email пропущені символи');
          }
          break;
        case 'tel':
          if (!validatePhone(input.value)) {
            valid = false;
            addError(wrapper, 'Необхідно ввести номер у форматі +48');
          }
          break;
        case 'text':
          switch (fieldName) {
            case 'name':
            case 'other-name':
              if (!validateName(input.value)) {
                valid = false;
                addError(wrapper, 'Необхідно використати A-z або А-я символи');
              }
              break;
            case 'country':
              if (!validateCountry(input.value)) {
                valid = false;
                addError(wrapper, 'Некоректна назва країни');
              }
              break;
            case 'postal-code':
            case 'other-postal-code':
              if (!validatePostalCode(input.value)) {
                valid = false;
                addError(wrapper, 'Необхідно ввести код у форматі XX-XXX');
              }
              break;
            case 'city':
            case 'other-city':
              if (!validateCity(input.value)) {
                valid = false;
                addError(wrapper, 'Некоректна назва міста');
              }
              break;
            case 'street':
            case 'other-street':
              if (!validateStreet(input.value)) {
                valid = false;
                addError(wrapper, 'Некоректна адреса');
              }
              break;
          }
          break;
        case 'password':
          // Тут можна додати додаткові перевірки для паролю
          break;
      }

      if (valid) {
        wrapper.classList.remove('error');
        wrapper.classList.add('valid');
      } else {
        wrapper.classList.remove('valid');
      }
    }
  }
}

function validateFields() {
  var valid = true;
  var inputs = document.querySelectorAll('.x-wrapper input:required');

  inputs.forEach(function(input) {
    var wrapper = input.closest('.x-wrapper');
    var errorLabel = wrapper.querySelector('.error-label');
    var isVisible = wrapper.offsetParent !== null;

    if (isVisible && !input.value) {
      valid = false;
      addError(wrapper, 'Обов’язкове поле');
    } else {
      validateField(input);
      if (wrapper.classList.contains('error')) {
        valid = false;
      }
    }
  });

  return valid;
}

function addError(wrapper, message) {
  wrapper.classList.add('error');
  var errorLabel = wrapper.querySelector('.error-label');
  if (!errorLabel) {
    errorLabel = document.createElement('p');
    errorLabel.classList.add('error-label');
    wrapper.appendChild(errorLabel);
  }
  errorLabel.textContent = message;
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function validatePhone(phone) {
  var re = /^\+48\d{9}$/;
  return re.test(phone);
}

function validateName(name) {
  var re = /^[A-Za-zА-Яа-я\s]+$/;
  return re.test(name);
}

function validateCountry(country) {
  return country.toLowerCase() === 'польща';
}

function validatePostalCode(postalCode) {
  var re = /^\d{2}-\d{3}$/;
  return re.test(postalCode);
}

function validateCity(city) {
  var re = /^[A-Za-zА-Яа-я\s]+$/;
  return re.test(city);
}

function validateStreet(street) {
  var re = /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*\d)[A-Za-zА-Яа-я\s\d.,]*$/;
  return re.test(street);
}

function fetchCityAndStreet(postalCode) {
  if (postalCode.length === 6 && validatePostalCode(postalCode)) {
    var cityInput = document.querySelector('#city');
    var streetInput = document.querySelector('#street');

    fetch(`https://api.zippopotam.us/pl/${postalCode}`)
      .then(response => response.json())
      .then(data => {
        var place = data.places[0];
        cityInput.value = place['place name'];
        toggleLabel(cityInput);
        validateField(cityInput);
      })
      .catch(error => {
        console.error('Error fetching city data:', error);
      });
  }
}

function togglePasswordField() {
  var checkBox = document.getElementById("create-account");
  var passwordField = document.getElementById("password-field");
  var accountInfo = document.getElementById("account-info");
  if (checkBox.checked) {
    passwordField.classList.remove('hidden');
    passwordField.classList.add('visible');
    accountInfo.classList.remove('hidden');
    accountInfo.classList.add('visible');
  } else {
    passwordField.classList.remove('visible');
    passwordField.classList.add('hidden');
    accountInfo.classList.remove('visible');
    accountInfo.classList.add('hidden');
  }
}

function toggleOtherRecipientFields() {
  var checkBox = document.getElementById("other-recipient");
  var otherRecipientFields = document.getElementById("other-recipient-fields");
  if (checkBox.checked) {
    otherRecipientFields.classList.remove('hidden');
    otherRecipientFields.classList.add('visible');
  } else {
    otherRecipientFields.classList.remove('visible');
    otherRecipientFields.classList.add('hidden');
  }
}
