import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input"; // Adjust the import path as needed
import { SignUpFormSchema } from "@/schemas/sign-up-form-schema";

import { signup } from "@/redux/useSlice";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";

export function SignUpForm() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const signupStatus = useSelector(
    (state: RootState) => state.user.signupStatus
  );

  function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    dispatch(signup(values)).then((action) => {
      if (signup.fulfilled.match(action)) {
        navigate("/login");
        toast.success("Register successful!");
      } else if (signup.rejected.match(action)) {
        console.log("action.payload", action.payload);
        const payload = action.payload as { msg: string };
        toast.error(payload.msg || "An error occurred");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FirstName</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LastName</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="at least 8 characters" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button
          type="button"
          variant="ghost"
          className="w-full text-sm underline flex items-center justify-end hover:bg-transparent"
        >
          Forgt Password
        </Button> */}
        <Button type="submit" className="w-full">
          {signupStatus === "loading" ? "Loading" : "Sign Up"}
          {signupStatus === "loading" && (
            <Loader className="ml-2 size-5 shrink-0 animate-spin" />
          )}
        </Button>
      </form>
    </Form>
  );
}
