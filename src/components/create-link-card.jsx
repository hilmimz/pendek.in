import { shorten } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Link2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export function CreateLinkCard() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState(null);
  const [showAlias, setShowAlias] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [aliasError, setAliasError] = useState("");
  const [urlError, setUrlError] = useState("");

  const normalizeUrl = (url) => {
    if (!url) return url;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const isValidUrl = (input) => {
    try {
      const normalized = /^https?:\/\//i.test(input)
        ? input
        : `https://${input}`;
      const { hostname } = new URL(normalized);

      return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(hostname);
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    if (!url) return;
    const serviceUrl = import.meta.env.VITE_SERVICE_URL;
    const host = new URL(serviceUrl).host + "/";

    if (!isValidUrl(url)) {
      setUrlError("Please enter a valid URL");
      return;
    }
    setUrlError("");

    const validUrl = normalizeUrl(url);

    const normalizedAlias = alias?.trim() || null;

    if (normalizedAlias && !/^[a-z0-9\-_]+$/i.test(normalizedAlias)) {
      setAliasError("Only letters, numbers, hyphens and underscores allowed.");
      return;
    }
    setAliasError("");

    try {
      const result = await shorten({
        original_url: validUrl,
        alias: normalizedAlias,
      });
      setShortUrl(`${host}${result.data.alias}`);
    } catch (error) {
      setAliasError(
        error.errors.alias || error.message || "Failed to shorten URL.",
      );
    }
  };

  const handleCopy = (shrturl = "") => {
    const serviceUrl = import.meta.env.VITE_SERVICE_URL;
    const url = new URL(serviceUrl);
    if (shrturl == "") {
      if (!shortUrl) {
        return;
      } else {
        shrturl = shortUrl;
      }
    } else {
      shrturl = `pendekin.id/${shrturl}`;
    }
    navigator.clipboard.writeText(`${url.protocol}//${shrturl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleShorten();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="size-5 text-primary" />
          <p className="font-sans text-sm font-semibold">Create Short Link</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL row */}
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Input
              placeholder="Paste your long URL here…"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setShortUrl("");
                setUrlError("");
              }}
              onKeyDown={handleKeyDown}
              className={`flex-1 font-sans ${urlError ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
            />
            <button
              onClick={handleShorten}
              disabled={!url}
              className="px-3 shrink-0 bg-primary text-primary-foreground hover:bg-primary/80 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              Shorten
            </button>
          </div>
          {urlError && <p className="text-xs text-destructive">{urlError}</p>}
        </div>

        {/* Custom alias toggle */}
        <button
          type="button"
          onClick={() => {
            setShowAlias((v) => !v);
            setAliasError("");
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors select-none w-fit"
        >
          <Sparkles className="size-3.5" />
          <p className="font-sans">Custom alias</p>
          {showAlias ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </button>

        {/* Alias input — slides in */}
        {showAlias && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground shrink-0 select-none font-sans">
                pendekin.id/
              </span>
              <Input
                placeholder="my-custom-slug"
                value={alias}
                onChange={(e) => {
                  setAlias(e.target.value);
                  setAliasError("");
                  setShortUrl("");
                }}
                onKeyDown={handleKeyDown}
                className={`flex-1 font-mono text-sm ${aliasError ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
              />
            </div>
            {aliasError && (
              <p className="text-xs text-destructive">{aliasError}</p>
            )}
            <p className="text-xs text-muted-foreground font-sans">
              Leave empty to auto-generate a random slug.
            </p>
          </div>
        )}

        {/* Result */}
        {shortUrl && (
          <div className="flex items-center gap-2 p-3 bg-accent rounded-xl border border-primary/15">
            <span className="flex-1 text-sm font-mono text-primary font-medium truncate">
              {shortUrl}
            </span>
            <button
              onClick={() => handleCopy()}
              className="shrink-0 gap-1.5 flex items-center border border-black/15 bg-white rounded-md px-2 py-1 text-sm font-sans cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-green-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> Copy
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
