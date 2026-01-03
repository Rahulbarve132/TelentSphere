"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
// import api from "@/lib/axios";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        // await api.post("/auth/verify-email", { token });
        // Mocking verification
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  return (
    <Card className="w-full max-w-md bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-center">Email Verification</CardTitle>
        <CardDescription className="text-center">
           Verifying your email address...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
        {status === "verifying" && (
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
        )}
        
        {status === "success" && (
            <>
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <p className="text-center text-lg font-medium">Email verified successfully!</p>
                <Link href="/login" className="w-full">
                    <Button className="w-full">Proceed to Login</Button>
                </Link>
            </>
        )}

        {status === "error" && (
            <>
                <XCircle className="h-16 w-16 text-destructive" />
                <p className="text-center text-lg font-medium">Verification failed</p>
                <p className="text-center text-muted-foreground text-sm">
                    The token may be invalid or expired.
                </p>
                <Link href="/login" className="w-full">
                     <Button variant="outline" className="w-full">Back to Login</Button>
                </Link>
            </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
             <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <VerifyEmailForm />
             </Suspense>
        </div>
    )
}
