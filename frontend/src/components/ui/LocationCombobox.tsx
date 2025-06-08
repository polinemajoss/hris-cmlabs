'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
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
import axios from 'axios';

// Tipe data untuk respons dari API wilayah
interface LocationOption {
  id: string;
  nama: string;
}

interface LocationComboboxProps {
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  searchText?: string;
  emptyText?: string;
}

export function LocationCombobox({
  value,
  onSelect,
  placeholder = 'Pilih Lokasi...',
  searchText = 'Cari kota atau kabupaten...',
  emptyText = 'Lokasi tidak ditemukan.',
}: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [locations, setLocations] = React.useState<LocationOption[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Ambil data lokasi saat dropdown pertama kali dibuka
  React.useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_BINDERBYTE_API_KEY;
    
    if (open && locations.length === 0) {
      if (!apiKey) {
        console.error("API Key BinderByte tidak ditemukan di .env.local");
        // Anda bisa menambahkan notifikasi toast di sini
        if (typeof window !== "undefined" && "toast" in window) {
          // @ts-expect-error
          window.toast.error("API Key BinderByte tidak ditemukan di .env.local");
        }
        return;
      }
      
      setLoading(true);
      // Ganti 36 dengan id provinsi yang diinginkan, atau bisa juga dijadikan props
      const idProvinsi = "35";
      axios
        .get(`https://api.binderbyte.com/wilayah/kabupaten?api_key=${apiKey}&id_provinsi=${idProvinsi}`)
        .then(response => {
          // Pastikan struktur respons benar
          if (response.data && Array.isArray(response.data.value)) {
            setLocations(response.data.value.map((loc: { id: string; name: string }) => ({
              id: loc.id,
              nama: loc.name
            })));
          }
        })
        .catch(error => {
          console.error("Gagal mengambil data lokasi:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, locations.length]);

  // Dapatkan API Key gratis di: https://api.binderbyte.com/
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchText} />
          <CommandList>
            {loading && <div className="p-4 text-sm text-center">Memuat...</div>}
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location.id}
                  value={location.nama} // Cari berdasarkan nama
                  onSelect={(currentValue) => {
                    // Kirim nama lokasi yang dipilih ke parent
                    onSelect(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === location.nama ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {location.nama}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}