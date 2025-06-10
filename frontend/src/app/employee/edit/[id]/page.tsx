// File: src/app/employee/edit/[id]/page.tsx

import EditForm from "./EditForm";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

// Definisikan interface yang sesuai dengan backend Laravel
interface EmployeeData {
    id: string; // ID karyawan
    user_id: string;
    first_name: string;
    last_name: string;
    gender: "M" | "F";
    mobile_number: string;
    nik: string;
    birth_place: string;
    birth_date: string | null;
    education: string;
    position: string;
    grade: string;
    branch: string;
    contract_type: "Tetap" | "Kontrak" | "Lepas";
    bank: string;
    bank_account_number: string;
    bank_account_name: string;
    sp_type: string;
    status: "Aktif" | "Tidak Aktif";
    avatar: string;
    created_at: string; // Tambahan dari API
    updated_at: string; // Tambahan dari API
    user?: any; // Jika Anda perlu data user terkait
}

export default function EditEmployeePage() {
    const router = useRouter();
    const { id } = useParams(); // ID dari URL
    const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Ambil CSRF cookie jika menggunakan Sanctum SPA authentication
                await axiosInstance.get("/sanctum/csrf-cookie");
                const response = await axiosInstance.get(`/employees/${id}`);
                // Perhatikan format respons: Anda mungkin perlu mengakses response.data.data
                // jika backend mengembalikan format { status: 'success', data: ... }
                setEmployeeData(response.data); // Sesuaikan jika respons berbeda
            } catch (err: any) {
                console.error("Failed to fetch employee for editing:", err.response ? err.response.data : err.message);
                setError("Failed to load employee data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdate = async (formData: EmployeeData) => {
        try {
            // Ambil CSRF cookie jika menggunakan Sanctum SPA authentication
            await axiosInstance.get("/sanctum/csrf-cookie");

            const response = await axiosInstance.put(`/employees/${id}`, formData);
            console.log("Employee updated successfully:", response.data);
            router.push("/employee");
        } catch (err: any) {
            console.error("Failed to update employee:", err.response ? err.response.data : err.message);
            if (err.response && err.response.data && err.response.data.errors) {
                alert('Validation Errors: ' + JSON.stringify(err.response.data.errors));
            } else {
                alert('Failed to update employee. Please try again.');
            }
        }
    };

    if (loading) return <p>Loading employee data...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!employeeData) return <p>No employee data found.</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Karyawan</h1>
            {/* Gunakan AddEmployeeForm dan lewati data awal sebagai initialData */}
            <AddEmployeeForm
                initialData={employeeData} // Mengirim data karyawan yang akan diedit
                onSubmit={handleUpdate}
                onCancel={() => router.push("/employee")}
            />
        </div>
    );
}