import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "./badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"

export function SectionCardsEmployee() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      {/* Naik - Hijau */}
      <Card
        className="@container/card border-green-500 bg-gradient-to-b from-white to-green-50 dark:from-card dark:to-green-900"
        data-slot="card"
      >
        <CardHeader className="relative">
          <CardDescription>Periode</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {new Date().toLocaleString("id-ID", { month: "long", year: "numeric" })}
            </CardTitle>
            <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-green-500 text-green-600">
              <TrendingUpIcon className="size-3 text-green-600" />
              +2.1%
            </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
            Performa meningkat <TrendingUpIcon className="size-4 text-green-600" />
            </div>
            <div className="text-muted-foreground">
            Periode berjalan dengan tren positif
            </div>
        </CardFooter>
      </Card>
      {/* Turun - Merah */}
      <Card
        className="@container/card border-red-500 bg-gradient-to-b from-white to-red-50 dark:from-card dark:to-red-900"
        data-slot="card"
      >
        <CardHeader className="relative">
          <CardDescription>Total Karyawan</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            1,234 Orang
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-red-500 text-red-600">
              <TrendingDownIcon className="size-3 text-red-600" />
              -1.8%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Jumlah karyawan menurun <TrendingDownIcon className="size-4 text-red-600" />
          </div>
          <div className="text-muted-foreground">
            Perlu evaluasi rekrutmen
          </div>
        </CardFooter>
      </Card>
      {/* Naik - Hijau */}
      <Card
        className="@container/card border-green-500 bg-gradient-to-b from-white to-green-50 dark:from-card dark:to-green-900"
        data-slot="card"
      >
        <CardHeader className="relative">
          <CardDescription>Total Karyawan Baru</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            56 Orang
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-green-500 text-green-600">
              <TrendingUpIcon className="size-3 text-green-600" />
              +8.9%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Rekrutmen meningkat <TrendingUpIcon className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Karyawan baru bulan ini
          </div>
        </CardFooter>
      </Card>
      {/* Naik - Hijau */}
      <Card
        className="@container/card border-green-500 bg-gradient-to-b from-white to-green-50 dark:from-card dark:to-green-900"
        data-slot="card"
      >
        <CardHeader className="relative">
          <CardDescription>Karyawan Tetap</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            1,178 Orang
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-green-500 text-green-600">
              <TrendingUpIcon className="size-3 text-green-600" />
              +1.2%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Mayoritas karyawan tetap <TrendingUpIcon className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Persentase pegawai tetap
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}