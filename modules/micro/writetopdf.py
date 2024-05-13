import argparse
import xhtml2pdf.pisa as pisa
from functools import reduce

#python writetopdf.py "Here is some sample text to put in a PDF." -o mypdf.pdf
#This will create a PDF named mypdf.pdf with the specified text.
# If the -o option is omitted, it defaults to output.pdf. 
#This script assumes that the text is not excessively complex in formatting, 
#as xhtml2pdf has certain limitations with advanced HTML/CSS.

def wrap(text, width):
    """ Wrap text for better formatting in PDF. """
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

    # Call the function to create PDF
    printPdf(args.text, args.output)
