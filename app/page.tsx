import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, Lock } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-3xl">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-primary/10 p-4">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4">Location Auth</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Secure location-based authentication system that keeps your account safe by restricting access to specific geographical areas.
        </p>

        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="p-6 border rounded-lg">
            <Shield className="h-8 w-8 text-primary mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Secure</h3>
            <p className="text-sm text-muted-foreground">
              Advanced encryption and JWT-based authentication
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <MapPin className="h-8 w-8 text-primary mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Location-Based</h3>
            <p className="text-sm text-muted-foreground">
              Access restricted to your allowed geographical area
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <Lock className="h-8 w-8 text-primary mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              Open source and self-hosted for complete control
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">Log In</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
