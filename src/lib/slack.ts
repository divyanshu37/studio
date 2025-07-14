import { capitalize, formatPhone, getFullStreet } from "./schema";
import { formatDateInput } from "./utils";

export const getSlackMessage = (step: string, formData: Record<string, any>): string => {
    const lines: string[] = [];
    
    lines.push(step);

    const push = (label: string, value: any) => {
      if (value) lines.push(`• *${label}:* ${value}`);
    };
  
    lines.push(`*🆔 Reference ID:* ${formData.referenceId || 'N/A'}`);
    lines.push('');
    lines.push(`*📄 New Application Submitted*`);
    lines.push('');
  
    // Applicant Details
    const applicantDetails: string[] = [];
    const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ');
    if (fullName) applicantDetails.push(`• *Name:* ${fullName}`);
    push('Email', formData.email);
    push('Phone', formatPhone(formData.phone));
    push('Date of Birth', formatDateInput(formData.dob));
    push('Gender', capitalize(formData.gender));
    const address = formData.addressStreet || formData.addressApt || formData.addressCity || formData.addressState || formData.addressZip
      ? `${getFullStreet(formData.addressStreet, formData.addressApt)}, ${formData.addressCity}, ${formData.addressState} ${formData.addressZip}`
      : null;
    push('Address', address);
    push('Last 4 SSN', formData.lastFour);
  
    if (applicantDetails.length || address) {
      lines.push(`*👤 Applicant Details:*`);
      lines.push(...applicantDetails);
      if (address) lines.push(`• *Address:* ${address}`);
      lines.push('');
    }
  
    // Beneficiary Details
    const beneficiaryDetails: string[] = [];
    const beneficiaryName = [formData.beneficiaryFirstName, formData.beneficiaryLastName].filter(Boolean).join(' ');
    if (beneficiaryName) beneficiaryDetails.push(`• *Name:* ${beneficiaryName}`);
    if (formData.beneficiaryDob) beneficiaryDetails.push(`• *DOB:* ${formatDateInput(formData.beneficiaryDob)}`);
    if (formData.beneficiaryPhone) beneficiaryDetails.push(`• *Phone:* ${formatPhone(formData.beneficiaryPhone)}`);
    push('Relationship', formData.beneficiaryRelation);
    if (beneficiaryDetails.length) {
      beneficiaryDetails.push(`• *Share:* 100%`);
      lines.push(`*👪 Beneficiary Details:*`);
      lines.push(...beneficiaryDetails);
      lines.push('');
    }
  
    // Policy Details
    const policyDetails: string[] = [];
    if (formData.faceAmount) policyDetails.push(`• *Face Amount:* $${formData.faceAmount.replace(/[^0-9]/g, '')}`);
    if (policyDetails.length) {
      lines.push(`*💰 Policy Details:*`);
      lines.push(...policyDetails);
      lines.push('');
    }
  
    // Payment Info
    if (formData.paymentAccountHolderName) {
      lines.push(`*🏦 Payment Info:*`);
      lines.push(`• *Account Holder:* ${formData.paymentAccountHolderName}`);
      lines.push('');
    }
  
    return lines.join('\n');
  }
  