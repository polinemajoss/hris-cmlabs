<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Letter extends Model
{
    use HasFactory, HasUuids;

    /**
     * Nama tabel di database yang terhubung dengan model ini.
     *
     * @var string
     */
    protected $table = 'letters';

    /**
     * Kolom-kolom yang boleh diisi secara massal (mass assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id', // Foreign key ke tabel employees
        'title',
        'type',
        'date',
        'status',
        'content',     // Anda bisa menambahkan kolom lain seperti isi surat
    ];

    /**
     * Tipe data asli dari atribut-atribut.
     * Berguna agar Laravel otomatis mengubah tipe datanya.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date', // Otomatis mengubah 'YYYY-MM-DD' menjadi objek Carbon
    ];

    /**
     * Mendefinisikan relasi "belongsTo" ke model Employee.
     * Artinya, setiap surat dimiliki oleh satu karyawan.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
