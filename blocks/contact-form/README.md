# Contact Form Block

A document-based block that renders a contact form and submits the data to an email endpoint.

## In your document (Google Doc / sheet)

Add a **table** with:

| Contact Form | |
| Form Endpoint | `https://formspree.io/f/YOUR_FORM_ID` |

- **First row:** Block name `Contact Form` (required).
- **Second row:** `Form Endpoint` = URL that receives the form POST and sends the data by email.

## Sending submissions to email

The block posts to the URL you set as **Form Endpoint**. To get submissions by email:

1. **Formspree (recommended):** Sign up at [formspree.io](https://formspree.io), create a form, and use the form’s endpoint (e.g. `https://formspree.io/f/xxxxx`) as **Form Endpoint**. Formspree will email you each submission.
2. **Adobe Forms Submission Service:** If your project uses EDS Forms, you can configure the form to use the Forms Submission Service and set the endpoint accordingly.

## Form fields

- **Name** (required)
- **Email** (required)
- **Contact number** (optional)
- **Inquiry, notes, or questions** (required, text area)
