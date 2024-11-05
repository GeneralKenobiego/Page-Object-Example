const dayjs = require("dayjs");
import { Dayjs } from "dayjs";
/**
 * Get a random date with custom format between two dates
 * @param start - Start date.
 * @param end - End date.
 * @param dateFormat - Custom date format.
 */
export function getRandomFormattedDate(
  start: Dayjs,
  end: Dayjs,
  dateFormat: string,
): string {
  const startDate = start.valueOf();
  const endDate = end.valueOf();
  // The lodash built into cypress is used to generate a random value
  const randomDate = Cypress._.random(startDate, endDate);
  return dayjs(randomDate).format(dateFormat);
}
