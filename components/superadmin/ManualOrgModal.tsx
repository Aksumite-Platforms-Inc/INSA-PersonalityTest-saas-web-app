"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateOrganization } from "@/services/organization.service";

interface ManualOrgModalProps {
  open: boolean;
  onClose: () => void;
  initialData: { id?: number; name: string; sector: string };
  onSubmit: (data: { id?: number; name: string; sector: string }) => void;
}

export function ManualOrgModal({
  open,
  onClose,
  initialData,
  onSubmit,
}: ManualOrgModalProps) {
  const [name, setName] = useState(initialData.name || "");
  const [sector, setSector] = useState(initialData.sector || "");

  useEffect(() => {
    setName(initialData.name || "");
    setSector(initialData.sector || "");
  }, [initialData]);

  const handleSave = () => {
    onSubmit({ id: initialData.id, name, sector });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData.id ? "Edit Organization" : "Add Organization"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Organization Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Sector (e.g., government, finance)"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {initialData.id ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
