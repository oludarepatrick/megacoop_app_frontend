import axios from '@/lib/axiosInstance';
import { formConfig, jsonConfig } from '@/common/utils';



// api to get user details 
export const fetchUserDetails = async () => {
  const { data } = await axios.get('/user/loan/me');
  console.log(data);
  return data;
};


// API to verify guarantor /api/v1/user/loan/guarantor-lookup
export const verifyGuarantor = async (email: string) => {
  const { data } = await axios.post('/user/loan/guarantor-lookup', {
    email,
  }, formConfig);
  return data;
};

// Submit loan application 
export const submitLoanApplication = async (values: unknown) => {
  const { data } = await axios.post('/user/loan/apply', {
    values,
  }, jsonConfig);
  return data;
};

// Submit loan documents 
export const submitLoanDocuments = async (loanApplicationId: string, documents: File[]) => {
  const formData = new FormData();
  // formData.append('loan_application_id', loanApplicationId);
  
  // Map document positions to API field names
  const documentMapping = [
    { fieldName: 'bank_statement', index: 0 },
    { fieldName: 'nin', index: 1 },
    { fieldName: 'address_verification', index: 2 },
    { fieldName: 'guarantor_id', index: 3 }
  ];
  
  // Add each document with the correct field name
  documentMapping.forEach(({ fieldName, index }) => {
    const document = documents[index];
    if (document instanceof File) {
      formData.append(fieldName, document);
    } else {
      // If document is missing, send empty value as per API requirement
      formData.append(fieldName, '');
    }
  });

  // const { data } = await axios.post(`${API_BASE_URL}user/loan/documents`, formData, formConfig);
  const { data } = await axios.post(`/user/loan/${loanApplicationId}/upload-documents`, formData, formConfig);
  return data;
};

export async function fetchCreditLimit() {
  // replace this with real endpoint
  const { data } = await axios.get('/user/credit-limit');
  return data?.limit; // adapt to your shape
}

export async function fetchLoans() {
  // replace this with real endpoint
  // const { data } = await axiosInstance.get(`${API_BASE_URL}user/loan/dashboard`);
  // console.log(data);
  const { data } = await axios.get('/user/loans');
  return data?.loans;
}

// Fetch loan details by ID /api/v1/user/loan/{id}/details
export async function fetchLoanDetails(loanId: string) {
  const { data } = await axios.get(`/user/loan/${loanId}/details`);
  return data;
  // return data?.loan;
}