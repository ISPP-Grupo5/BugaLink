export const formatDatetime = (datetime: string) => {
  // 2023-04-03T19:20:00Z -> Martes 3 de Abril, 2023 a las 19:20
  const date = new Date(datetime);
  date.setHours(date.getHours() - 2);
  const dayLower = date.toLocaleDateString('es-ES', { weekday: 'long' });
  const day = capitalize(dayLower); // Capitalized day
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

export const shortenDate = (date: string) => {
  // 2023-04-03T19:20:00Z -> 3 abr
  const dateObj = new Date(date);
  const dayNumber = dateObj.toLocaleDateString('es-ES', { day: 'numeric' });
  const month = dateObj.toLocaleDateString('es-ES', { month: 'short' });
  return `${dayNumber} ${month}`;
};

export const shortenName = (firstName: string, lastName: string) => {
  if (!firstName || !lastName) return '';
  // Pablo López Benítez' -> 'Pablo López'
  // Pablo Delfín López Benítez' -> 'Pablo D. López'
  // If the first name has two words, the second word is replaced by the first letter of the last name
  const prepositions = ['de', 'del', 'la', 'las', 'los'];
  const [firstLastNameWord, ...restLastNameWords] = lastName.split(' ');
  const shortenedLastName = prepositions.includes(
    firstLastNameWord.toLowerCase()
  )
    ? [firstLastNameWord, ...restLastNameWords].join(' ')
    : firstLastNameWord;

  const shortenedFirstName =
    firstName.split(' ').length > 1
      ? `${firstName.split(' ')[0]} ${firstName.split(' ')[1].charAt(0)}.`
      : firstName;

  return `${shortenedFirstName} ${shortenedLastName}`;
};

export const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
