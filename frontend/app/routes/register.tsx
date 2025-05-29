import { Suspense, lazy } from "react";

const RegisterPage = lazy(() => import("~/pages/auth/register"));

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}
