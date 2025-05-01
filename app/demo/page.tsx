"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
  ArrowDown,
  ArrowRight,
  Brain,
  CheckCircle,
  ChevronRight,
  Shield,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Sample personality test questions
const questions = [
  {
    id: 1,
    text: "I prefer working in teams rather than independently.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree",
    ],
  },
  {
    id: 2,
    text: "I enjoy taking on leadership roles in group settings.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree",
    ],
  },
  {
    id: 3,
    text: "I consider myself more analytical than creative.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree",
    ],
  },
];

// Sample personality traits
const traits = [
  { name: "Extraversion", value: 75 },
  { name: "Conscientiousness", value: 85 },
  { name: "Openness", value: 60 },
  { name: "Agreeableness", value: 70 },
  { name: "Neuroticism", value: 40 },
];

// Sample personality types
const personalityTypes = [
  { type: "ENTJ", label: "The Commander", color: "bg-burgundy" },
  { type: "INFP", label: "The Mediator", color: "bg-navy" },
  { type: "ISTP", label: "The Virtuoso", color: "bg-slate" },
  { type: "ENFJ", label: "The Protagonist", color: "bg-gold" },
];

export default function LandingPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Refs for sections
  const containerRef = useRef(null);
  const introRef = useRef(null);
  const questionRef = useRef(null);
  const resultsRef = useRef(null);
  const insightsRef = useRef(null);
  const ctaRef = useRef(null);

  // Refs for animations
  const questionCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const answerOptionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const traitBarsRef = useRef<(HTMLDivElement | null)[]>([]);
  const radarChartRef = useRef(null);
  const personalityBadgesRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollIndicatorRef = useRef(null);
  const progressIndicatorRef = useRef(null);
  const brainNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const brainConnectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Brain visualization state
  const [brainData, setBrainData] = useState<null | {
    nodes: { x: number; y: number }[];
    connections: { from: number; to: number }[];
  }>(null);

  // // Initialize GSAP animations
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        !introRef.current ||
        !questionRef.current ||
        !resultsRef.current ||
        !insightsRef.current ||
        !ctaRef.current
      ) {
        return;
      }

      // ✅ Place all your ScrollTrigger / gsap setup logic here
      // Clear any existing ScrollTriggers
      ScrollTrigger.getAll().forEach((t) => t.kill());

      const sections = [
        introRef.current,
        questionRef.current,
        resultsRef.current,
        insightsRef.current,
        ctaRef.current,
      ];

      // Create a timeline for each section
      sections.forEach((section, index) => {
        const nextSection = sections[index + 1];
        if (!nextSection) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onEnter: () => setCurrentSection(index),
          onEnterBack: () => setCurrentSection(index),
        });
      });

      // Progress indicator
      gsap.to(progressIndicatorRef.current, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      // Scroll indicator animation
      gsap.to(scrollIndicatorRef.current, {
        opacity: 1,
        duration: 1,
        delay: 1,
      });

      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top+=100",
          end: "top top",
          scrub: true,
        },
      });

      // Intro section animations
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      introTl
        .from(".hero-title", { opacity: 0, y: 100, duration: 1 })
        .from(".hero-description", { opacity: 0, y: 50, duration: 1 }, "-=0.5")
        .from(".hero-button", { opacity: 0, y: 30, duration: 1 }, "-=0.5")
        .from(".hero-image", { opacity: 0, scale: 0.8, duration: 1 }, "-=0.7");

      // Brain animation
      if (brainNodesRef.current.length > 0) {
        // Create brain nodes animation
        brainNodesRef.current.forEach((node, index) => {
          gsap.fromTo(
            node,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: index * 0.05,
              scrollTrigger: {
                trigger: introRef.current,
                start: "top center",
                end: "center center",
                scrub: 0.5,
              },
            }
          );
        });

        // Create brain connections animation
        brainConnectionsRef.current.forEach((connection, index) => {
          gsap.fromTo(
            connection,
            { width: 0, opacity: 0 },
            {
              width: "100%",
              opacity: 0.6,
              duration: 0.8,
              delay: index * 0.03 + 0.5,
              scrollTrigger: {
                trigger: introRef.current,
                start: "top center",
                end: "center center",
                scrub: 0.5,
              },
            }
          );
        });
      }

      // Question section animations
      questions.forEach((_, index) => {
        const questionCard = questionCardsRef.current[index];
        const options = answerOptionsRef.current.filter(
          (opt) => opt !== null && opt.dataset?.questionId === `${index + 1}`
        );

        const questionTl = gsap.timeline({
          scrollTrigger: {
            trigger: questionCard,
            start: "top bottom-=100",
            end: "center center",
            scrub: 0.5,
          },
        });

        questionTl.fromTo(
          questionCard,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.5 }
        );

        options.forEach((option, optIndex) => {
          questionTl.fromTo(
            option,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.3 },
            "-=0.2"
          );
        });
      });

      // Results section animations
      const resultsTl = gsap.timeline({
        scrollTrigger: {
          trigger: resultsRef.current,
          start: "top bottom",
          end: "center center",
          scrub: 0.5,
        },
      });

      resultsTl
        .from(".results-title", { opacity: 0, y: 50, duration: 0.5 })
        .from(
          ".results-description",
          { opacity: 0, y: 30, duration: 0.5 },
          "-=0.3"
        );

      // Trait bars animation
      traits.forEach((_, index) => {
        const bar = traitBarsRef.current[index];

        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${traits[index].value}%`,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bar,
              start: "top bottom-=50",
              end: "top center",
              scrub: 0.5,
            },
          }
        );
      });

      // Radar chart animation
      gsap.fromTo(
        radarChartRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: radarChartRef.current,
            start: "top bottom-=100",
            end: "top center",
            scrub: 0.5,
          },
        }
      );

      // Personality badges animation
      personalityBadgesRef.current.forEach((badge, index) => {
        gsap.fromTo(
          badge,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: badge,
              start: "top bottom-=50",
              end: "top center+=100",
              scrub: 0.5,
            },
          }
        );
      });

      // Insights section animations
      const insightsTl = gsap.timeline({
        scrollTrigger: {
          trigger: insightsRef.current,
          start: "top bottom",
          end: "center center",
          scrub: 0.5,
        },
      });

      insightsTl
        .from(".insights-title", { opacity: 0, y: 50, duration: 0.5 })
        .from(
          ".insights-description",
          { opacity: 0, y: 30, duration: 0.5 },
          "-=0.3"
        )
        .from(
          ".insight-card",
          {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.5,
          },
          "-=0.2"
        );

      // CTA section animations
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top bottom",
          end: "center center",
          scrub: 0.5,
        },
      });

      ctaTl
        .from(".cta-title", { opacity: 0, y: 50, duration: 0.5 })
        .from(".cta-description", { opacity: 0, y: 30, duration: 0.5 }, "-=0.3")
        .from(".cta-button", { opacity: 0, y: 20, duration: 0.5 }, "-=0.2")
        .from(
          ".cta-org",
          {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5,
          },
          "-=0.3"
        );

      // Update scroll progress
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setScrollProgress(parseFloat(self.progress.toFixed(2)) * 100);
        },
      });

      // Cleanup
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }, 50);
    return () => clearTimeout(timeout);
  }, []); // delay can be tweaked (e.g., 100ms)

  //   // Wait until all necessary refs are available
  //   if (
  //     !introRef.current ||
  //     !questionRef.current ||
  //     !resultsRef.current ||
  //     !insightsRef.current ||
  //     !ctaRef.current ||
  //     !containerRef.current ||
  //     !scrollIndicatorRef.current ||
  //     !progressIndicatorRef.current
  //   ) {
  //     return;
  //   }
  //
  // }, []);

  // Generate brain visualization data only on client
  useEffect(() => {
    const nodeCount = 20;
    // Use a deterministic pseudo-random generator for demo, or just a fixed pattern
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      x: 40 + 120 * Math.cos((2 * Math.PI * i) / nodeCount) + Math.sin(i) * 20,
      y: 40 + 120 * Math.sin((2 * Math.PI * i) / nodeCount) + Math.cos(i) * 20,
    }));
    const connections = [];
    for (let i = 1; i < nodeCount; i++) {
      connections.push({ from: i - 1, to: i });
    }
    setBrainData({ nodes, connections });
  }, []);

  function createBrainVisualization() {
    if (!brainData) return null;
    const { nodes, connections } = brainData;
    return (
      <div className="brain-container relative">
        {connections.map((connection, i) => {
          const from = nodes[connection.from];
          const to = nodes[connection.to];
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          return (
            <div
              key={`connection-${i}`}
              className="brain-connection absolute"
              style={{
                left: `${from.x + 5}px`,
                top: `${from.y + 5}px`,
                width: `${distance}px`,
                height: "2px",
                background: "rgba(180,151,90,0.3)",
                transform: `rotate(${angle}deg)`,
              }}
            />
          );
        })}
        {nodes.map((node, i) => (
          <div
            key={`node-${i}`}
            className="brain-node absolute"
            ref={(el) => {
              brainNodesRef.current[i] = el;
            }}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#B4975A",
              opacity: 0.8,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Progress indicator */}
      <div ref={progressIndicatorRef} className="progress-indicator"></div>

      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} className="scroll-indicator">
        <ArrowDown className="h-8 w-8 text-secondary animate-bounce" />
      </div>

      {/* Header */}
      <header className="fixed top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold">INSA Personality Testing</span>
          </div>
          <Button
            asChild
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Link href="/demo/login">Login</Link>
          </Button>
        </div>
      </header>

      {/* Intro Section */}
      <section ref={introRef} className="section">
        <div className="container px-4 md:px-6 py-24 md:py-32 min-h-screen flex flex-col justify-center">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="hero-title text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Your Team's{" "}
                  <span className="bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent">
                    True Potential
                  </span>
                </h1>
                <p className="hero-description max-w-[600px] text-muted-foreground md:text-xl">
                  INSA's advanced personality testing platform helps government
                  agencies build stronger teams through data-driven insights.
                </p>
              </div>
              <Button
                size="lg"
                className="hero-button bg-secondary text-secondary-foreground hover:bg-secondary/90 group w-fit"
                asChild
              >
                <Link href="#questions">
                  Begin the Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="hero-image relative h-[350px] w-full md:h-[450px] flex items-center justify-center">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-3xl"></div>
              <div className="relative z-10">{createBrainVisualization()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section id="questions" ref={questionRef} className="section bg-muted">
        <div className="container px-4 md:px-6 py-24 md:py-32 min-h-screen flex flex-col justify-center">
          <div className="max-w-3xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Experience the Assessment
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Scroll through sample questions to see how our personality
                testing works
              </p>
            </div>

            <div className="space-y-16">
              {questions.map((question, index) => (
                <Card
                  key={question.id}
                  className="question-card overflow-hidden border-t-4 border-t-secondary/80"
                  ref={(el) => {
                    questionCardsRef.current[index] = el;
                  }}
                >
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Question {question.id} of {questions.length}
                        </span>
                        <span className="text-sm font-medium text-secondary">
                          Personality Assessment
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{question.text}</h3>
                    </div>

                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className="answer-option flex items-center p-3 rounded-md border border-border hover:bg-background/50 transition-colors cursor-pointer"
                          ref={(el) => {
                            if (
                              !answerOptionsRef.current[optIndex + index * 5]
                            ) {
                              answerOptionsRef.current[optIndex + index * 5] =
                                el;
                            }
                            if (el) {
                              el.dataset.questionId = String(question.id);
                            }
                          }}
                        >
                          <div className="w-5 h-5 rounded-full border border-secondary mr-3 flex-shrink-0"></div>
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section ref={resultsRef} className="section">
        <div className="container px-4 md:px-6 py-24 md:py-32 min-h-screen flex flex-col justify-center">
          <div className="text-center mb-12">
            <h2 className="results-title text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Comprehensive Results
            </h2>
            <p className="results-description text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Our platform provides detailed personality insights through
              multiple visualization methods
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Trait Bars */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Personality Traits</h3>
              {traits.map((trait, index) => (
                <div key={trait.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{trait.name}</span>
                    <span>{trait.value}%</span>
                  </div>
                  <div className="h-5 bg-muted rounded-md overflow-hidden">
                    <div
                      className="trait-bar"
                      ref={(el) => {
                        traitBarsRef.current[index] = el;
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Radar Chart */}
            <div
              ref={radarChartRef}
              className="radar-chart flex items-center justify-center"
            >
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Pentagon shape for radar chart */}
                  <polygon
                    points="100,10 190,78 154,190 46,190 10,78"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                  />
                  <polygon
                    points="100,40 160,88 134,170 66,170 40,88"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                  />
                  <polygon
                    points="100,70 130,98 114,150 86,150 70,98"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                  />

                  {/* Data points */}
                  <polygon
                    points="100,25 170,83 140,165 60,165 30,83"
                    fill="rgba(180, 151, 90, 0.3)"
                    stroke="#B4975A"
                    strokeWidth="2"
                  />

                  {/* Labels */}
                  <text
                    x="100"
                    y="5"
                    textAnchor="middle"
                    className="text-xs fill-current"
                  >
                    Extraversion
                  </text>
                  <text
                    x="195"
                    y="78"
                    textAnchor="start"
                    className="text-xs fill-current"
                  >
                    Conscientiousness
                  </text>
                  <text
                    x="154"
                    y="195"
                    textAnchor="middle"
                    className="text-xs fill-current"
                  >
                    Openness
                  </text>
                  <text
                    x="46"
                    y="195"
                    textAnchor="middle"
                    className="text-xs fill-current"
                  >
                    Agreeableness
                  </text>
                  <text
                    x="5"
                    y="78"
                    textAnchor="end"
                    className="text-xs fill-current"
                  >
                    Neuroticism
                  </text>
                </svg>
              </div>
            </div>

            {/* Personality Types */}
            <div className="md:col-span-2 mt-8">
              <h3 className="text-xl font-bold mb-4">
                Personality Type Indicators
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {personalityTypes.map((type, index) => (
                  <div
                    key={type.type}
                    className="personality-badge flex flex-col items-center p-4 rounded-lg border border-border"
                    ref={(el) => {
                      personalityBadgesRef.current[index] = el;
                    }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full ${type.color} flex items-center justify-center mb-2`}
                    >
                      <span className="font-bold text-white">{type.type}</span>
                    </div>
                    <span className="font-medium">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section ref={insightsRef} className="section bg-muted">
        <div className="container px-4 md:px-6 py-24 md:py-32 min-h-screen flex flex-col justify-center">
          <div className="text-center mb-12">
            <h2 className="insights-title text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Actionable Insights
            </h2>
            <p className="insights-description text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Transform personality data into strategic advantages for your
              organization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Team Composition",
                description:
                  "Optimize team structures based on complementary personality traits and working styles.",
                icon: Users,
              },
              {
                title: "Leadership Development",
                description:
                  "Identify and nurture leadership potential based on personality indicators.",
                icon: User,
              },
              {
                title: "Conflict Resolution",
                description:
                  "Understand the root causes of interpersonal conflicts and develop targeted solutions.",
                icon: Shield,
              },
              {
                title: "Strategic Hiring",
                description:
                  "Match candidates to roles based on personality fit and team dynamics.",
                icon: CheckCircle,
              },
              {
                title: "Cognitive Diversity",
                description:
                  "Build teams with diverse thinking styles to enhance problem-solving capabilities.",
                icon: Brain,
              },
              {
                title: "Communication Strategies",
                description:
                  "Develop communication approaches tailored to different personality types.",
                icon: ChevronRight,
              },
            ].map((insight, index) => (
              <Card
                key={index}
                className="insight-card overflow-hidden border-l-4 border-l-secondary"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-2 rounded-full bg-secondary/20">
                      <insight.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-bold">{insight.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="section bg-navy text-white">
        <div className="container px-4 md:px-6 py-24 md:py-32 min-h-screen flex flex-col justify-center">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="cta-title text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to Transform Your Organization?
            </h2>
            <p className="cta-description text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join leading government agencies that are using INSA's personality
              testing platform to build stronger, more effective teams.
            </p>
            <Button
              size="lg"
              className="cta-button bg-secondary text-secondary-foreground hover:bg-secondary/90 group"
              asChild
            >
              <Link href="/demo/login">
                Start Your Assessment
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                "Ministry of Defense",
                "Federal Police",
                "Ministry of Education",
                "Ethiopian Airlines",
              ].map((org, i) => (
                <div key={i} className="cta-org flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                  <span className="text-sm text-white/80">{org}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-secondary" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} INSA Personality Testing. All rights
              reserved.
            </p>
          </div>
          <div className="flex gap-4">
            {["Terms", "Privacy", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-sm text-muted-foreground hover:text-secondary transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
