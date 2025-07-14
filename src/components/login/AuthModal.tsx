"use client";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Props = {
  type: "login" | "register";
  onClose: () => void;
};

export default function AuthModal({ type, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">
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
