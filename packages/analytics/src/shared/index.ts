import { ValidationError } from '@wrelik/errors/shared';

export function validateEventName(event: string): void {
  const parts = event.split('.');
  if (parts.length < 3) {
    throw new ValidationError(`Event name "${event}" must follow "app.action.object" format`);
  }
}
