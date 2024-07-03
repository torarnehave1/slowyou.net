function loadQuote() {
    fetch('/quotes/quotes.js')
        .then(response => response.json())
        .then(data => {
            const randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
            document.getElementById('qoute').innerText = randomQuote.qoute;
            document.getElementById('author').innerText = randomQuote.author;
            document.getElementById('timeperiod').innerText = randomQuote.timeperiod;
            document.getElementById('quote').innerText = randomQuote.Quote;
            document.getElementById('author').innerText = randomQuote.Author;
            document.getElementById('timeperiod').innerText = randomQuote.TimePeriod;
        });
}

export default loadQuote;