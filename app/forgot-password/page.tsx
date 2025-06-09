"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { sendResetPasswordLink } from "../actions/send-reset-password-link";

export default function ForgotPasswordPage() {
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
          <form action={sendResetPasswordLink} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>

              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Send me a reset link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
