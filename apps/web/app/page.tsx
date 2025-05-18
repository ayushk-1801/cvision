"use client";

import HomeNavbar from "@/components/Home-Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, ClipboardCheck, FileText, Search, Sparkles, Target, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export default async function IndexPage() {

  const handleRecruiterClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_RECRUITER_URL}/signup`;
  };

  const handleCandidateClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_CANDIDATE_URL}/signup`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-700 via-purple-920 to-violet-500 bg-[length:400%_400%] animate-gradient py-30 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-100 h-70">
              <Image
                src="/logo.svg"
                alt="CVision Logo"
                fill
                className="object-contai scale-200"
              />
            </div>
            <div className="w-162 h-1 bg-white my-8" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              AI-Powered Resume Optimiser & Recruitment Solution
            </h1>
            <p className="text-xl md:text-2xl mb-16 text-blue-100 max-w-2xl">
              Get ways to optimise it to get great opportunities using our advanced CV analysis and candidate matching platform.
            </p>
            <p className="text-xl font-bold text-blue-100 max-w-2xl">
              who are you?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 my-8">
              <Button
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-6"
                onClick={handleRecruiterClick}
              >
                Recruiter
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-blue-600 text-lg px-8 py-6 bg-transparent hover:text-white"
                onClick={handleCandidateClick}
              >
                Job Seeker
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-30 bg-gradient-to-b from-transparent to-white"></div>
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-blue-50 p-6 rounded-xl">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Resume Suggestions</h3>
              <p className="text-gray-600">
              Get resume score along with suggestions to improve your content, formatting, and keyword usage.
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
            What we provide?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Recruiters */}
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-6 text-blue-700">
                For Recruiters
              </h3>
              <div className="w-full md:w-1/2 flex items-center justify-center">
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
              </div>
              <Button className="mt-8 bg-blue-700 hover:bg-blue-800 w-full py-6" onClick={handleRecruiterClick}>
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
                    <ClipboardCheck className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Improvement Suggestions</h4>
                    <p className="text-gray-600">
                      Receive clear, actionable suggestions to enhance structure, wording, and impact.
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
              <Button className="mt-8 bg-indigo-700 hover:bg-indigo-800 w-full py-6" onClick={handleCandidateClick}>
                Find Jobs <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 bg-gray-50">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-r from-indigo-700 via-purple-920 to-violet-500 bg-[length:400%_400%] animate-gradient z-0"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            User Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow flex flex-col h-full">
              <p className="text-gray-600 mb-4 flex-grow">
                "CVision helped me refine my resume with personalized suggestions and improvements. After implementing the feedback, I landed more interviews and eventually secured a great position!"
              </p>
              <div className="mt-auto flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-200 mr-3"></div>
                <div>
                  <p className="font-medium">Ananya Roy</p>
                  <p className="text-sm text-gray-500">Product Analyst</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex flex-col h-full">
              <p className="text-gray-600 mb-4 flex-grow">
                "CVision cut our hiring time in half and improved the quality of
                our candidates. The AI matching is incredibly accurate."
              </p>
              <div className="mt-auto flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-200 mr-3"></div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">HR Director, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex flex-col h-full">
              <p className="text-gray-600 mb-4 flex-grow">
                "I found my dream job through CVision. The platform suggested
                positions that perfectly matched my skills and experience."
              </p>
              <div className="flex items-center mt-auto">
                <div className="w-10 h-10 rounded-full bg-blue-200 mr-3"></div>
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex flex-col h-full">
              <p className="text-gray-600 mb-4">
                "The detailed CV analysis helped us understand our candidates
                better and make more informed hiring decisions."
              </p>
              <div className="flex items-center mt-auto">
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
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-gray-900"></div>
      </section>

      {/* CTA */}
      {/* <section className="pt-16 bg-gradient-to-r from-indigo-700 via-purple-920 to-violet-500 bg-[length:400%_400%] animate-gradient text-white"> */}
        {/* <div className="max-w-7xl mx-auto pt-4 text-center"> */}
          {/* <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of companies and job seekers using CVision to make
            better matches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6"
              onClick={handleRecruiterClick}
            >
              For Recruiters
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-blue-600 text-lg px-8 py-6 bg-transparent hover:text-white"
              onClick={handleCandidateClick}
            >
              For Job Seekers
              
            </Button>
          </div> */}
        {/* </div> */}
        {/* <div className="bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-gray-900"></div> */}
      {/* </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">CVision</h3>
              <p className="text-sm">
              Get ways to optimise it to get great opportunities using our advanced <br/>CV analysis and candidate 
              <br/>matching platform.
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
                <li>Get Resume Suggestions</li>
                <li>Upload CV and find Jobs</li>
                <li>Career Advice</li>
                <li>Success Stories</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">More</h3>
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
