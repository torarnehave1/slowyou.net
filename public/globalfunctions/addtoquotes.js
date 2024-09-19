function AddQuote(quote, author, timeperiod) {
    const newQuote = {
        Quote: quote,
        Author: author,
        TimePeriod: timeperiod
    };

    console.log('Adding quote:', newQuote);
    fetch('/quotes/quotes.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Quote added successfully:', data);
        })
        .catch(error => {
            console.error('Error adding quote:', error);
        });
}

export default AddQuote;