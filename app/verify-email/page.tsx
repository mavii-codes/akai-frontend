"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/auth.service";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const verificationStarted = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (verificationStarted.current) return;

      if (!token) {
        setStatus("error");
        return;
      }

      verificationStarted.current = true;

      try {
        const response = await authService.verifyEmail(token);
        if (response.code === 200) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Email Verification</CardTitle>
        <CardDescription>
          {status === "loading" && "We are currently verifying your email address."}
          {status === "success" && "Your email has been successfully verified."}
          {status === "error" && "We couldn't verify your email address."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">Verifying...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold">Verification Complete!</h3>
            <p className="text-center text-sm text-muted-foreground">
              Thank you for verifying your email. You can now access all the features of your account.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold">Verification Failed</h3>
            <p className="text-center text-sm text-muted-foreground">
              The verification link may have expired or is invalid. Please try requesting a new verification link.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-4">
          {status === "success" ? (
            <Link href="/login" className="w-full">
              <Button className="w-full">Proceed to Login</Button>
            </Link>
          ) : status === "error" ? (
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full">Back to Login</Button>
              </Link>
            </div>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}