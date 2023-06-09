const buildFieldInitialData = (field, key, defaultValue) => {
  const array = [];
  const object = {};
  // console.log(defaultValue);
  if (field.oneOf) {
    //  this works very similar to the way object case works
    // console.log('ONEOF', field.oneOf[0].properties);
    const oneOf = {};
    if (field.oneOf[0].properties) {
      Object.keys(field.oneOf[0].properties).forEach(propertyField => {
        oneOf[propertyField] = buildFieldInitialData(
          field.oneOf[0].properties[propertyField],
          propertyField,
        );
      });
    }
    return oneOf;
  }
  switch (field.type) {
    case 'array':
      // sometimes these arrays fields have default values for their text fields
      if (field.default) {
        for (let i = 0; i < field.default.length; i += 1) {
          array.push(buildFieldInitialData(field.items, null, field.default[i]));
        }
      }
      if (field.minItems) {
        for (let j = 0; j < field.minItems; j += 1) {
          array.push(buildFieldInitialData(field.items));
        }
      }
      return array;

    case 'object':
      Object.keys(field.properties).forEach(propertyField => {
        object[propertyField] = buildFieldInitialData(
          field.properties[propertyField],
          propertyField,
          defaultValue,
        );
      });
      return object;

    //  after the recursion it all gets evaluated to a string field
    default:
      if (field.default) {
        return field.default;
      }
      //  return empty string for image fields so the placeholder shows up
      if (/image/i.test(key) && !/text/.test(key) && !/id/.test(key)) {
        return '';
      }

      //  this is for select fields
      if (field.enum) {
        if (typeof field.enum[0] === 'string') {
          return field.enum[0];
        }
        if (typeof field.enum[0] === 'boolean') {
          return 'false';
        }
      }
      if (field.format === 'date') {
        return '';
      }
      //  this is the default text field values from the array fields
      return field.default || '';
  }
};

const buildModuleInitialData = schema => {
  const data = {};
  Object.keys(schema).forEach(tf => {
    data[tf] = buildFieldInitialData(schema[tf], tf);
    // console.log(data);
  });
  return data;
};

export default buildModuleInitialData;
