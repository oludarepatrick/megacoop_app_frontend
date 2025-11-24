
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

export const getDisplayDate = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }); // e.g. "Wed, 12 Jul 2024"

  // remove the comma to match your desired format
  const displayDate = formattedDate.replace(",", "");
  return displayDate;
};


export function formatDateTime(dateInput: string | Date): string {
  const date = new Date(dateInput);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });

  const time = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  return `${day} ${month} , ${time}`;
}
