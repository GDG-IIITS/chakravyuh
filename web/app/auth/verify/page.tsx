import { notFound } from "next/navigation";

async function verifyEmail(token: string) {
  // Replace this URL with your actual API endpoint
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to verify email");
  }

  return response.json();
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    notFound();
  }

  try {
    const result = await verifyEmail(token);

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-green-600">
            Email Verified Successfully
          </h1>
          <p className="text-gray-600">
            {result.message ||
              "Your email has been verified. You can now log in to your account."}
          </p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Email Verification Failed
          </h1>
          <p className="text-gray-600">
            We couldn't verify your email. The link may have expired or is
            invalid.
          </p>
        </div>
      </div>
    );
  }
}
