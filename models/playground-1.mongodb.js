/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('slowyounet');

// Search for documents in the current collection.
db.getCollection('contacts')
  .updateOne(
    {
     FirstName: "Fredrik"
    },
    {
      /*
      * Projection
      * _id: 0, // exclude _id
      * fieldA: 1 // include field
      */
    }
  )
  .sort({
    /*
    * fieldA: 1 // ascending
    * fieldB: -1 // descending
    */
  });


  db.getCollection('contacts').updateOne(
    { email: "jane.doe@example.com" }, // Filter: match the document to update
    {
      $set: { age: 31 },                // Update: set the age to 31
      $currentDate: { lastModified: true } // Update: set the lastModified field to the current date
    }
  );