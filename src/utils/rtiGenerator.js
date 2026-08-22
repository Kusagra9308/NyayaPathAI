import jsPDF from 'jspdf';

export function generateRtiDraft(params) {
  const query = (params.queryText || '').toLowerCase();
  
  let department = 'Public Works Department (PWD)';
  let pioTitle = 'Public Information Officer (PIO)';
  let questions = [];

  if (query.includes('road') || query.includes('pothole') || query.includes('bridge') || query.includes('construction') || query.includes('contractor')) {
    department = 'Public Works Department (PWD) / Municipal Corporation';
    questions = [
      `Please provide the copy of the sanction order, sanctioned budget, and tender document for the road work in ${params.city} mentioned above.`,
      `Please provide the names of the contractor, project manager, and supervising engineer assigned to this work.`,
      `What is the scheduled start date, completion date, and current physical & financial progress of the project?`,
      `If the project is delayed, please provide copies of all file notings, extension requests, and penalty notices issued to the contractor.`
    ];
  } else if (query.includes('ration') || query.includes('food') || query.includes('pds') || query.includes('grain')) {
    department = 'Department of Food & Civil Supplies / Consumer Affairs';
    questions = [
      `Please provide the daily stock register and distribution register entries for the FPS (Fair Price Shop) catering to my area for the past 6 months.`,
      `What is the current status of processing my Ration Card application/renewal (Application ref: ${params.specificDetails || 'as attached'})?`,
      `Please provide the daily progress report and reason for delay if the processing time exceeds the Citizen Charter timeline.`
    ];
  } else if (query.includes('water') || query.includes('drainage') || query.includes('sewage') || query.includes('jal')) {
    department = 'Jal Board / Municipal Water Supply & Sanitation Department';
    questions = [
      `Please provide certified copies of water quality test reports conducted in ${params.city} area over the last 3 months.`,
      `What is the total expenditure incurred on maintenance and pipeline repairs in this locality during the current financial year?`,
      `Please state the official daily schedule of water supply for this area and reasons for unannounced water cuts.`
    ];
  } else if (query.includes('police') || query.includes('fir') || query.includes('complaint') || query.includes('investigation')) {
    department = 'Office of the District Superintendent of Police / Commissionerate';
    questions = [
      `Please state the daily progress report and file notings regarding Complaint/FIR No: ${params.specificDetails || 'submitted by me'}.`,
      `Please provide the name and designation of the Investigating Officer (IO) assigned to this matter.`,
      `If no action has been taken within 30 days, please provide certified copies of reasons recorded in the official diary.`
    ];
  } else if (query.includes('pension') || query.includes('epfo') || query.includes('provident') || query.includes('welfare')) {
    department = 'Department of Social Welfare / Employees Provident Fund Organisation';
    questions = [
      `Please provide the exact status of my pension/EPF disbursement application (Ref: ${params.specificDetails || 'N/A'}).`,
      `Please state the date of receipt of the application, date of verification, and official file movement history.`,
      `If payment is delayed, please state the name of the dealing assistant responsible for the delay.`
    ];
  } else {
    department = 'Office of the District Collector / Competent Public Authority';
    questions = [
      `Please provide certified copies of all files, correspondence, and notings related to the subject matter: "${params.queryText}".`,
      `Please provide the exact timeline mandated by the Citizen Charter for resolving this class of public grievance/request.`,
      `Please list the names and designations of officers who handled this file along with dates of file movement.`
    ];
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const fullText = `FORMATTED APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

To,
The Public Information Officer (PIO),
${department},
Government of ${params.state || 'India'},
District: ${params.city || 'State Capital'}

Date: ${currentDate}

1. FULL NAME OF THE APPLICANT:
   ${params.applicantName || 'Citizen Applicant'}

2. ADDRESS FOR CORRESPONDENCE:
   ${params.address || 'Address provided'}, ${params.city}, ${params.state}
   Mobile: ${params.phone || 'N/A'} | Email: ${params.email || 'N/A'}

3. SUBJECT MATTER OF INFORMATION:
   Request for information under Section 6(1) of the RTI Act 2005 regarding:
   "${params.queryText}"

4. SPECIFIC INFORMATION SOUGHT:
${questions.map((q, idx) => `   4.${idx + 1}. ${q}`).join('\n\n')}

5. PERIOD TO WHICH INFORMATION RELATES:
   Last 2 Years to Current Date.

6. APPLICATION FEE DETAILS:
   ${params.bplStatus ? `Exempted from RTI Fee under BPL category (BPL Card No: ${params.bplCardNo || 'Enclosed'}).` : 'I have attached the mandatory application fee of ₹10/- (Rupees Ten Only) via Postal Order / Online Receipt.'}

7. PREFERRED MODE OF INFORMATION:
   By Registered Post / Certified Copies at my residential address listed above.

8. DECLARATION:
   I am a citizen of India. The information sought does not fall under any of the exemptions contained in Section 8 & 9 of the RTI Act 2005.

Yours faithfully,


(${params.applicantName || 'Citizen Applicant'})
`;

  return {
    department,
    pioTitle,
    questions,
    fullText,
    currentDate
  };
}

export function downloadRtiPdf(draft, params) {
  const doc = new jsPDF();
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const lines = doc.splitTextToSize(draft.fullText, 180);
  doc.text(lines, 15, 32);
  
  doc.save(`RTI_Application_${params.city || 'Citizen'}_${Date.now()}.pdf`);
}
