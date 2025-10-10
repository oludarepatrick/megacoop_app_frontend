import React, { useState, useRef, useCallback, useEffect} from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import type { StepProps } from '../../types/loanTypes';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchLoanDetails } from '@/services/loanService';

interface UploadedFile {
  id: string;
  file: File;
  type: 'bank-statement' | 'nin' | 'address-verification' | 'guarantor-id';
  previewUrl?: string;
}

const TYPES: UploadedFile['type'][] = [
  'bank-statement',
  'nin',
  'address-verification',
  'guarantor-id',
];

// export const Step3DocumentUpload = ({ methods }: StepProps) => {
export const Step3DocumentUpload: React.FC<StepProps> = ({ methods, alert, setAlert, loanApplicationId }) => {
  const [dragOver, setDragOver] = useState<string | null>(null);
  

  const fileInputRefs = {
    'bank-statement': useRef<HTMLInputElement>(null),
    'nin': useRef<HTMLInputElement>(null),
    'address-verification': useRef<HTMLInputElement>(null),
    'guarantor-id': useRef<HTMLInputElement>(null),
  };

    // Watch documents so component re-renders on upload changes
  const documentsWatch = methods.watch('documents');

  // Build uploaded files from the *fixed-slot* array in the form value
  const getUploadedFiles = useCallback((): UploadedFile[] => {
    const formDocuments = documentsWatch || [];
    if (!Array.isArray(formDocuments)) return [];

    return TYPES.map((type, idx) => {
      const file = formDocuments[idx] as File | undefined;
      if (!file) return null;
      return {
        id: `file-${idx}-${file.name}`,
        file,
        type,
        previewUrl: file.type?.startsWith?.('image/') ? URL.createObjectURL(file) : undefined,
      } as UploadedFile;
    }).filter(Boolean) as UploadedFile[];
  }, [documentsWatch]);

  const uploadedFiles = getUploadedFiles();

  // Helper to set a file into the fixed position for its type
  const setDocumentForType = useCallback((type: UploadedFile['type'], file?: File | null) => {
    const typeIndex = TYPES.indexOf(type);
    const currentFiles: (File | undefined)[] = methods.getValues('documents') || [];

    // create fixed-length array with current values preserved where possible
    const newFiles: (File | undefined)[] = Array(TYPES.length).fill(undefined);
    for (let i = 0; i < TYPES.length; i++) {
      if (currentFiles[i]) newFiles[i] = currentFiles[i];
    }

    // set or remove
    if (file) {
      newFiles[typeIndex] = file;
    } else {
      newFiles[typeIndex] = undefined;
    }

    // set the form value to a fixed-length array (undefined slots are allowed)
    methods.setValue('documents', newFiles);
  }, [methods]);

  const validateFile = (file: File) => {
    const validTypes = ['image/svg+xml', 'image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return { ok: false, title: 'Invalid File Type', description: 'Please upload SVG, JPG, PNG or PDF' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { ok: false, title: 'File Too Large', description: 'Each file must be less than 5MB' };
    }
    return { ok: true };
  };

  const handleFileSelect = useCallback((file: File, type: UploadedFile['type'], clearInput?: () => void) => {
    if (!file) return;

    // Validate *before* mutating form state
    const v = validateFile(file);
    if (!v.ok) {
      // setAlert({ title: v.title ?? 'Error', description: v.description ?? 'An error occurred.' });
      if (setAlert) setAlert({ title: v.title ?? 'Error', description: v.description ?? 'An error occurred.' });
      if (clearInput) clearInput();
      return;
    }

    // Valid -> set in its fixed slot
    setDocumentForType(type, file);
    if (setAlert) setAlert(null);
  }, [setDocumentForType, setAlert]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, type: UploadedFile['type']) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file, type);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(type);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
  }, []);

  const handleClickUpload = (type: UploadedFile['type']) => {
    fileInputRefs[type].current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: UploadedFile['type']) => {
    const file = e.target.files?.[0];
    const clear = () => { e.target.value = ''; };
    if (file) {
      handleFileSelect(file, type, clear);
    }
    // reset value to allow same-file reupload later
    e.target.value = '';
  };

  const getUploadedFileName = (type: UploadedFile['type']) => {
    const found = uploadedFiles.find(f => f.type === type);
    return found ? found.file.name : null;
  };

  const handleRemoveFile = (type: UploadedFile['type']) => {
    setDocumentForType(type, undefined);
  };

  // function to handle loan details on clicking "View Details"
  const fetchAndDisplayLoanDetails = useCallback(async () => {
    if (!loanApplicationId || !setAlert) return;
    try {
      const details = await fetchLoanDetails(loanApplicationId);
      // Display details in an alert or modal as needed
      setAlert({ title: 'Loan Details', description: JSON.stringify(details, null, 2) });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAlert({ title: 'Error', description: `Failed to fetch loan details: ${error.message}` });
      }
    }
  }, [loanApplicationId, setAlert]);
    
    // If uploaded files are fewer than required, set a form error (shown by FormMessage)
  useEffect(() => {
    const docs = Array.isArray(documentsWatch) ? documentsWatch : [];
    const filledCount = docs.filter(Boolean).length;
    if (filledCount < TYPES.length) {
      methods.setError('documents', {
        type: 'manual',
        message: `Please upload all ${TYPES.length} required documents.`,
      });
    } else {
      methods.clearErrors('documents');
    }
  }, [documentsWatch, methods]);

  // cleanup object urls when component unmounts or uploadedFiles changes
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, [uploadedFiles]);

  const uploadSections = [
    {
      type: 'bank-statement' as const,
      title: 'Upload Bank Statement',
      description: 'Click here to upload your file or drag. Supported: SVG, JPG, PNG, PDF (max 5MB)'
    },
    {
      type: 'nin' as const,
      title: 'Upload NIN',
      description: 'Click here to upload your file or drag. Supported: SVG, JPG, PNG, PDF (max 5MB)'
    },
    {
      type: 'address-verification' as const,
      title: 'Address Verification',
      description: 'Click here to upload your file or drag. Supported: SVG, JPG, PNG, PDF (max 5MB)'
    },
    {
      type: 'guarantor-id' as const,
      title: 'Upload Guarantor ID',
      description: 'Click here to upload your file or drag. Supported: SVG, JPG, PNG, PDF (max 5MB)'
    }
  ];

  return (
    <div className="space-y-6">
      {alert && (
        <Alert variant="destructive" className="mb-4 fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-auto">
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload ID and other documents to get your loan approved
        </p>
        <button 
          type="button"
          className="text-green-600 text-sm font-medium underline hover:text-green-700"
          onClick={fetchAndDisplayLoanDetails}
        >
          View Details
        </button>
      </div>

      <FormField
        control={methods.control}
        name="documents"
        render={() => (
          <FormItem>
            <FormControl>
              <div className="space-y-4">
                {uploadSections.map((section) => {
                  const uploadedFileName = getUploadedFileName(section.type);
                  const isDragOver = dragOver === section.type;

                  return (
                    <div key={section.type} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">{section.title}</h4>
                      
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          isDragOver
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                        } ${uploadedFileName ? 'bg-green-50 border-green-200' : ''}`}
                        onDrop={(e) => handleDrop(e, section.type)}
                        onDragOver={(e) => handleDragOver(e, section.type)}
                        onDragLeave={handleDragLeave}
                        onClick={() => handleClickUpload(section.type)}
                      >
                        {uploadedFileName ? (
                          <div className="flex items-center justify-center space-x-2 text-green-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">{uploadedFileName}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(section.type);
                              }}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg 
                              className="mx-auto h-8 w-8 text-gray-400 mb-2" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                              />
                            </svg>
                            <p className="text-sm text-gray-600">
                              {section.description}
                            </p>
                          </>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileInputRefs[section.type]}
                        onChange={(e) => handleFileInputChange(e, section.type)}
                        accept=".svg,.jpg,.jpeg,.png,.pdf,image/svg+xml,image/jpeg,image/png,application/pdf"
                        className="hidden"
                      />
                    </div>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-green-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-green-700">
          <strong>Note:</strong> Please ensure all uploaded documents are clear and legible. 
          Maximum file size is 5MB per document. Supported formats: SVG, JPG, PNG, PDF.
        </p>
      </div>
    </div>
  );
};
