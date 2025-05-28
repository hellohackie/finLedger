import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine, Shield, Smartphone, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChartLine className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl font-bold text-gray-900">FinLedger</h1>
            </div>
            <Button asChild>
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Personal
            <span className="text-primary block">Financial Ledger</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track and manage all your financial transactions across multiple platforms. 
            From stocks and mutual funds to UPI payments - keep everything organized in one place.
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-3">
            <a href="/api/login">Get Started</a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to manage your finances
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <ChartLine className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Multi-Platform Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track transactions from Groww, Zerodha, PhonePe, and more - all in one dashboard.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Portfolio Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get detailed insights into your investments and spending patterns with visual charts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Mobile Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access your financial data on any device. Fully responsive design for mobile and desktop.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your financial data is encrypted and stored securely. No third-party access to your information.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to take control of your finances?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust FinLedger with their financial tracking.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-3">
            <a href="/api/login">Start Tracking Today</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <ChartLine className="h-6 w-6 mr-2" />
            <span className="font-semibold">FinLedger</span>
          </div>
          <p className="text-gray-400">
            © 2024 FinLedger. All rights reserved. Manage your finances with confidence.
          </p>
        </div>
      </footer>
    </div>
  );
}
