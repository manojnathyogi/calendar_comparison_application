document.getElementById('calendarFiles').addEventListener('change', function() {
    const fileListElement = document.getElementById('file-list');
    fileListElement.innerHTML = ''; // Clear previous file list
    const files = this.files;
    // Check if any files were selected
    if (files.length === 0) {
        fileListElement.innerHTML = 'No files selected.';
    } else {
        const list = document.createElement('ul');
        fileListElement.appendChild(list);
        for (let i = 0; i < files.length; i++) {
            const li = document.createElement('li');
            li.textContent = files[i].name; // Display the file name
            list.appendChild(li);
        }
    }
});

document.getElementById('compare').addEventListener('click', function() {
    const files = document.getElementById('calendarFiles').files;
    const formData = new FormData();
    // Loop through the files selected by the user and append them to formData
    for (let i = 0; i < files.length; i++) {
        formData.append('calendars', files[i]);
    }

    fetch('/compare', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data.freeTimes);
        document.getElementById('submit-message').innerText = 'Comparison complete!';
    })
    .catch(error => {
        document.getElementById('submit-message').innerText = 'An error occurred.';
        console.error('Error:', error);
    });
});

document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const feedback = document.getElementById('feedback').value;
    fetch('/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `feedback=${encodeURIComponent(feedback)}`
    })
    .then(response => response.text())
    .then(data => {
        alert('Feedback submitted. Thank you!');
        document.getElementById('feedback').value = ''; // Clear the textarea after submission
    })
    .catch(error => {
        alert('Error submitting feedback: ' + error);
    });
});

function displayResults(freeTimes) {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = ''; // Clear previous results
    freeTimes.forEach(freeTime => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.textContent = `Free from ${freeTime.start} to ${freeTime.end}`;
        resultsElement.appendChild(div);
    });
    resultsElement.style.display = 'block';
}
