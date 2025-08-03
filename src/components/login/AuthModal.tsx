"use client";
import { useEffect, useRef } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Props = {
  type: "login" | "register";
  onClose: () => void;
};

export default function AuthModal({ type, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleFocusTrap);

    // Set focus to the first focusable element in the modal
    modalRef.current?.focus();
    const firstFocusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )[0];
    firstFocusable?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      ref={modalRef}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-black"
          onClick={onClose}
          aria-label="Fechar"
          lang="pt-BR"
        >
          &times;
        </button>
        <h2
          id="auth-modal-title"
          className="text-xl font-bold mb-4 text-black"
          lang="pt-BR"
        >
          {type === "register" ? "Abrir minha conta" : "Já tenho conta"}
        </h2>
        {type === "register" ? (
          <RegisterForm onSuccess={onClose} />
        ) : (
          <LoginForm onSuccess={onClose} />
        )}
      </div>
    </div>
  );
}
