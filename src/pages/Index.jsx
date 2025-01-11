import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const Index = () => {
  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8">Welcome to Analytics Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4">Import Data</h3>
          <p className="text-muted-foreground mb-4">
            Upload your Excel or CSV files to start analyzing your data
          </p>
          <Button className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Analysis</h3>
          <p className="text-muted-foreground">No recent analysis</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full">Create New Report</Button>
            <Button variant="outline" className="w-full">View Datasets</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;