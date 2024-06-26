try {
      const ContactID = req.params.id;
      const contact = await Contact.findById(ContactID);
     
      if (!contact) {
          return res.status(404).json({ message: 'Contact not found.' });
      }
      await Contact.deleteOne({ _id: ContactID });
      res.status(200).json({ message: 'Contact deleted successfully.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while deleting the Contact.' });
  }