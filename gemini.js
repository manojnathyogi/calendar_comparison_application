async function callApi(question) {
    const url = 'YOUR_API_ENDPOINT'; // Replace with your actual API endpoint
    const apiKey = 'AIzaSyCX_XMsrAS_VFldD3De2qYNz5-72_sxoF0'; // Replace with your actual API key

    try {
        const response = await fetch(url, {
            method: 'POST', // or 'GET', depending on the API
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Bearer ${apiKey} // Adjust as needed for the API
            },
            body: JSON.stringify({
                // Adjust these properties based on the API's expected request body
                question: question,
            })
        });

        if (!response.ok) {
            throw new Error(API call failed: ${response.status});
        }

        const data = await response.json();
        return data; // Process and return the data as needed
    }; 
    catch (error) {
        console.error('Error calling the API:', error);
        throw error; // Rethrow or handle error as needed
    }
}

// Example usage
document.getElementById('askBtn').addEventListener('click', async function() {
    const question = document.getElementById('questionInput').value.trim();
    if (question) {
        try {
            const apiResponse = await callApi(question);
            displayResults(API response: ${JSON.stringify(apiResponse)});
        } catch (error) {
            alert('Failed to get response from API.');
        }
    } else {
        alert('Please enter a question.');
    }
});

function displayResults(response) {
    const resultsElement = document.getElementById('results');
    resultsElement.innerText = response;
}