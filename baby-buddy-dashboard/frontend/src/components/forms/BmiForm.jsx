import { useState } from "react";
import { api } from "../../api";
import Modal, { FormField, FormInput, FormButton } from "../Modal";
import { colors } from "../../utils/colors";

function toLocalDate(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function BmiForm({ childId, entry, onDone, onClose }) {
  const isEdit = !!entry;
  const [bmi, setBmi] = useState(entry?.bmi ? String(entry.bmi) : "");
  const [date, setDate] = useState(entry?.date ? toLocalDate(entry.date) : toLocalDate(new Date()));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bmi) return;
    setSaving(true);
    try {
      const data = {
        bmi: parseFloat(bmi),
        date,
      };
      if (isEdit) {
        await api.updateBmi(entry.id, data);
      } else {
        data.child = childId;
        await api.createBmi(data);
      }
      onDone();
    } catch {
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit BMI" : "Log BMI"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormField label="BMI">
          <FormInput
            type="number"
            value={bmi}
            onChange={(e) => setBmi(e.target.value)}
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
        <FormButton color={colors.bmi} disabled={saving || !bmi}>
          {saving ? "Saving..." : isEdit ? "Update BMI" : "Save BMI"}
        </FormButton>
      </form>
    </Modal>
  );
}
