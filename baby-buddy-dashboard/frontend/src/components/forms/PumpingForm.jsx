import { useState } from "react";
import { api } from "../../api";
import Modal, { FormField, FormInput, FormButton } from "../Modal";
import { colors } from "../../utils/colors";
import { useUnits } from "../../utils/units";

function toLocalDatetime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function PumpingForm({ childId, entry, onDone, onClose }) {
  const units = useUnits();
  const isEdit = !!entry;
  const now = new Date();
  const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const [amount, setAmount] = useState(entry?.amount != null ? String(entry.amount) : "");
  const [start, setStart] = useState(entry?.start ? toLocalDatetime(new Date(entry.start)) : toLocalDatetime(fifteenMinsAgo));
  const [end, setEnd] = useState(entry?.end ? toLocalDatetime(new Date(entry.end)) : toLocalDatetime(now));
  const [notes, setNotes] = useState(entry?.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {};
      if (amount) data.amount = parseFloat(amount);
      if (notes.trim()) data.notes = notes.trim();
      if (isEdit) {
        data.start = `${start}:00-07:00`;
        data.end = `${end}:00-07:00`;
        await api.updatePumping(entry.id, data);
      } else {
        data.child = childId;
        data.start = `${start}:00-07:00`;
        data.end = `${end}:00-07:00`;
        await api.createPumping(data);
      }
      onDone();
    } catch {
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit Pumping" : "Log Pumping"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormField label={`Amount (${units.volume})`}>
          <FormInput
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5.0"
            min="0"
            step="0.1"
            autoFocus
          />
        </FormField>
        <FormField label="Start Time">
          <FormInput
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </FormField>
        <FormField label="End Time">
          <FormInput
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Notes">
          <FormInput
            as="textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
          />
        </FormField>
        <FormButton color={colors.feeding} disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update" : "Save"}
        </FormButton>
      </form>
    </Modal>
  );
}
