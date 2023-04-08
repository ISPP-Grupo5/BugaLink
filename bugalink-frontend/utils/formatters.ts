export const formatDatetime = (datetime: string) => {
  // 2023-04-03T19:20:00Z -> Martes 3 de Abril, 2023 a las 19:20
  const date = new Date(datetime);
  const dayLower = date.toLocaleDateString('es-ES', { weekday: 'long' });
  const day = dayLower.charAt(0).toUpperCase() + dayLower.slice(1); // Capitalized day
  const dayNumber = date.toLocaleDateString('es-ES', { day: 'numeric' });
  const month = date.toLocaleDateString('es-ES', { month: 'long' });
  const time = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${day} ${dayNumber} de ${month} a las ${time}`;
};

export const parseDate = (time: string) => {
  // 18:00:00 -> Date(18:00:00)
  const [hours, minutes, seconds] = time.split(':');
  const date = new Date();
  date.setHours(Number.parseInt(hours));
  date.setMinutes(Number.parseInt(minutes));
  date.setSeconds(Number.parseInt(seconds));
  return date;
};
