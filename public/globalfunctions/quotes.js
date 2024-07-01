function loadQuote() {
    fetch('/quotes/quotes.json')
        .then(response => response.json())
        .then(data => {
            const randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
            document.getElementById('qoute').innerText = randomQuote.qoute;
            document.getElementById('author').innerText = randomQuote.author;
            document.getElementById('timeperiod').innerText = randomQuote.timeperiod;
        });
}

export default loadQuote;