import { useState } from "react";
import { submitLeave } from "../api/leaveApi";


function LeaveForm({
  employeeId,
  onSuccess,
}) {
  const [formData, setFormData] =
    useState({
      leaveType: "CASUAL",
      startDate: "",
      endDate: "",
      reason: "",
    });

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      setMessage({
        type: "",
        text: "",
      });


      await submitLeave({
        ...formData,
        employeeId,
      });


      if (onSuccess) {
        await onSuccess();
      }


      setFormData({
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
      });


      setMessage({
        type: "success",
        text:
          "Leave request submitted successfully.",
      });

    } catch (err) {
      console.error(
        "Failed to submit leave:",
        err
      );

      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to submit leave request.",
      });

    } finally {
      setSubmitting(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="leave-form"
    >
      {message.text && (
        <div
          className={
            message.type === "success"
              ? "alert alert-success"
              : "alert alert-error"
          }
        >
          {message.text}
        </div>
      )}


      <div className="form-group">
        <label
          className="form-label"
          htmlFor="leaveType"
        >
          Leave Type
        </label>

        <select
          id="leaveType"
          name="leaveType"
          value={formData.leaveType}
          onChange={handleChange}
          className="form-select"
        >
          <option value="CASUAL">
            Casual Leave
          </option>

          <option value="SICK">
            Sick Leave
          </option>

          <option value="EARNED">
            Earned Leave
          </option>

          <option value="UNPAID">
            Unpaid Leave
          </option>
        </select>
      </div>


      <div className="leave-date-grid">

        <div className="form-group">
          <label
            className="form-label"
            htmlFor="startDate"
          >
            Start Date
          </label>

          <input
            id="startDate"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>


        <div className="form-group">
          <label
            className="form-label"
            htmlFor="endDate"
          >
            End Date
          </label>

          <input
            id="endDate"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

      </div>


      <div className="form-group">
        <label
          className="form-label"
          htmlFor="reason"
        >
          Reason
        </label>

        <textarea
          id="reason"
          name="reason"
          placeholder="Briefly describe the reason for your leave..."
          value={formData.reason}
          onChange={handleChange}
          rows="5"
          className="form-textarea"
          required
        />
      </div>


      <div className="leave-form-footer">
        <div className="leave-form-employee">
          Applying as{" "}
          <strong>
            {employeeId}
          </strong>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : "Submit Request"}
        </button>
      </div>

    </form>
  );
}


export default LeaveForm;