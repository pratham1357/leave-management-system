function LeaveForm() {
  return (
    <form>
      <h2>Apply Leave</h2>

      <input placeholder="Employee ID" />
      <br /><br />

      <select>
        <option>CASUAL</option>
        <option>SICK</option>
        <option>EARNED</option>
      </select>

      <br /><br />

      <input type="date" />

      <br /><br />

      <input type="date" />

      <br /><br />

      <button type="submit">
        Submit
      </button>
    </form>
  );
}

export default LeaveForm;