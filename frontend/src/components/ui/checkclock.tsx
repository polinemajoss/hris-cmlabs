import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './table';

const data = [
  {
    name: 'Juanita', jabatan: 'CEO', clockIn: '08.00', clockOut: '16.30', workHours: '10h 5m', approve: false, status: 'Waiting Approval'
  },
  {
    name: 'Shane', jabatan: 'OB', clockIn: '08.00', clockOut: '17.15', workHours: '9h 50m', approve: true, status: 'On Time'
  },
  {
    name: 'Miles', jabatan: 'Head of HR', clockIn: '09.00', clockOut: '16.45', workHours: '10h 30m', approve: true, status: 'On Time'
  },
  {
    name: 'Flores', jabatan: 'Manager', clockIn: '09.15', clockOut: '15.30', workHours: '6h 15m', approve: true, status: 'Late'
  },
  {
    name: 'Henry', jabatan: 'CPO', clockIn: '0', clockOut: '0', workHours: '0', approve: false, status: 'Annual Leave'
  },
  {
    name: 'Marvin', jabatan: 'OB', clockIn: '0', clockOut: '0', workHours: '0', approve: true, status: 'Absent'
  },
  {
    name: 'Black', jabatan: 'HRD', clockIn: '08.15', clockOut: '17.00', workHours: '9h 45m', approve: true, status: 'On Time'
  },
  {
    name: 'Jacob Jones', jabatan: 'Supervisor', clockIn: '0', clockOut: '0', workHours: '0', approve: false, status: 'Sick Leave'
  },
  {
    name: 'Ronalds Ricards', jabatan: 'OB', clockIn: '08.00', clockOut: '16.00', workHours: '10h', approve: true, status: 'Late'
  },
  {
    name: 'Leslie Alexander', jabatan: 'OB', clockIn: '08.30', clockOut: '16.00', workHours: '8h 30m', approve: false, status: 'Waiting Approval'
  },
];

export default function TableCheckclock() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee Name</TableHead>
          <TableHead>Jabatan</TableHead>
          <TableHead>Clock In</TableHead>
          <TableHead>Clock Out</TableHead>
          <TableHead>Work Hours</TableHead>
          <TableHead>Approve</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-gray-300 rounded-full inline-block" />
                <span>{row.name}</span>
              </div>
            </TableCell>
            <TableCell>{row.jabatan}</TableCell>
            <TableCell>{row.clockIn}</TableCell>
            <TableCell>{row.clockOut}</TableCell>
            <TableCell>{row.workHours}</TableCell>
            <TableCell>
              <input type="checkbox" checked={row.approve} readOnly className="accent-gray-700" />
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded bg-gray-100 border text-xs ${
                  row.status === 'Late'
                    ? 'border-yellow-400 text-yellow-700'
                    : row.status === 'On Time'
                    ? 'border-green-400 text-green-700'
                    : row.status === 'Waiting Approval'
                    ? 'border-gray-400 text-gray-700'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {row.status}
              </span>
            </TableCell>
            <TableCell>
              <button className="border px-3 py-1 rounded-lg">View</button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}