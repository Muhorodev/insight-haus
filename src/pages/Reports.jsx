import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

const Reports = () => {
  const { userId } = useAuth();

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports', userId],
    queryFn: async () => {
      const response = await fetch('/api/reports');
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json();
    },
  });

  const handleDownload = async (reportId) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleShare = async (reportId) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/share`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Share failed');
      
      const { shareUrl } = await response.json();
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      toast.error('Failed to share report');
    }
  };

  return (
    <div className="animate-fadeIn space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Reports</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Create New Report
        </Button>
      </div>

      {isLoading ? (
        <div>Loading reports...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports?.map((report) => (
            <Card key={report._id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{report.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(report._id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare(report._id)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {report.description || 'No description provided'}
              </p>
              <div className="mt-4">
                <Button variant="outline" size="sm">
                  View Report
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;