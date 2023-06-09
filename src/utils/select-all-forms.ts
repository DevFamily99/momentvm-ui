const selectAll = () => {
  const triggeredClasses = [
    'pages-add_publishing_locale',
    'pages-publish',
    'pages-edit',
    'users-edit',
    'workflow-send_translations_start',
    'workflow-validate_pages_start',
    'users-new',
    'pages',
  ];
  if (triggeredClasses.some(allowedClass => document.body.classList.contains(allowedClass))) {
    const localeCheckboxes = document.querySelectorAll('form input[type=checkbox]') as NodeListOf<HTMLInputElement>;
    const selectAllButton = document.querySelectorAll('input[type=checkbox][name=select-all-locales]') as NodeListOf<
      HTMLInputElement
    >;

    selectAllButton.forEach(item => {
      let allLocaleCheckboxesChecked = true;
      localeCheckboxes.forEach(localeItem => {
        if (!localeItem.checked && localeItem.name !== 'select-all-locales') {
          allLocaleCheckboxesChecked = false;
        }
      });

      if (allLocaleCheckboxesChecked) {
        item.click();
      }

      item.addEventListener('click', () => {
        if (item.checked) {
          localeCheckboxes.forEach(localeItem => {
            if (!localeItem.checked) {
              localeItem.click();
            }
          });
        }
        if (!item.checked) {
          localeCheckboxes.forEach(localeItem => {
            if (localeItem.checked) {
              localeItem.click();
            }
          });
        }
      });
    });
  }
};
export default selectAll;
