const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
  const timestamp = Date.now();
  const imageFilePath = path.join(__dirname, '../images/imageswithquotes/', `image_${timestamp}.png`);
  const textFilePath = path.join(__dirname, '../images/imageswithquotes/', `image_${timestamp}.md`);

  // Save the image file
  fs.writeFile(imageFilePath, base64Data, 'base64', (err) => {
      if (err) {
          console.error('Error saving image:', err);
          return res.status(500).send('Failed to save image');
      }

      // Save the text file
      fs.writeFile(textFilePath, textContent, (err) => {
          if (err) {
              console.error('Error saving text:', err);
              return res.status(500).send('Failed to save text');
          }

          res.status(200).send({ message: 'Image and text saved successfully', imageFilePath, textFilePath });
      });
  });