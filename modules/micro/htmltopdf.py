import sys
import xhtml2pdf.pisa as pisa

def printPdf(text, filename):
    """ Generate PDF from text and save to a file. """
    with open(filename, "wb") as f:
        pdf = pisa.CreatePDF(text, f)
    print("Writing to PDF file DONE!")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python htmltopdf.py <output_filename>")
        sys.exit(1)

    output_filename = sys.argv[1]

    # Read HTML content from stdin
    html_content = sys.stdin.read()

    # Call the function to create PDF
    printPdf(html_content, output_filename)
