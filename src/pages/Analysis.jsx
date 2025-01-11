import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, LineChart, PieChart } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Analysis = () => {
  const { userId } = useAuth();

  const { data: analyses, isLoading } = useQuery({
    queryKey: ['analyses', userId],
    queryFn: async () => {
      const response = await fetch('/api/analyses');
      if (!response.ok) throw new Error('Failed to fetch analyses');
      return response.json();
    },
  });

  const startNewAnalysis = async (type) => {
    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) throw new Error('Failed to start analysis');
      toast.success('Analysis started successfully');
    } catch (error) {
      toast.error('Failed to start analysis');
    }
  };

  return (
    <div className="animate-fadeIn space-y-8 p-6">
      <h1 className="text-4xl font-bold">Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => startNewAnalysis('descriptive')}>
          <BarChart2 className="h-8 w-8 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Descriptive Analysis</h3>
          <p className="text-muted-foreground">
            Get basic statistics and insights about your data
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => startNewAnalysis('predictive')}>
          <LineChart className="h-8 w-8 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Predictive Analysis</h3>
          <p className="text-muted-foreground">
            Make predictions based on historical data
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => startNewAnalysis('clustering')}>
          <PieChart className="h-8 w-8 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Clustering Analysis</h3>
          <p className="text-muted-foreground">
            Identify patterns and groups in your data
          </p>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Recent Analyses</h2>
        {isLoading ? (
          <div>Loading analyses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyses?.map((analysis) => (
              <Card key={analysis._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{analysis.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </div>
                {analysis.results && (
                  <div className="mt-4">
                    <BarChart width={400} height={200} data={analysis.results.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#34C759" />
                    </BarChart>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;