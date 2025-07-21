/**
 * @fileOverview Centralized definition for the application's multi-step flow.
 * This file serves as the single source of truth for step identifiers, sequence,
 * and associated metadata like descriptions.
 */

// Use a const object for step identifiers to allow for easy access and maintainability.
// Using strings instead of numbers makes the flow logic more readable and less prone to off-by-one errors.
export const STEP_IDS = {
  USER_INFO: 'USER_INFO',
  HEALTH_QUESTIONS: 'HEALTH_QUESTIONS',
  BENEFICIARY: 'BENEFICIARY',
  PAYMENT: 'PAYMENT',
  SELF_ENROLL_LOADING: 'SELF_ENROLL_LOADING',
  SELF_ENROLL_CONTRACT: 'SELF_ENROLL_CONTRACT',
  SELF_ENROLL_COMPLETE: 'SELF_ENROLL_COMPLETE',
  AGENT_HANDOFF: 'AGENT_HANDOFF',
} as const;

export type StepId = keyof typeof STEP_IDS;

// Defines the primary, linear sequence of the form before branching.
export const FORM_STEPS: StepId[] = [
  STEP_IDS.USER_INFO,
  STEP_IDS.HEALTH_QUESTIONS,
  STEP_IDS.BENEFICIARY,
  STEP_IDS.PAYMENT,
];

// All possible steps in the application.
export const ALL_STEPS: StepId[] = [
    ...FORM_STEPS,
    STEP_IDS.SELF_ENROLL_LOADING,
    STEP_IDS.SELF_ENROLL_CONTRACT,
    STEP_IDS.SELF_ENROLL_COMPLETE,
    STEP_IDS.AGENT_HANDOFF,
];

export const stepDescriptions: Record<StepId, string> = {
  [STEP_IDS.USER_INFO]: 'Started Application',
  [STEP_IDS.HEALTH_QUESTIONS]: 'Answered Health Questions',
  [STEP_IDS.BENEFICIARY]: 'Entered Beneficiary Info',
  [STEP_IDS.PAYMENT]: 'Entered Payment Info',
  [STEP_IDS.SELF_ENROLL_LOADING]: 'Started Self-Enroll',
  [STEP_IDS.SELF_ENROLL_CONTRACT]: 'SMS Verification Sent',
  [STEP_IDS.SELF_ENROLL_COMPLETE]: 'Self-Enroll Complete',
  [STEP_IDS.AGENT_HANDOFF]: 'Agent Handoff Chosen',
};

// Provides a numerical index for each step, useful for progress indicators.
export const getStepNumber = (stepId: StepId): number => {
    const index = ALL_STEPS.indexOf(stepId);
    return index !== -1 ? index + 1 : 0;
}

export const getTotalSteps = (): number => {
    return ALL_STEPS.length;
}
