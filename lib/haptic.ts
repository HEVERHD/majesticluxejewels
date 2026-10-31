export function haptic(ms = 10) {
  navigator.vibrate?.(ms);
}
