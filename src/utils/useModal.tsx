import { useState } from "react";

export function useModal(init = false) {
  const [open, setOpen] = useState(init);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return { open, openModal, closeModal };
}
