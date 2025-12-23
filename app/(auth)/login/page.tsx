"use client";

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { Google } from "@mui/icons-material";
// import { useUser } from "@/context/UserContext";

const LoginPage = () => {
  const router = useRouter();
  // const { fetchUser } = useUser();
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full py-6 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            // disabled={isLoading}
            type="button"
            onPress={() => {
              router.push(`${process.env.NEXT_PUBLIC_CLEARINGHOUSE_URL}/auth/login/google`);
            }}
          >
            <div className="flex gap-3 items-center justify-center">
              <Google fontSize="medium" />
              <span>Continue with Google</span>
            </div>
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
