// app/components/filters/letter-management-filters.tsx

"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Pastikan path import benar
import { Badge } from "@/components/ui/badge"; // Pastikan path import benar
import { Checkbox } from "@/components/ui/checkbox"; // Pastikan path import benar
import { Label } from "@/components/ui/label"; // Pastikan path import benar

// Data dummy untuk filter. Nantinya ini bisa diambil dari API.
const filterOptions = {
  status: [
    { id: "s-all", label: "Show All", count: 150 },
    { id: "s-approved", label: "Approved", count: 82 },
    { id: "s-pending", label: "Pending", count: 45 },
    { id: "s-rejected", label: "Rejected", count: 23 },
  ],
  type: [
    { id: "t-all", label: "Show All", count: 150 },
    { id: "t-sick", label: "Sick Leave", count: 60 },
    { id: "t-permit", label: "Permit", count: 50 },
    { id: "t-remote", label: "Remote Work", count: 40 },
  ],
};

export function LetterManagementFilters() {
  return (
    <div className="px-3 py-2">
      {/* Gunakan Accordion untuk membuat grup filter yang bisa di-collapse */}
      <Accordion type="multiple" defaultValue={["status", "type"]} className="w-full">
        {/* Grup Filter berdasarkan Status Surat */}
        <AccordionItem value="status" className="border-b-0">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
            Filter by Status
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-3">
            {filterOptions.status.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className="text-sm font-normal text-muted-foreground"
                  >
                    {option.label}
                  </Label>
                </div>
                <Badge variant="secondary">{option.count}</Badge>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Grup Filter berdasarkan Tipe Surat */}
        <AccordionItem value="type" className="border-b-0">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
            Filter by Type
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-3">
            {filterOptions.type.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox id={option.id} />
                    <Label
                        htmlFor={option.id}
                        className="text-sm font-normal text-muted-foreground"
                    >
                        {option.label}
                    </Label>
                </div>
                <Badge variant="secondary">{option.count}</Badge>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}