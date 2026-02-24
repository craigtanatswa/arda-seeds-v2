import type { Metadata } from "next"
import GrowerRegistrationForm from "@/components/grower-registration-form"

export const metadata: Metadata = {
  title: "Grower Registration | ARDA Seeds",
  description:
    "Register as a grower with ARDA Seeds. Join our network of farmers and gain access to premium seed varieties and agronomic support.",
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Grower Registration</h1>
        <p className="text-gray-600 mb-8">
          Join our network of growers and gain access to premium seed varieties, agronomic support, and exclusive
          offers. Fill out the form below to register.
        </p>

        <GrowerRegistrationForm />
      </div>
    </div>
  )
}
