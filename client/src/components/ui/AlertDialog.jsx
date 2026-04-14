import Modal from "./Modal";
import Button from "./Button";

export default function AlertDialog({ open, onClose, onConfirm, title, description, loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} loading={loading}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
