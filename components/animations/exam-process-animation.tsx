"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileText, ClipboardCheck, BarChart2, Award } from "lucide-react";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ExamProcessAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const steps = containerRef.current.querySelectorAll(".exam-step");
    const icons = containerRef.current.querySelectorAll(".step-icon");
    const lines = containerRef.current.querySelectorAll(".connector-line");
    const celebrations = containerRef.current.querySelectorAll(".celebration");

    // Set initial states
    gsap.set(steps, { opacity: 0, y: 20 });
    gsap.set(icons, { scale: 0.5, opacity: 0 });
    gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(celebrations, { scale: 0, opacity: 0 });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 100%",
        end: "bottom+=100% bottom",
        scrub: 0.5,
        toggleActions: "play none none reverse",
      },
    });

    // Animate each step
    steps.forEach((step, index) => {
      // First step appears immediately
      if (index === 0) {
        tl.to(step, { opacity: 1, y: 0, duration: 0.5 }, 0);
        tl.to(icons[index], { scale: 1, opacity: 1, duration: 0.5 }, 0);
      } else {
        // Animate connector line before the step appears
        tl.to(lines[index - 1], { scaleX: 1, duration: 0.5 }, index * 0.5);

        // Then animate the step
        tl.to(step, { opacity: 1, y: 0, duration: 0.5 }, index * 0.5 + 0.3);
        tl.to(
          icons[index],
          { scale: 1, opacity: 1, duration: 0.5 },
          index * 0.5 + 0.3
        );
      }
    });

    // Final celebration animation
    tl.to(
      celebrations,
      { scale: 1.2, opacity: 1, duration: 0.5, stagger: 0.1 },
      steps.length * 0.5
    );

    // Store timeline for cleanup
    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative py-12">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start max-w-5xl mx-auto">
        {/* Step 1: Receive Invitation */}
        <div className="exam-step relative flex flex-col items-center mb-12 md:mb-0 w-full md:w-1/4">
          <div className="step-icon bg-primary/10 p-4 rounded-full mb-4 z-10">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Receive Invitation</h3>
            <p className="text-sm text-muted-foreground">
              Employees receive a personalized email invitation to take the
              assessment.
            </p>
          </div>

          {/* Connector line */}
          <div className="connector-line hidden md:block absolute top-12 left-[50%] h-1 bg-primary/50 w-full"></div>
        </div>

        {/* Step 2: Take the Test */}
        <div className="exam-step relative flex flex-col items-center mb-12 md:mb-0 w-full md:w-1/4">
          <div className="step-icon bg-primary/10 p-4 rounded-full mb-4 z-10">
            <ClipboardCheck className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Take Assessment</h3>
            <p className="text-sm text-muted-foreground">
              Complete the personality assessment through our intuitive
              interface.
            </p>
          </div>

          {/* Connector line */}
          <div className="connector-line hidden md:block absolute top-12 left-[50%] h-1 bg-primary/50 w-full"></div>
        </div>

        {/* Step 3: Processing Results */}
        <div className="exam-step relative flex flex-col items-center mb-12 md:mb-0 w-full md:w-1/4">
          <div className="step-icon bg-primary/10 p-4 rounded-full mb-4 z-10">
            <BarChart2 className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Processing Results</h3>
            <p className="text-sm text-muted-foreground">
              Our algorithms analyze responses to generate accurate personality
              profiles.
            </p>
          </div>

          {/* Connector line */}
          <div className="connector-line hidden md:block absolute top-12 left-[50%] h-1 bg-primary/50 w-full"></div>
        </div>

        {/* Step 4: Receive Results */}
        <div className="exam-step relative flex flex-col items-center w-full md:w-1/4">
          <div className="step-icon bg-primary/10 p-4 rounded-full mb-4 z-10">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Receive Insights</h3>
            <p className="text-sm text-muted-foreground">
              Access comprehensive reports with personalized insights and
              strengths.
            </p>
            <div className="celebration mt-4 flex justify-center space-x-2">
              <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
              <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
              <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
