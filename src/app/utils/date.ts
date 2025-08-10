export const formatCustomDate = (dateInput: Date): string => {
  if (!(dateInput instanceof Date)) {
    dateInput = new Date(dateInput);
  }
  
  if (isNaN(dateInput.getTime())) {
    return 'Data inválida';
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateInput);

  const hours = dateInput.getHours();
  const minutes = dateInput.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'pm' : 'am';
  const hours12 = hours % 12 || 12;

  return `${formattedDate}, ${hours12}:${minutes}${period}`;
};