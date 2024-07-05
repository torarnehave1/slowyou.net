fs.readFile(path.join(__dirname, 'public', 'quotes', 'quotes.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to read quotes file');
    } else {
      // Parse the existing quotes
      const quotes = JSON.parse(data);

      // Add the new quote to the quotes array
      quotes.quotes.push({ Quote: quote, Author: author, TimePeriod: timeperiode });

      // Write the updated quotes back to the file
      fs.writeFile(path.join(__dirname, 'public', 'quotes', 'quotes.json'), JSON.stringify(quotes, null, 2), 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Failed to write quotes file');
        } else {
          res.send('Quote added successfully');
        }
      });
    }
  });