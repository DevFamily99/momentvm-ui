export const getTranslationId = value => {
  if (typeof value === 'string') {
    if (value && value.match(/loc::([0-9]+)/)) {
      return value.match(/loc::([0-9]+)/)[1];
    }
  }
  return null;
};

export const stripHTML = html => {
  const temporalDivElement = document.createElement('div');
  temporalDivElement.innerHTML = html;
  return temporalDivElement.textContent || temporalDivElement.innerText || '';
};
