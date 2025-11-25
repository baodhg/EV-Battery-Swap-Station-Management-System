"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function StaffSettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-3">Profile</h3>
        <div className="text-sm text-gray-600">Logged in as staff@example.com</div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-3">Notifications</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm">Enable admin directives notifications</span>
          <Button variant="outline" onClick={() => setNotifications(v => !v)}>
            {notifications ? "On" : "Off"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
