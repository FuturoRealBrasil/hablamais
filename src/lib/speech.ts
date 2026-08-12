export function speakSpanish(text: string, variant: "latino" | "espanha" = "latino") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = variant === "espanha" ? "es-ES" : "es-MX";
  utter.rate = 0.92;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
  return true;
}

export function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
