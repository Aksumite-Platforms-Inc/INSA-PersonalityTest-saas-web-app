"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function TestProcessDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [step1Ref, step1InView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  const [step2Ref, step2InView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  const [step3Ref, step3InView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  const [step4Ref, step4InView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  return (
    <section ref={containerRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience Our Testing Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how easy it is to take a personality test and get valuable
            insights.
          </p>
        </div>

        <div className="relative">
          {/* Progress bar */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 z-0">
            <motion.div
              className="w-full bg-indigo-600 absolute top-0 left-0"
              style={{ height: progress }}
            />
          </div>

          {/* Step 1 */}
          <motion.div
            ref={step1Ref}
            className="relative z-10 flex flex-col md:flex-row items-center mb-24"
            initial={{ opacity: 0 }}
            animate={step1InView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Select Your Test</h3>
              <p className="text-gray-600 mb-6">
                Choose from multiple scientifically validated personality tests
                including OEJTS, Enneagram, Qualtrics, and RIASEC.
              </p>
              <div className="space-y-2">
                {["OEJTS", "Enneagram", "Qualtrics", "RIASEC"].map((test) => (
                  <div key={test} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>{test} Personality Test</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="relative h-64 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src="/placeholder.svg?height=256&width=500"
                  alt="Test selection interface"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-lg mb-2">
                      Test Selection
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        OEJTS Test
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Enneagram Test
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Qualtrics Test
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        RIASEC Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            ref={step2Ref}
            className="relative z-10 flex flex-col md:flex-row-reverse items-center mb-24"
            initial={{ opacity: 0 }}
            animate={step2InView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Answer Questions</h3>
              <p className="text-gray-600 mb-6">
                Respond to a series of carefully designed questions that help
                identify your personality traits, preferences, and work style.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>User-friendly interface</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Progress tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Save and continue later</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="relative h-64 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src="/placeholder.svg?height=256&width=500"
                  alt="Test question interface"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 p-4 rounded-lg shadow-sm w-full max-w-md">
                    <div className="mb-4">
                      <div className="h-2 bg-indigo-100 rounded-full">
                        <div className="h-2 bg-indigo-600 rounded-full w-1/3"></div>
                      </div>
                      <div className="text-right text-sm text-gray-500 mt-1">
                        Question 5 of 15
                      </div>
                    </div>
                    <h4 className="font-semibold text-lg mb-4">
                      I prefer working in teams rather than individually.
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Strongly Disagree
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Disagree
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Neutral
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Agree
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Strongly Agree
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            ref={step3Ref}
            className="relative z-10 flex flex-col md:flex-row items-center mb-24"
            initial={{ opacity: 0 }}
            animate={step3InView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Get Your Results</h3>
              <p className="text-gray-600 mb-6">
                Receive a comprehensive analysis of your personality profile
                with detailed insights into your traits and preferences.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Detailed personality profile</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Visual representations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Downloadable PDF report</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="relative h-64 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src="/placeholder.svg?height=256&width=500"
                  alt="Test results interface"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 p-4 rounded-lg shadow-sm w-full max-w-md">
                    <h4 className="font-semibold text-lg mb-4">
                      Your OEJTS Results
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Extraversion</span>
                          <span>75%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-indigo-600 rounded-full w-3/4"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Agreeableness</span>
                          <span>60%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-indigo-600 rounded-full w-3/5"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Conscientiousness</span>
                          <span>85%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-indigo-600 rounded-full w-4/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            ref={step4Ref}
            className="relative z-10 flex flex-col md:flex-row-reverse items-center"
            initial={{ opacity: 0 }}
            animate={step4InView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Apply Insights</h3>
              <p className="text-gray-600 mb-6">
                Use your personality insights to improve self-awareness, enhance
                team collaboration, and optimize your work environment.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Personalized recommendations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Team compatibility analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Career development guidance</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="relative h-64 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src="/placeholder.svg?height=256&width=500"
                  alt="Insights application interface"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 p-4 rounded-lg shadow-sm w-full max-w-md">
                    <h4 className="font-semibold text-lg mb-4">
                      Recommended Actions
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <h5 className="font-medium text-blue-800">
                          Team Collaboration
                        </h5>
                        <p className="text-sm text-blue-700">
                          Consider taking on leadership roles in group projects
                          to leverage your extraversion.
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <h5 className="font-medium text-purple-800">
                          Work Environment
                        </h5>
                        <p className="text-sm text-purple-700">
                          Create a structured workspace to enhance your
                          conscientiousness trait.
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                        <h5 className="font-medium text-green-800">
                          Career Development
                        </h5>
                        <p className="text-sm text-green-700">
                          Explore roles that require strong analytical thinking
                          and problem-solving.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
