"use client";

import type React from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent} from "@/components/ui/card";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart2,
  Brain,
  Building2,
  CheckCircle,
  Shield,
  Users,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExamProcessAnimation } from "@/components/animations/exam-process-animation";
import { AnimatedText } from "@/components/animations/animated-text";
import { FloatingElement } from "@/components/animations/floating-element";
import { ParallaxBackground } from "@/components/animations/parallax-background";

export default function LoginPage() {
  // Refs for animation targets
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Initialize animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Header animation
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }

    // Hero section animations
    if (heroRef.current) {
      const heroTl = gsap.timeline();
      const h1Element = heroRef.current.querySelector("h1");
      const pElement = heroRef.current.querySelector("p");
      const aElements = heroRef.current.querySelectorAll("a");
      const relativeElement = heroRef.current.querySelector(".relative");

      if (h1Element) {
        heroTl.from(h1Element, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      if (pElement) {
        heroTl.from(
          pElement,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );
      }

      if (aElements.length) {
        heroTl.from(
          aElements,
          {
            y: 20,
            opacity: 0,
            stagger: 0.2,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        );
      }

      if (relativeElement) {
        heroTl.from(
          relativeElement,
          {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.6"
        );
      }
    }

    // Features section animations
    if (featuresRef.current) {
      const h2Element = featuresRef.current.querySelector("h2");
      const cardElements = featuresRef.current.querySelectorAll(".card");

      if (h2Element) {
        gsap.from(h2Element, {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
        });
      }

      if (cardElements.length) {
        gsap.from(cardElements, {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 70%",
          },
          y: 50,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    }

    // Benefits section animations
    if (benefitsRef.current) {
      const h2Element = benefitsRef.current.querySelector("h2");
      const benefitItems =
        benefitsRef.current.querySelectorAll(".benefit-item");

      if (h2Element) {
        gsap.from(h2Element, {
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
        });
      }

      if (benefitItems.length) {
        gsap.from(benefitItems, {
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 70%",
          },
          x: (index) => (index % 2 === 0 ? -50 : 50),
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    }

    // Testimonials section animations
    if (testimonialsRef.current) {
      const testimonialCards =
        testimonialsRef.current.querySelectorAll(".testimonial-card");

      if (testimonialCards.length) {
        gsap.from(testimonialCards, {
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 70%",
          },
          y: 80,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    }

    // CTA section animations
    if (ctaRef.current) {
      const ctaChildren = ctaRef.current.children;

      if (ctaChildren.length) {
        gsap.from(ctaChildren, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
          },
          y: 30,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    }

    ScrollTrigger.refresh();
    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">INSA Personality Testing</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Benefits
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Login
            </Link>
            <Button asChild>
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted relative"
      >
        {/* Add decorative floating elements */}
        <div className="absolute top-20 left-[10%] hidden lg:block">
          <FloatingElement duration={4} distance={20}>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary/40" />
            </div>
          </FloatingElement>
        </div>
        <div className="absolute bottom-20 right-[15%] hidden lg:block">
          <FloatingElement duration={5} distance={15} delay={1}>
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary/30" />
            </div>
          </FloatingElement>
        </div>
        <div className="absolute top-1/2 right-[5%] hidden lg:block">
          <FloatingElement duration={3.5} distance={10} delay={0.5}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary/40" />
            </div>
          </FloatingElement>
        </div>

        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <AnimatedText
                  text="Unlock Your Organization's Potential"
                  tag="h1"
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                  animation="slideUp"
                />
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover the power of personality insights with INSA's
                  comprehensive testing platform. Enhance team dynamics, improve
                  hiring decisions, and boost organizational performance.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Login to Platform</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px]">
                <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="h-32 w-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Features
              </div>
              <AnimatedText
                text="Comprehensive Testing Platform"
                tag="h2"
                className="text-3xl font-bold tracking-tighter sm:text-5xl"
                animation="fadeIn"
              />
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform offers a suite of scientifically validated
                personality assessments designed for the modern workplace.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Brain className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Multiple Test Types</h3>
                <p className="text-sm text-muted-foreground">
                  MBTI-style, Big Five, RIASEC, and Enneagram assessments
                  available.
                </p>
              </CardContent>
            </Card>
            <Card className="card">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <BarChart2 className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed reports with actionable insights for individuals and
                  teams.
                </p>
              </CardContent>
            </Card>
            <Card className="card">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Multi-level Access</h3>
                <p className="text-sm text-muted-foreground">
                  Tailored dashboards for organizations, branches, and
                  employees.
                </p>
              </CardContent>
            </Card>
            <Card className="card">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security with role-based access controls.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <StatsSection /> */}

      {/* Benefits Section */}
      <section
        ref={benefitsRef}
        id="benefits"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted relative overflow-hidden"
      >
        <ParallaxBackground className="absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <pattern
                  id="grid"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 8 0 L 0 0 0 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-primary"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </ParallaxBackground>

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                Benefits
              </div>
              <AnimatedText
                text="Why Choose INSA?"
                tag="h2"
                className="text-3xl font-bold tracking-tighter sm:text-5xl"
                animation="slideUp"
              />
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform delivers tangible benefits for organizations of all
                sizes.
              </p>
            </div>
          </div>
          <div className="grid gap-6 py-12 lg:grid-cols-3">
            <div className="flex flex-col items-start space-y-4 benefit-item">
              <CheckCircle className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Improved Team Dynamics</h3>
              <p className="text-muted-foreground">
                Understand how different personality types interact and optimize
                team composition for better collaboration and productivity.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4 benefit-item">
              <CheckCircle className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Enhanced Hiring Decisions</h3>
              <p className="text-muted-foreground">
                Make more informed recruitment choices by matching candidates'
                personality profiles with role requirements and team dynamics.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4 benefit-item">
              <CheckCircle className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Personalized Development</h3>
              <p className="text-muted-foreground">
                Tailor training and development programs based on individual
                strengths, weaknesses, and learning styles.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4 benefit-item">
              <CheckCircle className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Conflict Resolution</h3>
              <p className="text-muted-foreground">
                Address interpersonal conflicts by understanding the underlying
                personality differences and communication styles.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4 benefit-item">
              <CheckCircle className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Leadership Development</h3>
              <p className="text-muted-foreground">
                Identify and nurture leadership potential based on personality
                traits and behavioral tendencies.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4 benefit-item">
              <CheckCircle className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Data-Driven Culture</h3>
              <p className="text-muted-foreground">
                Foster a culture of continuous improvement with regular
                assessments and actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        id="testimonials"
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Testimonials
              </div>
              <AnimatedText
                text="Trusted by Organizations"
                tag="h2"
                className="text-3xl font-bold tracking-tighter sm:text-5xl"
                animation="slideRight"
              />
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See what our clients have to say about their experience with
                INSA Personality Testing.
              </p>
            </div>
          </div>
          <div className="grid gap-6 py-12 lg:grid-cols-3">
            <Card className="testimonial-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Building2 className="h-10 w-10 rounded-full bg-muted p-2" />
                  <div>
                    <h3 className="font-bold">Ministry of Education</h3>
                    <p className="text-sm text-muted-foreground">
                      Government Organization
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "INSA's personality testing platform has transformed how we
                  approach team building and leadership development across our
                  organization. The insights gained have been invaluable."
                </p>
              </CardContent>
            </Card>
            <Card className="testimonial-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Building2 className="h-10 w-10 rounded-full bg-muted p-2" />
                  <div>
                    <h3 className="font-bold">Commercial Bank of Ethiopia</h3>
                    <p className="text-sm text-muted-foreground">
                      Financial Institution
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "The platform's multi-level access system perfectly suits our
                  organizational structure. Branch managers can oversee their
                  teams while our HR department maintains a comprehensive view."
                </p>
              </CardContent>
            </Card>
            <Card className="testimonial-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Building2 className="h-10 w-10 rounded-full bg-muted p-2" />
                  <div>
                    <h3 className="font-bold">Ethiopian Airlines</h3>
                    <p className="text-sm text-muted-foreground">
                      Aviation Industry
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "We've seen a 30% improvement in team cohesion since
                  implementing INSA's personality assessments. The detailed
                  reports and actionable recommendations are exceptional."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <AnimatedText
                text="Ready to Get Started?"
                tag="h2"
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                animation="fadeIn"
              />
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Transform your organization with data-driven personality
                insights. Request a demo today.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Process Animation Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                How It Works
              </div>
              <AnimatedText
                text="The Assessment Journey"
                tag="h2"
                className="text-3xl font-bold tracking-tighter sm:text-5xl"
                animation="slideLeft"
              />
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Follow the journey from test invitation to personalized
                insights.
              </p>
            </div>
          </div>

          {/* Interactive animation for larger screens */}
          <div className="hidden md:block">
            <ExamProcessAnimation />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} INSA Personality Testing. All rights
              reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
