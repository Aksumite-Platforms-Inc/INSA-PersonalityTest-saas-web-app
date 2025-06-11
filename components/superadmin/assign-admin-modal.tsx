import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";
import { assignAdminToOrganization } from "../../services/organization.service";

interface AssignAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
}

const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  isOpen,
  onClose,
  organizationId,
}) => {
  const [adminEmail, setAdminEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminEmail) {
      toast({
        title: "Error",
        description: "Please provide an admin email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await assignAdminToOrganization(organizationId, adminEmail);
      toast({
        title: "Success",
        description: "Admin assigned successfully.",
      });
      onClose();
    } catch (error) {
      console.error("Error assigning admin:", error);
      toast({
        title: "Error",
        description: "Failed to assign admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Assign Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Admin"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignAdminModal;
