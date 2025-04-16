"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/hooks/use-translation"
import { AlertTriangle, ChevronLeft, ChevronRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Demo test data - this would come from an API in a real app
const testData = {
  mbti: {
    title: "Personality Type Indicator",
    description: "Discover your personality type and how it influences your behavior and interactions with others.",
    questions: [
      {
        id: 1,
        text: "I prefer to spend time in large groups rather than one-on-one interactions.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 2,
        text: "I prefer concrete facts over abstract theories.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 3,
        text: "I make decisions based on logic rather than feelings.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 4,
        text: "I prefer to have a detailed plan rather than be spontaneous.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 5,
        text: "I enjoy being the center of attention.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
    ],
  },
  big5: {
    title: "Five Factor Assessment",
    description:
      "Evaluate your personality across five major dimensions: openness, conscientiousness, extraversion, agreeableness, and neuroticism.",
    questions: [
      {
        id: 1,
        text: "I am curious about many different things.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 2,
        text: "I am always prepared.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 3,
        text: "I get stressed out easily.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 4,
        text: "I am the life of the party.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 5,
        text: "I sympathize with others' feelings.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
    ],
  },
  disc: {
    title: "Behavioral Style Assessment",
    description:
      "Understand your behavioral style in terms of dominance, influence, steadiness, and conscientiousness.",
    questions: [
      {
        id: 1,
        text: "I am assertive and direct in my communication.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 2,
        text: "I enjoy influencing others and being persuasive.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 3,
        text: "I prefer stable and predictable environments.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 4,
        text: "I focus on accuracy and quality in my work.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 5,
        text: "I make quick decisions and take immediate action.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
    ],
  },
  enneagram: {
    title: "Enneagram Profile",
    description: "Identify your core motivations and personality type according to the Enneagram system.",
    questions: [
      {
        id: 1,
        text: "I strive for perfection and have high standards for myself and others.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 2,
        text: "I prioritize helping others and meeting their needs.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 3,
        text: "I am driven to achieve success and recognition.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 4,
        text: "I feel different from others and often focus on what's missing in my life.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: 5,
        text: "I value knowledge and understanding over emotional connection.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
    ],
  },
}

export default function TestPage({ params }: { params: { testId: string } }) {
  const { testId } = params
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const [attemptedFullscreen, setAttemptedFullscreen] = useState(false)

  // Get test data based on testId
  const test = testData[testId as keyof typeof testData]
  if (!test) {
    router.push("/dashboard/employee/test/select")
    return null
  }

  const questions = test.questions
  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  useEffect(() => {
    let mounted = true // Add a mounted flag

    const enterFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement
          .requestFullscreen()
          .then(() => {
            if (mounted) {
              setIsFullscreen(true)
            }
          })
          .catch((err) => console.error("Error attempting to enable fullscreen:", err))
          .finally(() => {
            if (mounted) {
              setAttemptedFullscreen(true)
            }
          }) // Mark that we've tried fullscreen
      } else {
        if (mounted) {
          setAttemptedFullscreen(true) // Mark as attempted even if requestFullscreen is not available
        }
      }
    }

    if (!attemptedFullscreen) {
      enterFullscreen()
    }

    // Exit fullscreen when component unmounts
    return () => {
      mounted = false // Set mounted to false when unmounting
      if (document.fullscreenElement && document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
            if (mounted) {
              setIsFullscreen(false)
            }
          })
          .catch((err) => console.error("Error attempting to exit fullscreen:", err))
      }
    }
  }, [attemptedFullscreen])

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [question.id]: value })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < questions.length) {
      toast({
        title: t("test.incompleteTitle"),
        description: t("test.incompleteDescription"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: t("test.submitSuccess"),
        description: t("test.submitDescription"),
      })

      // Exit fullscreen before navigating
      if (document.fullscreenElement && document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
            router.push("/dashboard/employee/results")
          })
          .catch((err) => {
            console.error("Error attempting to exit fullscreen:", err)
            router.push("/dashboard/employee/results")
          })
      } else {
        router.push("/dashboard/employee/results")
      }
    }, 1500)
  }

  const handleExitTest = () => {
    setExitDialogOpen(true)
  }

  const confirmExit = () => {
    // Exit fullscreen before navigating
    if (document.fullscreenElement && document.exitFullscreen) {
      document
        .exitFullscreen()
        .then(() => {
          router.push("/dashboard/employee/test/select")
        })
        .catch((err) => {
          console.error("Error attempting to exit fullscreen:", err)
          router.push("/dashboard/employee/test/select")
        })
    } else {
      router.push("/dashboard/employee/test/select")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{test.title}</h1>
          <p className="text-muted-foreground">
            {t("test.questionNumber", { current: currentQuestion + 1, total: questions.length })}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleExitTest}>
          <X className="h-5 w-5" />
          <span className="sr-only">{t("test.exit")}</span>
        </Button>
      </header>

      <div className="w-full px-4">
        <Progress value={progress} className="h-2" />
      </div>

      <main className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl"
          >
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">{question.text}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswer} className="space-y-4">
                  {question.options.map((option) => (
                    <motion.div
                      key={option.value}
                      className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                      <Label htmlFor={`option-${option.value}`} className="text-base flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>

                {!answers[question.id] && (
                  <div className="flex items-center gap-2 mt-4 text-amber-500 dark:text-amber-400">
                    <AlertTriangle size={16} />
                    <span className="text-sm">{t("test.pleaseSelect")}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  {t("test.previous")}
                </Button>

                {currentQuestion < questions.length - 1 ? (
                  <Button onClick={handleNext} disabled={!answers[question.id]} className="flex items-center">
                    {t("test.next")}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!answers[question.id] || isSubmitting}>
                    {isSubmitting ? t("test.submitting") : t("test.submit")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </main>

      <Dialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("test.exitConfirmTitle")}</DialogTitle>
            <DialogDescription>{t("test.exitConfirmDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExitDialogOpen(false)}>
              {t("test.continue")}
            </Button>
            <Button variant="destructive" onClick={confirmExit}>
              {t("test.exitTest")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
