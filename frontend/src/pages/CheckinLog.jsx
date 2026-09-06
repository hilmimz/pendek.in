import { useEffect, useState } from "react";
import { fetchCheckinLog } from "../services/api";

export default function CheckinLog() {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCheckinLog()
      .then((t) => {
        if (mounted) setText(t);
      })
      .catch((e) => {
        if (mounted) setError(e.message || String(e));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <pre>{text}</pre>;
}
