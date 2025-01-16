import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input"
import { LoginFormSchema } from "@/schemas/login-form-schema";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, login, selectLoginStatus } from "@/redux/useSlice";
import { AppDispatch } from "@/provider/redux-provider";
import { Loader } from "lucide-react";

export function LogInForm() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Select login status from Redux state
  const loginStatus = useSelector(selectLoginStatus);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    dispatch(login(values)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        dispatch(fetchUserById()).then((fetchAction) => {
          if (fetchAction.meta.requestStatus === "fulfilled") {
            toast.success("Login and profile load successful!");
            navigate("/");
          } else {
            toast.error("Failed to load user profile");
          }
        });
      } else if (action.meta.requestStatus === "rejected") {
        toast.error(action.payload?.msg || "An error occurred");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 md:space-y-3 w-full"
      >
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
        <Button
          type="button"
          variant="ghost"
          className="w-full text-sm underline flex items-center justify-end hover:bg-transparent"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password
        </Button>
        <Button type="submit" className="w-full" disabled={loginStatus === "loading"}>
          {loginStatus === "loading" ? "Loading" : "Sign In"}
          {loginStatus === "loading" && (
            <Loader className="ml-2 size-5 shrink-0 animate-spin" />
          )}
        </Button>
      </form>
    </Form>
  );
}
