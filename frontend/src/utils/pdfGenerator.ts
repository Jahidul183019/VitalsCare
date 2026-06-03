import { jsPDF } from "jspdf";
import { AssessmentData } from "../types";

export function downloadPDFReport(
  lang: "EN" | "BN",
  profileName: string,
  activeEmail: string,
  data: AssessmentData,
  results: any,
  bookingInfo?: { clinicName: string; service: string; date: string; time: string; voucherCode: string }
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Page dimensions: 210 x 297 mm
  const pageWidth = 210;
  const pageHeight = 297;

  // Primary Clinical Colors
  const primaryColor = [16, 185, 129]; // Mint Teal #10b981
  const darkSlateColor = [30, 41, 59]; // Slate-900 #1e293b
  const lightBgColor = [248, 250, 252]; // Slate-50 #f8fafc
  const mutedTextColor = [100, 116, 139]; // Slate-500 #64748b

  // Helper top margin tracker
  let currentY = 15;

  // DRAW HEADER BANNER / BACKGROUND
  doc.setFillColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.rect(0, 0, pageWidth, 42, "F");

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("VITALCARE CLINICAL INTELLIGENCE LAB", 15, currentY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129); // Accent color
  doc.text("NCD Preventative Screening & Risk Trajectory Report", 15, currentY + 14);

  // Print Date
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - 15, currentY + 14, { align: "right" });

  currentY = 50;

  // PATIENT METADATA BLOCK & BRIEF INTRO
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.roundedRect(12, currentY, pageWidth - 24, 30, 3, 3, "F");
  
  // Outer frame stroke
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(12, currentY, pageWidth - 24, 30, 3, 3, "S");

  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PATIENT IDENTITY PROFILE", 16, currentY + 6);

  // Metadata Fields
  doc.setFont("helvetica", "bold");
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text("Patient Name:", 16, currentY + 13);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text(profileName || "Sarah", 43, currentY + 13);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text("Clinical Email:", 16, currentY + 20);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text(activeEmail || "Guest Profile (Transient Mode)", 43, currentY + 20);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text("Biological Gender:", 16, currentY + 25);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text(String(data.gender || "Female").toUpperCase(), 43, currentY + 25);

  // Right side of metadata panel
  doc.setFont("helvetica", "bold");
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text("Age Index:", 120, currentY + 13);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.age || 28} Years`, 150, currentY + 13);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text("Report Status:", 120, currentY + 20);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("VERIFIED COMPLETED", 150, currentY + 20);

  currentY += 38;

  // SECTION 2: BIOMETRIC SCREENING MEASUREMENTS
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("SCREENING BIOMARKERS TABLE", 12, currentY);

  // Subtitle line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(12, currentY + 2, 80, currentY + 2);

  currentY += 7;

  // Let's draw table headers
  doc.setFillColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.rect(12, currentY, pageWidth - 24, 7, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("HEALTH BIOMARKER / METRIC", 16, currentY + 5);
  doc.text("VALUE RECORD", 85, currentY + 5);
  doc.text("TARGET REFERENCE RANGE", 135, currentY + 5);

  currentY += 7;

  // Table rows
  const hM = (data.height || 175) / 100;
  const bmiVal = (data.weight || 70) / (hM * hM);

  const tableRows = [
    { label: "Arterial Blood Pressure (ABP)", val: `${data.systolic}/${data.diastolic} mmHg`, range: "120/80 mmHg (Normal)" },
    { label: "Body Mass Index (BMI)", val: `${bmiVal.toFixed(1)} kg/m2 (Wt: ${data.weight}kg, Ht: ${data.height}cm)`, range: "18.5 - 24.9 kg/m2" },
    { label: "Fasting Blood Sugar (FBS)", val: String(data.fastingBloodSugar || "normal").toUpperCase(), range: "< 100 mg/dL (Normal)" },
    { label: "Total Blood Cholesterol Level", val: String(data.cholesterol || "normal").toUpperCase(), range: "< 200 mg/dL (Desirable)" },
    { label: "Nightly Sleep Cycle Duration", val: String(data.sleepDuration || "optimal").toUpperCase(), range: "7 - 9 Hours nightly (Optimal)" },
    { label: "Exposure Limits: Alcohol", val: String(data.alcohol || "never").toUpperCase(), range: "None or Minimal (< 1 drink/d)" },
    { label: "Lifestyle: Smoking Cycle", val: data.smoking ? "ACTIVE SMOKER" : "NON-SMOKER", range: "Non-smoker (Ideal)" },
    { label: "Exposure Limits: Stress Index", val: String(data.stressLevel || "low").toUpperCase(), range: "Low/Medium Control" },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  tableRows.forEach((row, index) => {
    // Alternating background colors
    if (index % 2 === 0) {
      doc.setFillColor(242, 245, 248);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(12, currentY, pageWidth - 24, 7.5, "F");

    // Row borders
    doc.setDrawColor(241, 245, 249);
    doc.rect(12, currentY, pageWidth - 24, 7.5, "S");

    doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
    doc.text(row.label, 16, currentY + 5);
    
    // Highlight abnormal values in red/orange
    const isAbnormalVal = row.val.includes("HIGH") || row.val.includes("ACTIVE") || (row.label.includes("Blood Pressure") && (data.systolic >= 140 || data.diastolic >= 90));
    if (isAbnormalVal) {
      doc.setTextColor(220, 38, 38);
      doc.setFont("helvetica", "bold");
    } else {
      doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
      doc.setFont("helvetica", "normal");
    }
    doc.text(row.val, 85, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
    doc.text(row.range, 135, currentY + 5);

    currentY += 7.5;
  });

  currentY += 6;

  // SECTION 3: AUTOMATED AI RISK ESTIMATION
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("AI CHRONIC NCD RISK PROFILING (PROBABILITY RATE)", 12, currentY);

  // Subtitle line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(12, currentY + 2, 100, currentY + 2);

  currentY += 7;

  const htnRisk = results?.hypertensionRisk ?? 35;
  const dbRisk = results?.diabetesRisk ?? 32;
  const overallRisk = results?.overallRisk ?? 34;

  const risks = [
    { name: "Arterial Hypertension & Cardiovascular Disease Risk Rate", score: htnRisk, color: [239, 68, 68] },
    { name: "Type 2 Diabetes Mellitus & Insulin Insufficiency Metabolic Risk", score: dbRisk, color: [245, 158, 11] },
    { name: "Overall Cumulative Non-Communicable Disease Risk Evaluation", score: overallRisk, color: [16, 185, 129] }
  ];

  risks.forEach((risk) => {
    // Label
    doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`${risk.name}:  ${risk.score}%`, 13, currentY);

    // Bar background
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(12, currentY + 1.5, pageWidth - 24, 3, 1, 1, "F");

    // Bar filled
    const fillWidth = ((pageWidth - 24) * risk.score) / 100;
    doc.setFillColor(risk.color[0], risk.color[1], risk.color[2]);
    doc.roundedRect(12, currentY + 1.5, fillWidth, 3, 1, 1, "F");

    currentY += 8.5;
  });

  currentY += 5;

  // Page limit checking
  if (currentY > 195) {
    doc.addPage();
    currentY = 20;
    // Header watermark on new page
    doc.setFillColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
    doc.rect(0, 0, pageWidth, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("VITALCARE REPORT SECTION 2 - PREVENTIVE CLINICAL PROTOCOL", 15, 8);
    currentY = 22;
  }

  // SECTION 4: DIAGNOSTICS & CLINICAL FINDINGS (with automatic line wrapping)
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CLINICAL DIAGNOSTICS FINDINGS SUMMARY", 12, currentY);

  // Subtitle line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(12, currentY + 2, 90, currentY + 2);

  currentY += 7;

  const findingsList = results?.findings || ["Excellent overall metabolic and arterial biomarkers observed."];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);

  findingsList.forEach((finding: string) => {
    // Bullet marker
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.circle(15, currentY - 1, 1, "F");

    // Wrapped text
    const textLines = doc.splitTextToSize(finding, pageWidth - 30);
    doc.text(textLines, 19, currentY);
    currentY += (textLines.length * 4) + 2;
  });

  currentY += 4;

  // SECTION 5: RECOMMENDATIONS
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PRECISE MEDICAL RECOMMENDATIONS", 12, currentY);

  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(12, currentY + 2, 70, currentY + 2);

  currentY += 7;

  const recommendationList = results?.recommendations || ["Continue your positive hydration, custom diet, and workout habits!"];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  recommendationList.forEach((rec: string) => {
    // Plus mark design
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("+", 14, currentY);
    
    doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
    doc.setFont("helvetica", "normal");
    const textLines = doc.splitTextToSize(rec, pageWidth - 30);
    doc.text(textLines, 19, currentY);
    currentY += (textLines.length * 4) + 2;
  });

  currentY += 4;

  // SECTION 6: ACTIVE REFERRAL VOUCHER PANEL (IF CONFIRMED)
  if (bookingInfo && bookingInfo.voucherCode) {
    if (currentY > 210) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(236, 253, 245); // Emerald-50 background for coupon/slip effect
    doc.rect(12, currentY, pageWidth - 24, 40, "F");

    doc.setDrawColor(16, 185, 129); // Green boundary frame
    doc.setLineDashPattern([2, 2], 0); // Dashed lines
    doc.rect(12, currentY, pageWidth - 24, 40, "S");
    doc.setLineDashPattern([], 0); // Reset

    // Header Voucher
    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("OFFICIAL CLINICAL APPOINTMENT REFERRAL VOUCHER", 18, currentY + 10);

    doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Assigned Center:", 18, currentY + 17);
    doc.setFont("helvetica", "normal");
    doc.text(bookingInfo.clinicName, 50, currentY + 17);

    doc.setFont("helvetica", "bold");
    doc.text("Screening Board:", 18, currentY + 23);
    doc.setFont("helvetica", "normal");
    doc.text(bookingInfo.service === "CVD" ? "Cardiovascular Preventative Board" : "Type-2 Diabetes Screening panel", 50, currentY + 23);

    doc.setFont("helvetica", "bold");
    doc.text("Appt. Slot:", 18, currentY + 29);
    doc.setFont("helvetica", "normal");
    doc.text(`${bookingInfo.date}  |  ${bookingInfo.time}`, 50, currentY + 29);

    doc.setFont("helvetica", "bold");
    doc.text("Referral Serial Code:", 18, currentY + 35);
    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.text(bookingInfo.voucherCode, 50, currentY + 35);
  }

  // Footer seal / Signature line at absolute bottom of final page
  const footerY = pageHeight - 20;

  doc.setLineWidth(0.2);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, footerY, pageWidth - 15, footerY);

  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("Disclaimer: This chronic risk prognosis report is computer generated powered by the VitalCare Clinical Intelligence Engine.", 15, footerY + 5);
  doc.text("Any highly escalated systolic parameters should be clinically cross-examined via diagnostic mercury sphygmomanometer checks.", 15, footerY + 8);
  doc.text("Official Portal: VitalCare Bangladesh (https://ai.studio/build)", pageWidth - 15, footerY + 5, { align: "right" });

  const sanitizedFileName = `VitalCare_Risk_Profile_${profileName.trim().replace(/\s+/g, "_")}.pdf`;
  doc.save(sanitizedFileName);
}
