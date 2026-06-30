import { useState } from "react";
import { submitLeave } from "../api/leaveApi";

function LeaveForm({
  employeeId,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    employeeId: "",
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
        employeeId: "",
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

  return (
    <form onSubmit={handleSubmit}>
      <h2>Apply Leave</h2>

      <input
        name="employeeId"
        placeholder="Employee ID"
        value={formData.employeeId}
        onChange={handleChange}
      />

      <br />
      <br />

      <select
        name="leaveType"
        value={formData.leaveType}
        onChange={handleChange}
      >
        <option value="CASUAL">CASUAL</option>
        <option value="SICK">SICK</option>
        <option value="EARNED">EARNED</option>
      </select>

      <br />
      <br />

      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
      />

      <br />
      <br />

      <textarea
        name="reason"
        placeholder="Reason"
        value={formData.reason}
        onChange={handleChange}
      />

      <br />
      <br />

      <button type="submit">
        Submit
      </button>
    </form>
  );
}

export default LeaveForm;