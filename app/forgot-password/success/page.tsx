"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle2Icon } from "lucide-react";

export default function ForgotPasswordSuccessPage() {
  return (
    <div className="px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">
            Forgot password?
          </CardTitle>

          <CardDescription>
            To receive an email to reset your password, enter the email address
            associated with your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>
              A reset link has been sent to your email address.
            </AlertTitle>

            <AlertDescription>
              Follow the instructions in your inbox to reset your password.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
