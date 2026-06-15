import React, { useEffect } from "react";
import "../styles/Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position before locking the body
      const scrollY = window.scrollY;
      document.body.classList.add("modal-open");
      document.body.style.top = `-${scrollY}px`;
      document.body.dataset.scrollY = scrollY;
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.top = "";
      // Restore the scroll position after unlocking
      const savedScrollY = parseInt(document.body.dataset.scrollY, 10);
      if (!isNaN(savedScrollY)) {
        window.scrollTo(0, savedScrollY);
      }
      delete document.body.dataset.scrollY;
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.top = "";
      const savedScrollY = parseInt(document.body.dataset.scrollY, 10);
      if (!isNaN(savedScrollY)) {
        window.scrollTo(0, savedScrollY);
      }
      delete document.body.dataset.scrollY;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
