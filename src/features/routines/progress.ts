import type { StepStatusOverrides } from './data';

type Listener = () => void;

const listeners = new Set<Listener>();

let stepOverrides: Record<string, StepStatusOverrides> = {};

export function getStepOverrides() {
  return stepOverrides;
}

export function subscribeStepOverrides(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function setStepStatus(routineId: string, stepId: string, status: 'completed' | 'pending') {
  stepOverrides = {
    ...stepOverrides,
    [routineId]: {
      ...stepOverrides[routineId],
      [stepId]: status,
    },
  };
  notify();
}

export function completeStep(routineId: string, stepId: string) {
  setStepStatus(routineId, stepId, 'completed');
}
