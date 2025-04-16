"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, Trash2, GripVertical } from "lucide-react"

// Question type definitions
type QuestionType = "multiple-choice" | "likert-scale" | "open-ended" | "true-false" | "multiple-select"

interface Option {
  id: string
  text: string
  value?: number
}

interface Question {
  id: string
  text: string
  type: QuestionType
  options: Option[]
  required: boolean
}

// Demo initial questions
const initialQuestions: Question[] = [
  {
    id: "q1",
    text: "I enjoy being the center of attention.",
    type: "likert-scale",
    options: [
      { id: "q1-o1", text: "Strongly Disagree", value: 1 },
      { id: "q1-o2", text: "Disagree", value: 2 },
      { id: "q1-o3", text: "Neutral", value: 3 },
      { id: "q1-o4", text: "Agree", value: 4 },
      { id: "q1-o5", text: "Strongly Agree", value: 5 },
    ],
    required: true,
  },
  {
    id: "q2",
    text: "I prefer working alone rather than in a team.",
    type: "likert-scale",
    options: [
      { id: "q2-o1", text: "Strongly Disagree", value: 1 },
      { id: "q2-o2", text: "Disagree", value: 2 },
      { id: "q2-o3", text: "Neutral", value: 3 },
      { id: "q2-o4", text: "Agree", value: 4 },
      { id: "q2-o5", text: "Strongly Agree", value: 5 },
    ],
    required: true,
  },
]

export function TestQuestionBuilder() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null)

  // Get the current question being edited
  const currentQuestion = currentQuestionId ? questions.find((q) => q.id === currentQuestionId) : null

  // Add a new question
  const addQuestion = () => {
    const newId = `q${questions.length + 1}`
    const newQuestion: Question = {
      id: newId,
      text: "",
      type: "multiple-choice",
      options: [
        { id: `${newId}-o1`, text: "Option 1" },
        { id: `${newId}-o2`, text: "Option 2" },
      ],
      required: true,
    }
    setQuestions([...questions, newQuestion])
    setCurrentQuestionId(newId)
  }

  // Delete a question
  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
    if (currentQuestionId === id) {
      setCurrentQuestionId(null)
    }
  }

  // Update question text
  const updateQuestionText = (id: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)))
  }

  // Update question type
  const updateQuestionType = (id: string, type: QuestionType) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          let options = q.options

          // Reset options based on question type
          if (type === "likert-scale") {
            options = [
              { id: `${id}-o1`, text: "Strongly Disagree", value: 1 },
              { id: `${id}-o2`, text: "Disagree", value: 2 },
              { id: `${id}-o3`, text: "Neutral", value: 3 },
              { id: `${id}-o4`, text: "Agree", value: 4 },
              { id: `${id}-o5`, text: "Strongly Agree", value: 5 },
            ]
          } else if (type === "true-false") {
            options = [
              { id: `${id}-o1`, text: "True", value: 1 },
              { id: `${id}-o2`, text: "False", value: 0 },
            ]
          } else if (type === "open-ended") {
            options = []
          } else if (options.length === 0) {
            options = [
              { id: `${id}-o1`, text: "Option 1" },
              { id: `${id}-o2`, text: "Option 2" },
            ]
          }

          return { ...q, type, options }
        }
        return q
      }),
    )
  }

  // Update question required status
  const updateQuestionRequired = (id: string, required: boolean) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, required } : q)))
  }

  // Add an option to a question
  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptionId = `${questionId}-o${q.options.length + 1}`
          return {
            ...q,
            options: [...q.options, { id: newOptionId, text: `Option ${q.options.length + 1}` }],
          }
        }
        return q
      }),
    )
  }

  // Update option text
  const updateOptionText = (questionId: string, optionId: string, text: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o) => (o.id === optionId ? { ...o, text } : o)),
          }
        }
        return q
      }),
    )
  }

  // Delete an option
  const deleteOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((o) => o.id !== optionId),
          }
        }
        return q
      }),
    )
  }

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setQuestions(items)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Questions</CardTitle>
          <CardDescription>Create and manage the questions for your test</CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {questions.map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border rounded-md p-4 ${currentQuestionId === question.id ? "border-primary" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div {...provided.dragHandleProps} className="cursor-grab">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <h3 className="font-medium">Question {index + 1}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentQuestionId(question.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteQuestion(question.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm">
                              {question.text || <span className="text-muted-foreground italic">No question text</span>}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {question.type.replace("-", " ")}
                              </Badge>
                              {question.required && (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                  Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button type="button" variant="outline" className="mt-4 w-full" onClick={addQuestion}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Question</CardTitle>
            <CardDescription>Configure the selected question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea
                id="question-text"
                value={currentQuestion.text}
                onChange={(e) => updateQuestionText(currentQuestion.id, e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question-type">Question Type</Label>
              <Select
                value={currentQuestion.type}
                onValueChange={(value) => updateQuestionType(currentQuestion.id, value as QuestionType)}
              >
                <SelectTrigger id="question-type">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="likert-scale">Likert Scale</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="multiple-select">Multiple Select</SelectItem>
                  <SelectItem value="open-ended">Open Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="question-required"
                checked={currentQuestion.required}
                onCheckedChange={(checked) => updateQuestionRequired(currentQuestion.id, !!checked)}
              />
              <Label htmlFor="question-required">Required question</Label>
            </div>

            {currentQuestion.type !== "open-ended" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  {currentQuestion.type !== "true-false" && currentQuestion.type !== "likert-scale" && (
                    <Button type="button" variant="outline" size="sm" onClick={() => addOption(currentQuestion.id)}>
                      <Plus className="mr-2 h-3 w-3" />
                      Add Option
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      {currentQuestion.type === "multiple-choice" && <RadioGroupItem value={option.id} disabled />}
                      {currentQuestion.type === "multiple-select" && <Checkbox disabled />}
                      <Input
                        value={option.text}
                        onChange={(e) => updateOptionText(currentQuestion.id, option.id, e.target.value)}
                        className="flex-1"
                      />
                      {currentQuestion.type !== "true-false" && currentQuestion.type !== "likert-scale" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteOption(currentQuestion.id, option.id)}
                          disabled={currentQuestion.options.length <= 2}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="button" variant="outline" onClick={() => setCurrentQuestionId(null)}>
              Done
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

// Badge component for question types
function Badge({ children, className, variant }: { children: React.ReactNode; className?: string; variant?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}
