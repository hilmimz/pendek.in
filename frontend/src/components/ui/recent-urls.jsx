import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Copy, ExternalLink, BarChart3, Trash2, ArrowRight, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { getUrl } from "../../services/api";
import { useEffect } from "react";


const mockLinks = [
  { id: "1", slug: "promo-lebaran", originalUrl: "https://tokopedia.com/shop/lebaran-mega-sale-2025", clicks: 4821, created: "2 Jun 2025",  status: "active" },
  { id: "2", slug: "flash-deal-99", originalUrl: "https://shopee.co.id/flash-sale?type=99",           clicks: 3247, created: "5 Jun 2025",  status: "active" },
  { id: "3", slug: "signup-beta",   originalUrl: "https://myapp.io/register?ref=beta",                clicks: 2109, created: "8 Jun 2025",  status: "active" },
  { id: "4", slug: "ig-bio",        originalUrl: "https://linktr.ee/brandofficial",                   clicks: 1873, created: "10 Jun 2025", status: "active" },
  { id: "5", slug: "webinar-juli",  originalUrl: "https://zoom.us/j/98765432100",                     clicks: 1456, created: "11 Jun 2025", status: "inactive" },
];


export function RecentLinks({ onShowAll }) {
  const [copied, setCopied] = useState(null);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLinkStatus = (expiresAt) => {
    if (!expiresAt) return "active"
    return new Date(expiresAt) > new Date() ? "active" : "expired"
  }

  useEffect(() => {
    async function fetchUrl() {
      try {
        setLoading(true);
        const data = await getUrl();
        console.log(data);
        setUrls(data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUrl();
  }, []);

  const handleCopy = (alias) => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_SERVICE_URL}/${alias}`);
    setCopied(alias);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Links</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowAll}
            className="gap-1.5 text-primary hover:text-primary hover:bg-primary/8 -mr-1"
          >
            Show all
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 pb-1">
        <div className="border-t border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Short URL</TableHead>
                <TableHead>Original URL</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urls?.short_urls?.map((link) => (
                <TableRow key={link.id} className="group hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground">
                      /{link.alias}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="text-sm text-muted-foreground truncate block" title={link.originalUrl}>
                      {link.original_url}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold tabular-nums">
                      {link.click_count.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(link.created_at)}</TableCell>
                  <TableCell>
                    {(() => {
                      const status = getLinkStatus(link.expires_at)
                      return (
                        <Badge
                          variant={status === "active" ? "default" : "secondary"}
                          className={status === "active" ? "bg-green-100 text-green-700 border-0" : ""}
                        >
                          {status}
                        </Badge>
                      )
                    })()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        title="Copy short URL"
                        onClick={() => handleCopy(link.alias)}
                      >
                        {copied === link.alias
                          ? <Check className="size-3.5 text-green-600" />
                          : <Copy className="size-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8" title="View analytics">
                        <BarChart3 className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8" title="Open URL">
                        <ExternalLink className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8" title="Delete">
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing 5 of {urls?.total_urls} links
          </p>
          <button
            onClick={onShowAll}
            className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
          >
            View all {urls?.total_urls} links <ArrowRight className="size-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
