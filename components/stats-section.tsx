"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Counter } from "@/components/animations/counter";
import { Users, CheckCircle, Building2, Brain } from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !cardsRef.current ||
      typeof window === "undefined"
    )
      return;

    const cards = cardsRef.current.querySelectorAll(".stat-card");

    gsap.from(cards, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 md:py-24 lg:py-32 bg-background"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Impact
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Proven Results
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform has helped organizations across Ethiopia achieve
              measurable improvements.
            </p>
          </div>
        </div>
        <div
          ref={cardsRef}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="stat-card">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Users className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold">Employees Assessed</h3>
              <p className="text-4xl font-bold mt-2">
                <Counter end={25000} suffix="+" />
              </p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Building2 className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold">Organizations</h3>
              <p className="text-4xl font-bold mt-2">
                <Counter end={120} suffix="+" />
              </p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Brain className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold">Tests Completed</h3>
              <p className="text-4xl font-bold mt-2">
                <Counter end={75000} suffix="+" />
              </p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <CheckCircle className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold">Satisfaction Rate</h3>
              <p className="text-4xl font-bold mt-2">
                <Counter end={98} suffix="%" />
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
