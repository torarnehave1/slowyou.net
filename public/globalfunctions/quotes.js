// Global variables to store the quotes and authors
let quotes = [];
let authors = [];

// Function to load quotes from the JSON file
export function loadQuote() {
    fetch('/quotes/quotes.json')  // Adjust this path to match your actual file path
        .then(response => response.json())
        .then(data => {
            quotes = data.quotes;  // Store the quotes globally

            // Extract unique authors
            authors = [...new Set(quotes.map(quote => quote.Author))];

            // Display a random quote
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('quote').innerText = randomQuote.Quote;
            document.getElementById('author').innerText = `- ${randomQuote.Author}`;
            document.getElementById('timeperiod').innerText = randomQuote.TimePeriod ? `(${randomQuote.TimePeriod})` : '';
        })
        .catch(error => console.error('Error fetching quotes:', error));
}

// Export the lists of quotes and authors
export { quotes, authors };
