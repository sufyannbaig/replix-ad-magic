export type ProductIntake =
  | { kind: "upload"; name: string; dataUrl: string }
  | { kind: "url"; url: string };

let pendingIntake: ProductIntake | null = null;

export function setProductIntake(intake: ProductIntake) {
  pendingIntake = intake;
}

export function takeProductIntake() {
  const intake = pendingIntake;
  pendingIntake = null;
  return intake;
}