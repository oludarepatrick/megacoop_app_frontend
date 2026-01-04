import axios from '@/lib/axiosInstance';
import { formConfig, jsonConfig } from '@/common/utils';
import type { CreditLimit } from '@/types/loanTypes';




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
  const { data } = await axios.post('/user/loan/apply', values, jsonConfig);
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

export const fetchCreditLimit = async (): Promise<CreditLimit> => {
  const  response  = await axios.get('/user/loan/credit-limit');
  console.log(response.data.data.credit_info);
  return response.data.data.credit_info; 
  // Mocked data for now
  // const creditInfoData: CreditLimit = {

  // return creditInfoData = {
  //   credit_limit: 100000,
  //   remaining_limit: 80000,
  // total_borrowed: 20000,
  // total_savings: 15000,
  // utilization_percentage: 20,

  // };
  
  //   credit_limit: 150000,
  //   remaining_limit: 120000,
  //   total_borrowed: 30000,
  //   total_savings: 25000,
  //   utilization_percentage: 20,
  // };
  // return creditInfoData;
}

export async function fetchLoans() {
  // replace this with real endpoint
  // const { data } = await axiosInstance.get(`${API_BASE_URL}user/loan/dashboard`);
  // console.log(data);
  const { data } = await axios.get('/user/loan/all');
  console.log("data here", data);
  return data?.data;
}

// Fetch loan details by ID /api/v1/user/loan/{id}/details
export async function fetchLoanDetails(loanId: string) {
  const { data } = await axios.get(`/user/loan/${loanId}/details`);
  return data;
  // return data?.loan;
}