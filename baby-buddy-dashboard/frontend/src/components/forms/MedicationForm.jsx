import { useState } from "react";
import { api } from "../../api";
import Modal, { FormField, FormInput, FormSelect, FormButton } from "../Modal";
import { colors } from "../../utils/colors";

function toLocalDatetime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const DOSAGE_UNITS = [
  { value: "mg", label: "mg" },
  { value: "ml", label: "ml" },
  { value: "tablets", label: "Tablets" },
  { value: "drops", label: "Drops" },
];

export default function MedicationForm({ childId, entry, onDone, onClose }) {
  const isEdit = !!entry;
  const now = new Date();
  const [name, setName] = useState(entry?.name || "");
  const [dosage, setDosage] = useState(entry?.dosage != null ? String(entry.dosage) : "");
  const [dosageUnit, setDosageUnit] = useState(entry?.dosage_unit || "ml");
  const [time, setTime] = useState(entry?.time ? toLocalDatetime(new Date(entry.time)) : toLocalDatetime(now));
  const [notes, setNotes] = useState(entry?.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const data = { 
        name: name.trim(),
        dosage_unit: dosageUnit,
      };
      if (dosage) data.dosage = parseFloat(dosage);
      if (notes.trim()) data.notes = notes.trim();
      
      data.time = `${time}:00-07:00`;
      
      if (isEdit) {
        await api.updateMedication(entry.id, data);
      } else {
        data.child = childId;
        await api.createMedication(data);
      }
      onDone();
    } catch {
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit Medication" : "Log Medication"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormField label="Medication Name">
          <FormInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Tylenol"
            autoFocus
            required
          />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Dosage">
            <FormInput
              type="number"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="5.0"
              min="0"
              step="0.01"
            />
          </FormField>
          <FormField label="Unit">
            <FormSelect
              value={dosageUnit}
              onChange={(e) => setDosageUnit(e.target.value)}
              options={DOSAGE_UNITS}
            />
          </FormField>
        </div>
        <FormField label="Time">
          <FormInput
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
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
        <FormButton color={colors.sleep} disabled={saving || !name.trim()}>
          {saving ? "Saving..." : isEdit ? "Update" : "Save"}
        </FormButton>
      </form>
    </Modal>
  );
}
