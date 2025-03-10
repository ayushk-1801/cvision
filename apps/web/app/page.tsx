import HomeNavbar from "@/components/Home-Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, FileText, Search, Users } from "lucide-react";
import Image from "next/image";

export default async function IndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                AI-Powered Recruitment Solution
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Connect top talent with great opportunities using our advanced
                CV analysis and candidate matching platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-6 py-6">
                  For Recruiters
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-blue-600 text-lg px-6 py-6 bg-transparent hover:text-white"
                >
                  For Job Seekers
                </Button>
              </div>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/hero-image.jpeg"
                alt="CV Analysis Platform"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white"></div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Our intelligent matching algorithm analyzes CVs and job descriptions
            to find the perfect fit
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">CV Analysis</h3>
              <p className="text-gray-600">
                Extracts skills, experience, and qualifications from CVs with
                high accuracy
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Match Scoring</h3>
              <p className="text-gray-600">
                Provides detailed match scores with explanations for why
                candidates are a good fit
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Candidate Ranking</h3>
              <p className="text-gray-600">
                Automatically ranks and shortlists candidates based on job
                requirements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How CVision Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Recruiters */}
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-6 text-blue-700">
                For Recruiters
              </h3>
              <ul className="space-y-6 flex-grow">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full">
                    <FileText className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Post Job Openings</h4>
                    <p className="text-gray-600">
                      Create detailed job listings with all requirements and
                      qualifications
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full">
                    <Search className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">
                      AI-Powered Matching
                    </h4>
                    <p className="text-gray-600">
                      Our AI analyzes applications and shortlists the best
                      candidates
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full">
                    <CheckCircle className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">View Match Scores</h4>
                    <p className="text-gray-600">
                      See candidate match scores, detailed CV analysis, and
                      hiring recommendations
                    </p>
                  </div>
                </li>
              </ul>
              <Button className="mt-8 bg-blue-700 hover:bg-blue-800 w-full py-6">
                Start Hiring <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* For Job Seekers */}
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-6 text-indigo-700">
                For Job Seekers
              </h3>
              <ul className="space-y-6 flex-grow">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full">
                    <FileText className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Upload Your CV</h4>
                    <p className="text-gray-600">
                      Upload your resume and let our AI analyze your skills and
                      experience
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full">
                    <Search className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">
                      Discover Opportunities
                    </h4>
                    <p className="text-gray-600">
                      Browse job listings or get AI-suggested matches based on
                      your profile
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full">
                    <Users className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">
                      Apply With Confidence
                    </h4>
                    <p className="text-gray-600">
                      Apply to jobs where your skills and experience are a
                      perfect match
                    </p>
                  </div>
                </li>
              </ul>
              <Button className="mt-8 bg-indigo-700 hover:bg-indigo-800 w-full py-6">
                Find Jobs <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-600 mb-4">
                "CVision cut our hiring time in half and improved the quality of
                our candidates. The AI matching is incredibly accurate."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-200 mr-3"></div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">HR Director, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-600 mb-4">
                "I found my dream job through CVision. The platform suggested
                positions that perfectly matched my skills and experience."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-200 mr-3"></div>
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-600 mb-4">
                "The detailed CV analysis helped us understand our candidates
                better and make more informed hiring decisions."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-200 mr-3"></div>
                <div>
                  <p className="font-medium">Lisa Rodriguez</p>
                  <p className="text-sm text-gray-500">
                    Talent Acquisition Manager
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of companies and job seekers using CVision to make
            better matches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6">
              For Recruiters
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-blue-600 text-lg px-8 py-6 bg-transparent hover:text-white"
            >
              For Job Seekers
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">CVision</h3>
              <p className="text-sm">
                AI-powered recruitment platform connecting top talent with great
                opportunities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">
                For Recruiters
              </h3>
              <ul className="space-y-2 text-sm">
                <li>Post Jobs</li>
                <li>Candidate Matching</li>
                <li>CV Analysis</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">
                For Job Seekers
              </h3>
              <ul className="space-y-2 text-sm">
                <li>Find Jobs</li>
                <li>Upload CV</li>
                <li>Career Advice</li>
                <li>Success Stories</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} CVision. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
