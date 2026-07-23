export interface InvoiceData {
  invoice_no: string;
  invoice_date: string;
  order_id: string;
  patient_id: string;
  payment_status: string;
  payment_method: string;
  gstin: string;
  patient_name: string;
  patient_age: string;
  patient_gender: string;
  patient_mobile: string;
  patient_email: string;
  patient_address: string;
  doctor_name: string;
  doctor_reg_no: string;
  consultation_date: string;
  consultation_amount: number;
  assessment_amount: number;
  treatment_amount: number;
  prescription_amount: number;
  medical_services_total: number;
  medicines_total: number;
  shipping: number;
  discount: number;
  tax: number;
  grand_total: number;
  doctor_notes: string;
}

export function generateInvoiceHtml(
  data: InvoiceData,
  logoUrl = "https://www.genestac.com/logo.jpeg",
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice ${data.invoice_no}</title>
<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #f2f2f2;
    margin: 0;
    padding: 20px;
    color: #222;
  }
  .invoice-box {
    max-width: 800px;
    margin: auto;
    background: #fff;
    padding: 30px;
    border: 1px solid #ddd;
  }
  .header {
    text-align: center;
    border-bottom: 3px solid #1aa6a1;
    padding-bottom: 15px;
    margin-bottom: 20px;
  }
  .header img.logo {
    height: 170px;
    margin-top: -25px;
  }
  .header h1 {
    margin: 0;
    color: #1aa6a1;
    letter-spacing: 2px;
  }
  .header p {
    margin: 2px 0;
    font-size: 12px;
    color: #555;
  }
  .header .tagline {
    font-size: 14px;
    font-weight: bold;
    margin-top: 5px;
    color: #333;
  }
  table.meta {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  table.meta td {
    padding: 6px 10px;
    font-size: 13px;
    border: 1px solid #e0e0e0;
  }
  table.meta td.label {
    font-weight: bold;
    background: #f7f7f7;
    width: 25%;
  }
  .section-title {
    background: #1aa6a1;
    color: #fff;
    padding: 6px 10px;
    font-size: 14px;
    margin-top: 25px;
    margin-bottom: 0;
  }
  table.info {
    width: 100%;
    border-collapse: collapse;
  }
  table.info td {
    padding: 6px 10px;
    font-size: 13px;
    border: 1px solid #e0e0e0;
  }
  table.info td.label {
    font-weight: bold;
    background: #f7f7f7;
    width: 30%;
  }
  table.services {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0;
  }
  table.services th, table.services td {
    border: 1px solid #e0e0e0;
    padding: 8px 10px;
    font-size: 13px;
    text-align: left;
  }
  table.services th {
    background: #f0f0f0;
  }
  table.summary {
    width: 50%;
    margin-left: 0;
    margin-right: auto;
    border-collapse: collapse;
    margin-top: 0;
  }
  table.summary td {
    padding: 6px 10px;
    font-size: 13px;
    border: 1px solid #e0e0e0;
  }
  table.summary tr.total td {
    font-weight: bold;
    background: #f7f7f7;
    font-size: 15px;
  }
  .notes {
    margin-top: 25px;
    font-size: 13px;
  }
  .signature {
    margin-top: 50px;
    font-size: 13px;
  }
  .footer {
    text-align: center;
    font-size: 11px;
    color: #888;
    margin-top: 30px;
    border-top: 1px solid #eee;
    padding-top: 10px;
  }
</style>
</head>
<body>
<div class="invoice-box">

  <div class="header">
    <img class="logo" src="${logoUrl}" alt="Genestac Logo">
    <div class="tagline">Doctor-Guided Medical Weight Loss Program</div>
    <p>106, A Block, Unitech Business Zone, Nirvana Country, Gurgaon – 122018, Gurugram, Haryana, India</p>
    <p>Phone: +91 9971114121 | Email: support@genestac.com | Website: www.genestac.com</p>
  </div>

  <h3 class="section-title">Invoice Details</h3>
  <table class="meta">
    <tr>
      <td class="label">Invoice No.</td><td>${data.invoice_no}</td>
      <td class="label">Invoice Date</td><td>${data.invoice_date}</td>
    </tr>
    <tr>
      <td class="label">Order ID</td><td>${data.order_id}</td>
      <td class="label">Patient ID</td><td>${data.patient_id}</td>
    </tr>
    <tr>
      <td class="label">Payment Status</td><td>${data.payment_status}</td>
      <td class="label">Payment Method</td><td>${data.payment_method}</td>
    </tr>
  </table>

  <h3 class="section-title">Healthcare Provider</h3>
  <table class="info">
    <tr><td class="label">Provider</td><td>GENESTAC THERAPEUTICS LLP</td></tr>
    <tr><td class="label">Website</td><td>www.genestac.com</td></tr>
    <tr><td class="label">Email</td><td>support@genestac.com</td></tr>
    <tr><td class="label">Phone</td><td>+91 9971114121</td></tr>
    <tr><td class="label">GSTIN</td><td>${data.gstin}</td></tr>
  </table>

  <h3 class="section-title">Patient Information</h3>
  <table class="info">
    <tr><td class="label">Patient Name</td><td>${data.patient_name}</td></tr>
    <tr><td class="label">Age / Gender</td><td>${data.patient_age} / ${data.patient_gender}</td></tr>
    <tr><td class="label">Mobile</td><td>${data.patient_mobile}</td></tr>
    <tr><td class="label">Email</td><td>${data.patient_email}</td></tr>
    <tr><td class="label">Address</td><td>${data.patient_address}</td></tr>
  </table>

  <h3 class="section-title">Consulting Physician</h3>
  <table class="info">
    <tr><td class="label">Doctor Name</td><td>${data.doctor_name}</td></tr>
    <tr><td class="label">Medical Registration No.</td><td>${data.doctor_reg_no}</td></tr>
    <tr><td class="label">Consultation Type</td><td>Online</td></tr>
    <tr><td class="label">Consultation Date</td><td>${data.consultation_date}</td></tr>
  </table>

  <h3 class="section-title">Medical Services</h3>
  <table class="services">
    <thead>
      <tr><th>Service</th><th>Qty</th><th>Amount</th></tr>
    </thead>
    <tbody>
      <tr><td>Online Medical Consultation</td><td>1</td><td>₹${data.consultation_amount}</td></tr>
      <tr><td>Medical Assessment</td><td>1</td><td>₹${data.assessment_amount}</td></tr>
      <tr><td>Treatment Plan</td><td>1</td><td>₹${data.treatment_amount}</td></tr>
      <tr><td>Prescription Review</td><td>1</td><td>₹${data.prescription_amount}</td></tr>
    </tbody>
  </table>

  <h3 class="section-title">Bill Summary</h3>
  <table class="summary">
    <tr><td>Medical Services</td><td>₹${data.medical_services_total}</td></tr>
    <tr><td>Medicines</td><td>₹${data.medicines_total}</td></tr>
    <tr><td>Shipping</td><td>₹${data.shipping}</td></tr>
    <tr><td>Discount</td><td>- ₹${data.discount}</td></tr>
    <tr><td>Tax</td><td>₹${data.tax}</td></tr>
    <tr class="total"><td>Grand Total</td><td>₹${data.grand_total}</td></tr>
  </table>

  <div class="notes">
    <strong>Doctor's Notes:</strong>
    <p>${data.doctor_notes}</p>
  </div>

  <div class="signature">
    Doctor Signature: __________________________
  </div>

  <div class="footer">
    This is a system-generated invoice from Genestac Therapeutics LLP. For queries, contact support@genestac.com
  </div>

</div>
</body>
</html>`;
}
