import { useState } from "react";
import { submitLeave } from "../api/leaveApi";

function LeaveForm({
  employeeId,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    employeeId: employeeId,
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitLeave(formData);
      if (onSuccess) {
        await onSuccess();
      }
      
      alert("Leave submitted successfully!");

      setFormData({
        employeeId: employeeId,
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to submit leave."
      );
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
  };

  return (
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Apply Leave
        </h2>

        <select
          name="leaveType"
          value={formData.leaveType}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="CASUAL">
            CASUAL
          </option>
          <option value="SICK">
            SICK
          </option>
          <option value="EARNED">
            EARNED
          </option>
          <option value="UNPAID">
            UNPAID
          </option>
        </select>

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="reason"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
          rows="4"
          style={{
            ...inputStyle,
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Submit Request
        </button>
      </form>
    );
}

export default LeaveForm;