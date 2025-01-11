import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Database, Trash2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

const Datasets = () => {
  const { userId } = useAuth();

  const { data: datasets, isLoading, refetch } = useQuery({
    queryKey: ['datasets', userId],
    queryFn: async () => {
      const response = await fetch('/api/datasets');
      if (!response.ok) throw new Error('Failed to fetch datasets');
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
      refetch();
    } catch (error) {
      toast.error('Failed to upload dataset');
    }
  };

  const handleDelete = async (datasetId) => {
    try {
      const response = await fetch(`/api/datasets/${datasetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');
      toast.success('Dataset deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete dataset');
    }
  };

  return (
    <div className="animate-fadeIn space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Datasets</h1>
        <Button onClick={() => document.getElementById('fileUpload').click()}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Dataset
        </Button>
        <input
          id="fileUpload"
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {isLoading ? (
        <div>Loading datasets...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets?.map((dataset) => (
            <Card key={dataset._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">{dataset.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(dataset.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(dataset._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {dataset.description || 'No description provided'}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  View Data
                </Button>
                <Button variant="outline" size="sm">
                  Analyze
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Datasets;