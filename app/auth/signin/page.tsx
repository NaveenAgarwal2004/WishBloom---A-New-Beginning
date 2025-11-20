import { Suspense } from "react";
import SignInPage from "./SignInPage";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <SignInPage />
    </Suspense>
  );
}
