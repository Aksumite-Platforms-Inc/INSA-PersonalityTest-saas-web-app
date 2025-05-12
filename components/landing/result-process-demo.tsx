"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText, Users, BarChart3 } from "lucide-react";

export default function ResultsProcessDemo() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeTab, setActiveTab] = useState("individual");

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Results Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore how our platform presents personality test results and
            insights at individual and team levels.
          </p>
        </motion.div>

        <div ref={ref} className="max-w-6xl mx-auto">
          <Tabs
            defaultValue="individual"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="individual">Individual Results</TabsTrigger>
                <TabsTrigger value="team">Team Insights</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="individual" className="mt-0">
              <motion.div
                className="bg-background rounded-xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold">
                        Individual Profile
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          Personality Type
                        </h4>
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">The Analyst</span>
                            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                              INTJ
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Strategic thinkers with a focus on innovation and
                            long-term planning. Highly analytical and
                            independent.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-2">Key Traits</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Introversion</span>
                              <span>85%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full">
                              <div className="h-2 bg-primary rounded-full w-[85%]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Intuition</span>
                              <span>90%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full">
                              <div className="h-2 bg-primary rounded-full w-[90%]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Thinking</span>
                              <span>75%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full">
                              <div className="h-2 bg-primary rounded-full w-[75%]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Judging</span>
                              <span>80%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full">
                              <div className="h-2 bg-primary rounded-full w-[80%]"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Results
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-1/2 bg-muted p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
                        <BarChart3 className="h-6 w-6 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-semibold">
                        Detailed Analysis
                      </h3>
                    </div>

                    <div className="relative h-96 rounded-lg overflow-hidden border border-border mb-6">
                      <Image
                        src="/placeholder.svg?height=384&width=500"
                        alt="Personality chart"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background/90 p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-center mb-4">
                            Personality Radar Chart
                          </h4>
                          <div className="w-64 h-64 relative">
                            {/* Placeholder for radar chart */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-full rounded-full border-2 border-primary opacity-30"></div>
                              <div className="absolute w-3/4 h-3/4 rounded-full border-2 border-primary opacity-50"></div>
                              <div className="absolute w-1/2 h-1/2 rounded-full border-2 border-primary opacity-70"></div>
                              <div className="absolute w-1/4 h-1/4 rounded-full border-2 border-primary opacity-90"></div>

                              {/* Chart points */}
                              <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-full"></div>
                              <div className="absolute top-1/2 left-[15%] transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
                              <div className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-full"></div>
                              <div className="absolute top-1/2 right-[15%] transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>

                              {/* Lines connecting points */}
                              <div className="absolute inset-0">
                                <svg
                                  className="w-full h-full"
                                  viewBox="0 0 100 100"
                                >
                                  <polygon
                                    points="50,15 15,50 50,85 85,50"
                                    fill="rgba(99,102,241,0.2)"
                                    stroke="#6366f1"
                                    strokeWidth="1"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Recommendations</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            <span className="font-medium">
                              Work Environment:
                            </span>{" "}
                            Thrive in quiet, organized spaces that allow for
                            focused work with minimal interruptions.
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <span className="font-medium">Communication:</span>{" "}
                            Be more explicit about your thoughts and ideas, as
                            others may not follow your intuitive leaps.
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-900">
                          <p className="text-sm text-purple-800 dark:text-purple-200">
                            <span className="font-medium">Team Dynamics:</span>{" "}
                            Partner with more extroverted colleagues for
                            presentations and client interactions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="team" className="mt-0">
              <motion.div
                className="bg-background rounded-xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold">
                        Team Composition
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          Team Profile
                        </h4>
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Marketing Team</span>
                            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                              12 Members
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            A diverse team with a good balance of analytical and
                            creative personalities. Strong in innovation but may
                            need support in execution.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          Personality Distribution
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Analytical Types</span>
                              <span>40%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full">
                              <div className="h-2 bg-primary rounded-full w-[40%]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Creative Types</span>
                              <span>35%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full">
                              <div className="h-2 bg-purple-600 rounded-full w-[35%]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Diplomatic Types</span>
                              <span>15%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full">
                              <div className="h-2 bg-green-600 rounded-full w-[15%]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Sentinel Types</span>
                              <span>10%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full">
                              <div className="h-2 bg-yellow-600 rounded-full w-[10%]"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Analysis
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-1/2 bg-muted p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-4">
                        <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-300" />
                      </div>
                      <h3 className="text-2xl font-semibold">Team Dynamics</h3>
                    </div>

                    <div className="relative h-96 rounded-lg overflow-hidden border border-border mb-6">
                      <Image
                        src="/placeholder.svg?height=384&width=500"
                        alt="Team dynamics chart"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background/90 p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-center mb-4">
                            Team Interaction Map
                          </h4>
                          <div className="w-64 h-64 relative">
                            {/* Placeholder for team interaction visualization */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  Core
                                </span>
                              </div>

                              {/* Team members */}
                              <div className="absolute top-1/4 left-1/4 w-10 h-10 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center">
                                <span className="text-xs">A</span>
                              </div>
                              <div className="absolute top-1/5 right-1/3 w-10 h-10 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center">
                                <span className="text-xs">B</span>
                              </div>
                              <div className="absolute bottom-1/4 left-1/3 w-10 h-10 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center">
                                <span className="text-xs">C</span>
                              </div>
                              <div className="absolute bottom-1/3 right-1/4 w-10 h-10 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center">
                                <span className="text-xs">D</span>
                              </div>

                              {/* Connection lines */}
                              <svg
                                className="absolute inset-0 w-full h-full"
                                viewBox="0 0 100 100"
                              >
                                <line
                                  x1="50"
                                  y1="50"
                                  x2="30"
                                  y2="30"
                                  stroke="#d8b4fe"
                                  strokeWidth="1"
                                />
                                <line
                                  x1="50"
                                  y1="50"
                                  x2="70"
                                  y2="25"
                                  stroke="#86efac"
                                  strokeWidth="1"
                                />
                                <line
                                  x1="50"
                                  y1="50"
                                  x2="30"
                                  y2="70"
                                  stroke="#fef08a"
                                  strokeWidth="1"
                                />
                                <line
                                  x1="50"
                                  y1="50"
                                  x2="70"
                                  y2="65"
                                  stroke="#fecaca"
                                  strokeWidth="1"
                                />
                                <line
                                  x1="30"
                                  y1="30"
                                  x2="70"
                                  y2="25"
                                  stroke="#e9d5ff"
                                  strokeWidth="1"
                                  strokeDasharray="2"
                                />
                                <line
                                  x1="30"
                                  y1="70"
                                  x2="70"
                                  y2="65"
                                  stroke="#fef9c3"
                                  strokeWidth="1"
                                  strokeDasharray="2"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">
                        Team Recommendations
                      </h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <span className="font-medium">Strengths:</span>{" "}
                            Strong in ideation and strategic thinking. Leverage
                            analytical members for planning phases.
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <span className="font-medium">Gaps:</span> Need more
                            detail-oriented members for implementation. Consider
                            pairing analytical and sentinel types.
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            <span className="font-medium">Communication:</span>{" "}
                            Implement structured feedback sessions to bridge
                            understanding between different personality types.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
