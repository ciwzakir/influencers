export const maritalStatusOptions = [
  {
    label: "Married",
    value: "married",
  },
  {
    label: "Unmarried",
    value: "unmarried",
  },
];

export const genderOptions = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
];
export const marriedOptions = [
  {
    label: "Married",
    value: "married",
  },
  {
    label: "Unmarried",
    value: "unmarried",
  },
];

export const bloodGroupOptions = [
  {
    label: "A+ (Positive)",
    value: "A+",
  },
  {
    label: "A- (Negative)",
    value: "A-",
  },
  {
    label: "B+ (Positive)",
    value: "B+",
  },
  {
    label: "B- (Negative)",
    value: "B-",
  },
  {
    label: "AB+ (Positive)",
    value: "AB+",
  },
  {
    label: "AB- (Negative)",
    value: "AB-",
  },

  {
    label: "O+ (Positive)",
    value: "O+",
  },
  {
    label: "O- (Negative)",
    value: "O-",
  },
];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const monthOptions = months.map((month: string) => {
  return {
    label: month,
    value: month,
  };
});

export const semesterRegistrationStatus = ["UPCOMING", "ONGOING", "ENDED"];

export enum ExamType {
  FINAL = "FINAL",
  MIDTERM = "MIDTERM",
}

export const qualificationOptions = [
  {
    label: "SSC",
    value: "SSC",
  },
  {
    label: "HSC",
    value: "HSC",
  },

  {
    label: "Degree",
    value: "degree",
  },
  {
    label: "Honours",
    value: "Honours",
  },
  {
    label: "Masters",
    value: "Masters",
  },
];

export const graduationYearOptions = [
  {
    label: "2005",
    value: 2005,
  },

  {
    label: "2007",
    value: 2007,
  },
  {
    label: "2008",
    value: 2008,
  },

  {
    label: "2009",
    value: 2009,
  },

  {
    label: "2010",
    value: 2010,
  },
];

export const publishedOptions = [
  { value: "PAID", label: "Paid" },
  { value: "AWAITING", label: "Awaiting Payment" },
  { value: "PENDING", label: "Pending" },
  { value: "SENT_BACK", label: "Sent Back for correction" },
];

export const finYearOptions = [
  {
    label: "2024-25",
    value: "2024-25",
  },
  {
    label: "2025-26",
    value: "2025-26",
  },
  {
    label: "2026-27",
    value: "2026-27",
  },
  {
    label: "2027-28",
    value: "2027-28",
  },
];
