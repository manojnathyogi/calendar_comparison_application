document.getElementById('compare').addEventListener('click', function() {
    const files = document.getElementById('calendarFiles').files;
    const startDate = document.getElementById('startDate').value;
    const startTime = document.getElementById('startTime').value;
    const endDate = document.getElementById('endDate').value;
    const endTime = document.getElementById('endTime').value;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append('calendars', files[i]);
    }

    formData.append('startDateTime', `${startDate}T${startTime}:00`);
    formData.append('endDateTime', `${endDate}T${endTime}:00`);

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
document.getElementById('calendarFiles').addEventListener('change', function() {
    const fileListElement = document.getElementById('file-list');
    fileListElement.innerHTML = ''; // Clear previous file list
    const files = this.files;
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

