export function convertNumberToWordsEN(value: number): string {
  // Separate integer and decimal parts
  const [integerPart, decimalPart] = value
    .toString()
    .split(".")
    .map((part) => parseInt(part) || 0);

  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (value < 0) throw new Error("Negative numbers are not supported.");
  if (value === 0) return "zero";

  function convertLessThanHundred(num: number): string {
    if (num < 20) return ones[num];
    return (
      tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
    );
  }

  function convertLessThanThousand(num: number): string {
    if (num >= 100) {
      return (
        ones[Math.floor(num / 100)] +
        " hundred" +
        (num % 100 !== 0 ? " and " + convertLessThanHundred(num % 100) : "")
      );
    }
    return convertLessThanHundred(num);
  }

  function convertNumberToWords(num: number): string {
    let result = "";

    if (num >= 10000000) {
      result += convertLessThanThousand(Math.floor(num / 10000000)) + " crore ";
      num %= 10000000;
    }
    if (num >= 100000) {
      result += convertLessThanThousand(Math.floor(num / 100000)) + " lac ";
      num %= 100000;
    }
    if (num >= 1000) {
      result += convertLessThanThousand(Math.floor(num / 1000)) + " thousand ";
      num %= 1000;
    }
    if (num > 0) {
      result += convertLessThanThousand(num);
    }

    return result.trim();
  }

  let result = convertNumberToWords(integerPart);

  // Handle decimal part (paisa)
  if (decimalPart > 0) {
    // Convert two decimal digits to paisa
    const paisa = decimalPart < 10 ? decimalPart * 10 : decimalPart;
    result += " and " + convertLessThanHundred(paisa) + " paisa";
  }

  return result.trim();
}
