import { useState } from "react";
import { Client } from "../interfaces/client";

const useFetchClient = () => {
  const [client, setClient] = useState<Client[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/client");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Client[] = await response.json();
      setClient(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { client, loading, error, fetchClients };
};

export default useFetchClient;
