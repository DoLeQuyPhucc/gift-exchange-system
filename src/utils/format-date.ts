export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Format time HH:mm
  const time = new Intl.DateTimeFormat('vi', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

  // Format date DD/MM/YYYY
  const datePart = new Intl.DateTimeFormat('vi', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  // Combine time and date in desired format
  return `${datePart} ${time}`;
};

export const formatDate_HHmm_DD_MM_YYYY = (dateString: string): string => {
  const date = new Date(dateString);

  // Format time HH:mm
  const time = new Intl.DateTimeFormat('vi', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  // Format date DD/MM/YYYY
  const datePart = new Intl.DateTimeFormat('vi', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  // Combine time and date in desired format
  return `${datePart} ${time}`;
};

export const formatDateOnlyDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const formatDate_DD_MM_YYYY = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};

export const formatDate_M_D_YYYY = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1); // Months are zero-based
  const day = String(date.getDate());
  return `${month}/${day}/${year}`;
};
