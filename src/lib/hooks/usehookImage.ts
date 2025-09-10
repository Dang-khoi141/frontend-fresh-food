import { useState } from "react";

export const useFetchImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchImage = async (filename: string) => {
    try {
      const response = await fetch(`/api/preview-image/${filename}`);
      if (!response.ok) throw new Error("Network error");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImage(url);
    } catch (err) {
      setError(err as Error);
    }
  };

  return { image, error, fetchImage };
};
