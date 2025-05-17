document.addEventListener('DOMContentLoaded', function() {
  // Location dropdown functionality
  const btn = document.getElementById('locationBtn');
  const list = document.getElementById('locationList');
  const input = document.getElementById('locationInput');

  btn.addEventListener('click', () => {
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
  });

  list.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      btn.textContent = item.textContent + ' ▾';
      input.value = item.textContent;
      list.style.display = 'none';
    });
  });

  // Close dropdown if clicked outside
  window.addEventListener('click', function(e) {
    if (!btn.contains(e.target) && !list.contains(e.target)) {
      list.style.display = 'none';
    }
  });

  // Form submission
  const form = document.getElementById('artistForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Get form data
    const formData = new FormData(form);
    formData.append('location', input.value);
    
    // Submit to Google Sheets
    submitToGoogleSheets(formData)
      .then(response => {
        if (response.result === 'success') {
          alert("Thank you for registering!\nOur team will contact you soon.");
          form.reset();
        } else {
          throw new Error(response.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("There was a problem submitting your form. Please try again.\n" + error.message);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Form';
      });
  });
});

function submitToGoogleSheets(formData) {
  // Replace with your Google Apps Script Web App URL
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxu178eDM5nkZq-5BEhztiygWaE82CGIKqoAqFgdBqZqDUF2XOv7YrMOeinDhD4FVVw9A/exec';
  
  return fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
}