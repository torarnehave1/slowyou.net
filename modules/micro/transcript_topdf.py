import argparse
from functools import reduce
import xhtml2pdf.pisa as pisa
import json

def wrap(text, width):
    return reduce(lambda line, word, width=width: '%s%s%s' %
                  (line,
                   ' \n'[(len(line)-line.rfind('\n')-1
                         + len(word.split('\n',1)[0]
                              ) >= width)],
                   word),
                  text.split(' ')
                 )

def printPdf(text, filename):
    """ Generate PDF from text and save to a file. """
    text = wrap(text, 100)
    print("Writing to PDF file: " + filename)
    with open(filename, "wb") as f:
        pdf = pisa.CreatePDF(text, f)
    print("Writing to PDF file DONE!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Write text content to a PDF file.')
    parser.add_argument('text', help='Text to write into the PDF')
    parser.add_argument('-o', '--output', help='Output PDF file name', default='output.pdf')
    args = parser.parse_args()

    # Print the raw text argument
    print("Raw text argument: " + args.text)

    # Parse the JSON string back into a Python object
    transcript = json.loads(args.text)

    # Print the parsed Python object
    print("Parsed Python object: ", transcript)

    # Extract the text from the Python object
    text = transcript['text']

    # Print the extracted text
    print("Extracted text: " + text)

    # Call the function to create PDF
    printPdf(text, args.output)