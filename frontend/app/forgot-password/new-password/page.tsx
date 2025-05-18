import { NewPassword } from "../../../components/ui/new-password"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <NewPassword />
      </div>
    </div>
  )
}
