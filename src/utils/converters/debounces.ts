import { useEffect, useState } from "react";

interface IDebouncedPriceRangeOptions {
  rangeQuery: IPriceRange;
  delay: number;
}

export interface IPriceRange {
  fromValue: number;
  ToValue: number;
}

export const useDebouncedPriceRange = ({
  rangeQuery,
  delay,
}: IDebouncedPriceRangeOptions) => {
  const [debouncedPriceRangeValue, setDebouncedPriceRangeValue] =
    useState(rangeQuery);

  useEffect(() => {
    const debounceHandler = setTimeout(() => {
      setDebouncedPriceRangeValue(rangeQuery);
    });
    return () => {
      clearTimeout(debounceHandler);
    };
  }, [rangeQuery, delay]);

  return debouncedPriceRangeValue;
};
