'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils'; // Pastikan path ke utils Anda benar
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Definisikan tipe untuk data karyawan yang diterima
export interface EmployeeOption {
  id: string;
  first_name: string;
  last_name: string;
}

// Definisikan tipe untuk props komponen ini
interface EmployeeComboboxProps {
  employees: EmployeeOption[];
  value: string; // ID karyawan yang terpilih
  onSelect: (value: string) => void; // Fungsi untuk mengubah ID terpilih
  placeholder?: string;
  searchText?: string;
  emptyText?: string;
}

export function EmployeeCombobox({
  employees,
  value,
  onSelect,
  placeholder = 'Pilih karyawan...',
  searchText = 'Cari karyawan...',
  emptyText = 'Tidak ada karyawan ditemukan.',
}: EmployeeComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedEmployee = employees.find((employee) => employee.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedEmployee
            ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchText} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {employees.map((employee) => (
                <CommandItem
                  key={employee.id}
                  value={`${employee.first_name} ${employee.last_name}`}
                  onSelect={() => {
                    onSelect(employee.id); // Kirim ID ke parent
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === employee.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {`${employee.first_name} ${employee.last_name}`}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}