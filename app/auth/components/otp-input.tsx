"use client";

import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";

const OTP_LENGTH = 6;

type OtpInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
};

function focusInput(inputRefs: RefObject<(HTMLInputElement | null)[]>, index: number) {
  inputRefs.current[index]?.focus();
  inputRefs.current[index]?.select();
}

export function OtpInput({ id, name, value, onChange }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");

  function updateValue(nextDigits: string[]) {
    onChange(nextDigits.join("").trimEnd());
  }

  function handleChange(index: number, nextChar: string) {
    const sanitizedChar = nextChar.slice(-1).toUpperCase();
    if (sanitizedChar && !/^[A-Z0-9]$/.test(sanitizedChar)) {
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = sanitizedChar || " ";
    updateValue(nextDigits);

    if (sanitizedChar && index < OTP_LENGTH - 1) {
      focusInput(inputRefs, index + 1);
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();

      if (digits[index]?.trim()) {
        const nextDigits = [...digits];
        nextDigits[index] = " ";
        updateValue(nextDigits);
        return;
      }

      if (index > 0) {
        const nextDigits = [...digits];
        nextDigits[index - 1] = " ";
        updateValue(nextDigits);
        focusInput(inputRefs, index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(inputRefs, index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(inputRefs, index + 1);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\s/g, "")
      .toUpperCase()
      .slice(0, OTP_LENGTH);

    if (!/^[A-Z0-9]*$/.test(pastedValue)) {
      return;
    }

    const nextDigits = pastedValue.padEnd(OTP_LENGTH, " ").split("");
    updateValue(nextDigits);

    const nextFocusIndex = Math.min(pastedValue.length, OTP_LENGTH - 1);
    focusInput(inputRefs, nextFocusIndex);
  }

  return (
    <>
      <input type="hidden" id={id} name={name} value={value} readOnly />
      <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label="Código de verificación">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="text"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit.trim()}
            aria-label={`Carácter ${index + 1} de ${OTP_LENGTH}`}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => event.currentTarget.select()}
            className="h-12 w-10 rounded-lg border border-zinc-300 bg-white text-center text-lg font-semibold uppercase tracking-widest text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 sm:h-14 sm:w-12 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400 dark:focus:ring-zinc-400/10"
          />
        ))}
      </div>
    </>
  );
}
