'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Tipe data untuk props
interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

// Komponen helper untuk mengubah pusat peta saat lokasi berubah
function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  map.setView(coords, 16); // Angka 16 adalah level zoom
  return null;
}

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetLocation = () => {
        setLoading(true);
        setError(null);

        // Menggunakan Geolocation API dari browser
        navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            const newPosition: [number, number] = [latitude, longitude];
            setPosition(newPosition);
            onLocationSelect({ lat: latitude, lng: longitude }); // Kirim data ke parent
            setLoading(false);
        },
        (err) => {
            setError(`Gagal mendapatkan lokasi: ${err.message}`);
            console.error(err);
            setLoading(false);
        }
        );
    };

    return (
        <div className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-xs">{error}</p>}

        {/* Kontainer Peta */}
        <div className="h-55 w-full rounded-lg border overflow-hidden">
            <MapContainer
            center={position || [-7.983908, 112.621391]} // Posisi default (Malang) jika belum ada lokasi
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position && (
                <>
                <Marker position={position}>
                    <Popup>Lokasi Anda saat ini.</Popup>
                </Marker>
                <ChangeMapView coords={position} />
                </>
            )}
            </MapContainer>
        </div>
        {/* Tombol untuk memicu pengambilan lokasi */}
            <button
                type="button"
                onClick={handleGetLocation}
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Mencari Lokasi...' : 'Gunakan Lokasi Terkini Saya'}
            </button>
        </div>
    );
}