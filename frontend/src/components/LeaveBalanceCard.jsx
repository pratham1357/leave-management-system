function LeaveBalanceCard({
  title,
  value,
  type,
}) {
  const initials = {
    casual: "CL",
    sick: "SL",
    earned: "EL",
    unpaid: "UL",
  };


  return (
    <div className="leave-balance-card">

      <div className="leave-balance-header">

        <div
          className={
            `leave-balance-icon leave-balance-${type}`
          }
        >
          {initials[type] || "LV"}
        </div>

        <span className="leave-balance-label">
          {title}
        </span>

      </div>


      <div className="leave-balance-value">
        {value}
      </div>

      <div className="leave-balance-unit">
        days available
      </div>

    </div>
  );
}


export default LeaveBalanceCard;