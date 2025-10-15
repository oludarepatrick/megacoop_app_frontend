
export const jsonConfig = {
    headers: {
      // Authorization: Bearer ${getToken()},
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": "dU3Xj0eMK9fGcWmmswUyiFbV45R6PKr1rTJZzp8Q",
  },
};

export const formConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
    "X-CSRF-TOKEN": "dU3Xj0eMK9fGcWmmswUyiFbV45R6PKr1rTJZzp8Q",
  },
};

export const formatCurrency = (n?: number) =>
  n == null ? "₦0.00" : `₦${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString();
};