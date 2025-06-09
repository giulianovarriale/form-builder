"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updatePassword } from "../actions/update-password";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function UpdatePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);

  const code = useSearchParams().get("code") ?? "";

  return (
    <div className="px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">
            Update password
          </CardTitle>

          <CardDescription>
            To change your password, please enter your new password below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={updatePassword} className="space-y-6">
            <input type="hidden" name="code" value={code} />

            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium"
              >
                New password
              </label>

              <div className="relative">
                <Input
                  id="new-password"
                  name="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pr-10"
                  required
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
