type ConfirmationModal = {
  isOpen: boolean;
  message?: string;
  ok?: () => void;
  cancel?: () => void;
};

export default function useConfModal() {
  const modal = useState<ConfirmationModal>("is-open", () => ({
    isOpen: false,
  }));

  const show = (message: string, ok?: () => void, cancel?: () => void) => {
    modal.value = {
      isOpen: true,
      message,
      ok,
      cancel,
    };
  };

  return {
    modal,
    show,
  };
}
