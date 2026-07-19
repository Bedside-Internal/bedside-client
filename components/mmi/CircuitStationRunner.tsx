"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionRunner } from "./QuestionRunner";
import { CircuitStepTracker } from "./CircuitStepTracker";
import { getQuestion, submitMediaResponse, submitResponse } from "@/lib/api/mmi-actions";
import type { ComposePayload, QuestionDetail, ResponseFeedback } from "@/types/mmi";
import type { CircuitStationState } from "@/types/circuit";

interface CircuitStationRunnerProps {
  attemptId: string;
  stations: CircuitStationState[];
  currentIndex: number;
  initialQuestion: QuestionDetail;
}

export function CircuitStationRunner({
  attemptId,
  stations,
  currentIndex,
  initialQuestion,
}: CircuitStationRunnerProps) {
  const router = useRouter();
  const [question] = useState<QuestionDetail>(initialQuestion);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ResponseFeedback | null>(null);

  const station = stations[currentIndex];
  const isLastStation = currentIndex === stations.length - 1;

  const handleSubmit = useCallback(
    async (payload: ComposePayload) => {
      setSubmitting(true);
      setError(null);
      try {
        if (payload.mode === "written") {
          const result = await submitResponse({ attemptId, questionId: question.id, text: payload.text });
          setFeedback(result.feedback);
        } else {
          const formData = new FormData();
          formData.set("attemptId", attemptId);
          formData.set("questionId", question.id);
          formData.set("mediaType", payload.mode);
          formData.set("media", payload.blob);
          const result = await submitMediaResponse(formData);
          setFeedback(result.feedback);
        }
      } catch {
        setError("Couldn't submit that response — your answer is still here, try again.");
        throw new Error("submit-failed");
      } finally {
        setSubmitting(false);
      }
    },
    [attemptId, question.id],
  );

  function handleContinue() {
    if (isLastStation) {
      router.push(`/mmi/circuit/${attemptId}/results`);
    } else {
      router.push(`/mmi/circuit/run?attempt=${attemptId}&station=${currentIndex + 1}&phase=transition`);
    }
  }

  return (
    <>
      <CircuitStepTracker stations={stations} currentIndex={currentIndex} />
      {error && (
        <div className="bg-[var(--color-coral)]/10 px-6 py-3 text-center text-sm text-[var(--color-coral)]">
          {error}
        </div>
      )}
      <QuestionRunner
        question={question}
        breadcrumb={[{ label: "MMI Circuit" }, { label: station.title }]}
        onExit={() => router.push("/dashboard")}
        onSubmit={handleSubmit}
        submitting={submitting}
        feedback={feedback}
        // No going back mid-circuit — real MMI doesn't allow it either.
        hasPrev={false}
        // "Next" here always means "move on" once feedback has rendered,
        // whether that's a transition to the next station or the results screen.
        hasNext={feedback !== null}
        onNext={handleContinue}
      />
    </>
  );
}