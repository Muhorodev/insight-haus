import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, BarChart2, FileText } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const { userId } = useAuth();

  const { data: datasets, isLoading: datasetsLoading } = useQuery({
    queryKey: ['datasets', userId],
    queryFn: async () => {
      const response = await fetch('/api/datasets');
      if (!response.ok) throw new Error('Failed to fetch datasets');
      return response.json();
    },
  });

  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['analyses', userId],
    queryFn: async () => {
      const response = await fetch('/api/analyses');
      if (!response.ok) throw new Error('Failed to fetch analyses');
      return response.json();
    },
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/datasets/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      toast.success('Dataset uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload dataset');
    }
  };

  return (
    <div className="animate-fadeIn space-y-8 p-6">
      <h1 className="text-4xl font-bold">Welcome to InsightHaus</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </h3>
          <p className="text-muted-foreground mb-4">
            Upload your Excel or CSV files to start analyzing your data
          </p>
          <Button className="w-full" onClick={() => document.getElementById('fileUpload').click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <input
            id="fileUpload"
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileUpload}
          />
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Recent Analysis
          </h3>
          {analysesLoading ? (
            <p className="text-muted-foreground">Loading analyses...</p>
          ) : analyses?.length > 0 ? (
            <ul className="space-y-2">
              {analyses.slice(0, 3).map((analysis) => (
                <li key={analysis._id} className="text-sm">
                  {analysis.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No recent analysis</p>
          )}
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full">Create New Report</Button>
            <Button variant="outline" className="w-full">View Datasets</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Datasets</h3>
          {datasetsLoading ? (
            <p className="text-muted-foreground">Loading datasets...</p>
          ) : datasets?.length > 0 ? (
            <ul className="space-y-2">
              {datasets.slice(0, 5).map((dataset) => (
                <li key={dataset._id} className="flex justify-between items-center">
                  <span>{dataset.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(dataset.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No datasets available</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;