import { useState } from "react";
import { api } from "../../api";
import Modal, { FormField, FormInput, FormButton } from "../Modal";
import { colors } from "../../utils/colors";
import { useUnits } from "../../utils/units";

function toLocalDate(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function HeadCircumferenceForm({ childId, entry, onDone, onClose }) {
  const units = useUnits();
  const isEdit = !!entry;
  const [head_circumference, setHeadCircumference] = useState(entry?.head_circumference ? String(entry.head_circumference) : "");
  const [date, setDate] = useState(entry?.date ? toLocalDate(entry.date) : toLocalDate(new Date()));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!head_circumference) return;
    setSaving(true);
    try {
      const data = {
        head_circumference: parseFloat(head_circumference),
        date,
      };
      if (isEdit) {
        await api.updateHeadCircumference(entry.id, data);
      } else {
        data.child = childId;
        await api.createHeadCircumference(data);
      }
      onDone();
    } catch {
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit Head Circumference" : "Log Head Circumference"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormField label={`Head Circumference (${units.length})`}>
          <FormInput
            type="number"
            value={head_circumference}
            onChange={(e) => setHeadCircumference(e.target.value)}
            placeholder="15.0"
            min="0"
            max="100"
            step="0.01"
            autoFocus
            required
          />
        </FormField>
        <FormField label="Date">
          <FormInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormField>
        <FormButton color={colors.headCircumference} disabled={saving || !head_circumference}>
          {saving ? "Saving..." : isEdit ? "Update" : "Save"}
        </FormButton>
      </form>
    </Modal>
  );
}
