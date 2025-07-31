import { X } from "lucide-react";
import { useEffect, useState } from "react";

type ModalProp = {
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ onClose, children }: ModalProp) {
  const [modalState, setModalState] = useState("opacity-0");

  useEffect(() => {
    setTimeout(() => setModalState("opacity-100"), 10); // allow fade in

    // document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAnimation();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      //   document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function closeAnimation() {
    setModalState("opacity-0");
    setTimeout(() => onClose(), 300); // match transition duration
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalState}`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-75"
        onClick={closeAnimation}
      />
      <button
        className="absolute top-5 right-5 text-white bg-black rounded-full p-1 shadow z-20 "
        onClick={closeAnimation}
      >
        <X />
      </button>

      {/* Modal content */}
      <div className="pointer-events-auto z-10 max-w-[90%] flex justify-center align-center ">
        {children}
      </div>
    </div>
  );
}
