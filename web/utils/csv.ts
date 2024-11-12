/**
 * Transforms CSV text by normalizing newlines to commas and cleaning up whitespace
 * @param csvText The raw CSV text to transform
 * @returns An array of trimmed values split by comma
 */
export const transformCSV = (csvText: string): string[] => {
  // Replace all newline characters (\n or \r\n) with commas
  const withCommas = csvText.replace(/[\r\n]+/g, ",");

  // Remove spaces before and after commas
  const cleanedSpaces = withCommas.replace(/\s*,\s*/g, ",");

  // Split by comma and filter out empty values
  const valuesArray = cleanedSpaces
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return valuesArray;
};

/**
 * Converts an array of values back into CSV format
 * @param values Array of values to convert to CSV
 * @param valuesPerLine Number of values per line (default: 1)
 * @returns Formatted CSV string with values separated by commas and newlines
 */
export const arrayToCSV = (
  values: string[],
  valuesPerLine: number = 1
): string => {
  if (!Array.isArray(values)) {
    throw new Error("Input must be an array");
  }

  if (valuesPerLine < 1) {
    throw new Error("Values per line must be at least 1");
  }

  // Handle empty array
  if (values.length === 0) {
    return "";
  }

  // Group values into chunks of size valuesPerLine
  const lines: string[] = [];
  for (let i = 0; i < values.length; i += valuesPerLine) {
    const chunk = values.slice(i, i + valuesPerLine);
    lines.push(chunk.join(", "));
  }

  // Join lines with newlines
  return lines.join("\n");
};

// Example usage:
/*
  // Array to CSV
  const values = ["value1", "value2", "value3", "value4", "value5", "value6"];
  console.log(arrayToCSV(values, 2));
  // Output:
  // value1, value2
  // value3, value4
  // value5, value6

  // CSV to Array
  const sampleCSV = `value1, value2
  value3,    value4,
  value5,value6`;

  const backToArray = transformCSV(sampleCSV);
  console.log(backToArray);
  // Output: ["value1", "value2", "value3", "value4", "value5", "value6"]

  // Round trip conversion
  console.log(arrayToCSV(backToArray, 2));
  // Output:
  // value1, value2
  // value3, value4
  // value5, value6
  */
