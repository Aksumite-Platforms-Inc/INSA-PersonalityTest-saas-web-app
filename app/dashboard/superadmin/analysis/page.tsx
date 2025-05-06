"use client";

import React, { useEffect, useRef, useState } from "react";
import { getOrganizations } from "@/services/org.service";
import { uploadFile } from "@/services/file.service";
import toast from "react-hot-toast";

const AnalysisUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [orgs, setOrgs] = useState<{ id: number; name: string }[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchOrgs = async () => {
      const { data, success, error } = await getOrganizations();
      if (success) {
        setOrgs(data ?? []);
      } else {
        toast.error(`Failed to load organizations: ${error}`);
      }
    };

    fetchOrgs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      setFile(null);
      toast("Please select a valid PDF file.", {
        icon: "⚠️",
        style: { background: "#fffbe6", color: "#8a6d3b" },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !selectedOrgId) {
      toast("Please select both a PDF file and an organization.", {
        icon: "⚠️",
        style: { background: "#fffbe6", color: "#8a6d3b" },
      });
      return;
    }

    setLoading(true);
    const { success, error } = await uploadFile(file, selectedOrgId);
    setLoading(false);

    if (success) {
      toast.success("PDF uploaded and sent successfully!");
      setFile(null);
      setSelectedOrgId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      toast.error(`Upload failed: ${error}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Upload and Send PDF Analysis
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select PDF File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Organization</label>
          <select
            value={selectedOrgId ?? ""}
            onChange={(e) => setSelectedOrgId(Number(e.target.value))}
            className="w-full border p-2 rounded"
          >
            <option value="" disabled>
              -- Choose an organization --
            </option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !file || !selectedOrgId}
          className={`px-4 py-2 rounded transition text-white ${
            loading || !file || !selectedOrgId
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send PDF"}
        </button>
      </form>
    </div>
  );
};

export default AnalysisUploadPage;
