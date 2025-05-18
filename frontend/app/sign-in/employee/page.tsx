import { SignInEmployee } from "../../../components/ui/sign-in-employee"; // Pastikan path benar

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInEmployee />
      </div>
    </div>
  );
}
