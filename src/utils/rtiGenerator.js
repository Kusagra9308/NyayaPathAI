import jsPDF from 'jspdf';

export const OFFICIAL_MINISTRIES = [
  "Department of Agriculture, Cooperation & Farmers Welfare",
  "Department of Consumer Affairs",
  "Department of Food & Public Distribution",
  "Department of Higher Education",
  "Department of Posts",
  "Department of School Education and Literacy",
  "Department of Telecommunications",
  "Ministry of AYUSH",
  "Ministry of Civil Aviation",
  "Ministry of Electronics & Information Technology",
  "Ministry of Environment, Forest and Climate Change",
  "Ministry of External Affairs",
  "Ministry of Home Affairs",
  "Ministry of Housing & Urban Affairs",
  "Ministry of Information & Broadcasting",
  "Ministry of Labour & Employment",
  "Ministry of Micro, Small and Medium Enterprises",
  "Ministry of Railways",
  "Ministry of Road Transport & Highways",
  "Ministry of Rural Development",
  "Ministry of Social Justice & Empowerment",
  "Prime Minister's Office"
];

// Automatically detects the appropriate Ministry based on plain-language query keywords
export function detectMinistryForQuery(queryText) {
  const q = (queryText || '').toLowerCase();
  if (q.includes('ration') || q.includes('food') || q.includes('pds') || q.includes('grain') || q.includes('fps')) {
    return "Department of Food & Public Distribution";
  }
  if (q.includes('road') || q.includes('pothole') || q.includes('bridge') || q.includes('highway') || q.includes('contractor')) {
    return "Ministry of Road Transport & Highways";
  }
  if (q.includes('water') || q.includes('drainage') || q.includes('housing') || q.includes('flat') || q.includes('building')) {
    return "Ministry of Housing & Urban Affairs";
  }
  if (q.includes('pension') || q.includes('epf') || q.includes('provident') || q.includes('labour') || q.includes('salary')) {
    return "Ministry of Labour & Employment";
  }
  if (q.includes('school') || q.includes('teacher') || q.includes('education') || q.includes('student') || q.includes('college')) {
    return "Department of School Education and Literacy";
  }
  if (q.includes('sim') || q.includes('telecom') || q.includes('broadband') || q.includes('tower')) {
    return "Department of Telecommunications";
  }
  return "Ministry of Housing & Urban Affairs";
}

// Sanitizes text while preserving clean section line breaks (\n)
export function sanitizeRtiText(text) {
  if (!text) return '';
  return text
    .replace(/["'”“’]/g, '')
    .replace(/[#$^*+=~`|<>{}[\]]/g, ' ')
    .replace(/[ \t]+/g, ' ') // Collapse extra horizontal spaces, PRESERVE \n
    .replace(/\n\s*\n/g, '\n\n') // Clean double newlines
    .trim();
}

export function generateRtiDraft(params) {
  const query = (params.queryText || '').toLowerCase();
  
  let selectedMinistry = params.selectedMinistry || detectMinistryForQuery(params.queryText);
  let department = selectedMinistry;
  let questions = [];

  if (query.includes('road') || query.includes('pothole') || query.includes('bridge') || query.includes('construction') || query.includes('contractor')) {
    questions = [
      `Sanction order, budget copy, and tender document for the road work in ${params.city || 'locality'}.`,
      `Name of contractor, project manager, and supervising engineer assigned to this work.`,
      `Scheduled start date, completion date, and current physical and financial progress.`,
      `If delayed, copies of file notings, extension requests, and penalty notices issued.`
    ];
  } else if (query.includes('ration') || query.includes('food') || query.includes('pds') || query.includes('grain')) {
    questions = [
      `Daily stock register and distribution register entries for FPS catering to my area for last 6 months.`,
      `Current processing status of my Ration Card application/renewal ref: ${params.specificDetails || 'as attached'}.`,
      `Daily progress report and reason for delay if processing exceeds Citizen Charter timeline.`
    ];
  } else if (query.includes('water') || query.includes('drainage') || query.includes('sewage') || query.includes('jal')) {
    questions = [
      `Certified copies of water quality test reports conducted in ${params.city || 'area'} over last 3 months.`,
      `Total expenditure incurred on maintenance and pipeline repairs in this locality during current financial year.`,
      `Official daily schedule of water supply for this area and recorded reasons for unannounced cuts.`
    ];
  } else if (query.includes('police') || query.includes('fir') || query.includes('complaint') || query.includes('investigation')) {
    questions = [
      `Daily progress report and file notings regarding Complaint/FIR No: ${params.specificDetails || 'submitted by me'}.`,
      `Name and designation of Investigating Officer (IO) assigned to this matter.`,
      `If no action taken within 30 days, certified copies of reasons recorded in official diary.`
    ];
  } else if (query.includes('pension') || query.includes('epfo') || query.includes('provident') || query.includes('welfare')) {
    questions = [
      `Exact status of my pension/EPF disbursement application Ref: ${params.specificDetails || 'N/A'}.`,
      `Date of receipt of application, date of verification, and official file movement history.`,
      `If payment delayed, name of dealing assistant responsible for the delay.`
    ];
  } else {
    questions = [
      `Certified copies of all files, correspondence, and notings regarding: ${params.queryText}.`,
      `Exact timeline mandated by Citizen Charter for resolving this class of public grievance/request.`,
      `List of names and designations of officers who handled this file along with movement dates.`
    ];
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Clean formatted structure with proper section newlines
  const portalTextUnsanitized = `APPLICATION UNDER SECTION 6(1) OF RTI ACT 2005

TO:
Public Information Officer (PIO)
MINISTRY/DEPT: ${department}
LOCATION: ${params.city || 'District'}, ${params.state || 'State'}
DATE: ${currentDate}

APPLICANT DETAILS:
Name: ${params.applicantName || 'Citizen Applicant'}
Mobile: ${params.phone || 'N/A'}
Address: ${params.address || 'Address provided'}

SUBJECT:
Request for information under RTI Act 2005 regarding:
"${params.queryText}"

SPECIFIC INFORMATION SOUGHT:
${questions.map((q, idx) => `4.${idx + 1}. ${q}`).join('\n')}

FEE DETAILS:
${params.bplStatus ? `BPL Applicant (Exempt from RTI Fee). Card No: ${params.bplCardNo || 'Attached'}.` : 'Attached prescribed fee of Rs 10.'}

DECLARATION:
I am an Indian citizen. Information requested does not fall under Section 8 or 9 exemptions.
`;

  let portalText = sanitizeRtiText(portalTextUnsanitized);
  if (portalText.length > 2950) {
    portalText = portalText.substring(0, 2950) + '...';
  }

  return {
    department,
    questions,
    portalText,
    charCount: portalText.length,
    currentDate
  };
}

export function downloadRtiPdf(draft, params) {
  const doc = new jsPDF();
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('APPLICATION UNDER RIGHT TO INFORMATION ACT 2005', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const lines = doc.splitTextToSize(draft.portalText, 180);
  doc.text(lines, 15, 32);
  
  const safeFileName = `RTI_${Date.now().toString().slice(-6)}.pdf`;
  doc.save(safeFileName);
}
