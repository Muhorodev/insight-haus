import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();

  const handleSave = async (setting) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setting),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="animate-fadeIn space-y-8 p-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 rounded border"
                defaultValue={user?.fullName}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 rounded border"
                defaultValue={user?.primaryEmailAddress?.emailAddress}
                readOnly
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Button
                variant="outline"
                onClick={() => handleSave({ emailNotifications: true })}
              >
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Analysis Completion Alerts</span>
              <Button
                variant="outline"
                onClick={() => handleSave({ analysisAlerts: true })}
              >
                Enable
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Data Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Auto-save Analysis</span>
              <Button
                variant="outline"
                onClick={() => handleSave({ autoSave: true })}
              >
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Share Analytics</span>
              <Button
                variant="outline"
                onClick={() => handleSave({ shareAnalytics: true })}
              >
                Enable
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">API Access</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <input
                type="text"
                className="w-full p-2 rounded border bg-gray-100"
                value="••••••••••••••••"
                readOnly
              />
            </div>
            <Button variant="outline" className="w-full">
              Generate New API Key
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;