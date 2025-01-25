import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { PasswordInput } from "../ui/password-input";
import { useNavigate, useLocation } from "react-router-dom";
import * as z from "zod";
import { axiosInstance } from "@/provider/axios";

// Zod schema for password validation
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[@#$!%*?&]/, { message: "Password must contain at least one special character." });

const ResetPasswordComponent = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null); // For password mismatch
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email; // Retrieve email from state

  const validatePassword = (password: string) => {
    try {
      passwordSchema.parse(password); // Validate using Zod schema
      setError(null); // No error if valid
      return true;
    } catch (e: any) {
      setError(e.errors[0].message); // Set the error message from Zod
      return false;
    }
  };

  const onSubmit = async () => {
    if (!email) {
      toast.error("Invalid email address. Please try again.");
      return;
    }

    // Validate both passwords
    if (!validatePassword(password)) return;

    // Check if passwords match
    if (password !== confirmPassword) {
      setMatchError("Passwords do not match.");
      return;
    }
    setMatchError(null); // Clear mismatch error

    setLoading(true);

    try {
      const response = await axiosInstance.post("/reset/admin/reset-password", {
        email,
        password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-14 mt-5">
      <div className="flex flex-col w-full max-w-md gap-2">
        <PasswordInput
          placeholder="New Password"
          className="w-full"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
            if (e.target.value === confirmPassword) {
              setMatchError(null);
            }
          }}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

        <PasswordInput
          placeholder="Confirm New Password"
          className="w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {matchError && <p className="text-red-600 text-sm mt-1">{matchError}</p>}
      </div>

      <Button
        disabled={loading || !!error || !!matchError}
        className="w-[120px]"
        onClick={onSubmit}
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 size={20} className="animate-spin mr-2" />
            Updating
          </div>
        ) : (
          "Update"
        )}
      </Button>
    </div>
  );
};

export default ResetPasswordComponent;
