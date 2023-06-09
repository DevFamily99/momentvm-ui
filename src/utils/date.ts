import moment, { Moment } from 'moment';

export const prettyDate = (date: Date) => {
  const momentDate = moment(date, 'YYYY-MM-DD hh:mm:ss Z');
  // console.log("Date: ", momentDate.format("LLL"));
  return momentDate;
};
