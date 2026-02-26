import React, { useEffect, useRef } from "react";

interface ChooseStatusDropdownProps {
  currentStatus?: number;
  statuses: string[];
  statusesOrder: number[];
  updateStatusButton: (event: React.MouseEvent<HTMLInputElement>) => void;
  readonly?: boolean;
}
function ChooseStatusDropdown({
  currentStatus,
  statuses,
  statusesOrder,
  updateStatusButton,
  readonly,
}: ChooseStatusDropdownProps) {
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Update the radio button selection when currentStatus changes
    if (ulRef.current) {
      const radioButtons = ulRef.current.querySelectorAll(
        'input[name="status"]',
      ) as NodeListOf<HTMLInputElement>;
      radioButtons.forEach((radio) => {
        radio.checked = parseInt(radio.value, 10) === currentStatus;
      });
    }
  }, [currentStatus, statuses, statusesOrder]);

  const loseFocus = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    target.blur();
  };

  return (
    <div className="dropdown dropdown-top">
      <button
        tabIndex={0}
        id="status-dropdown"
        role="button"
        className="btn m-1"
        disabled={readonly}
      >
        {currentStatus !== undefined
          ? statuses[statusesOrder.indexOf(currentStatus)]
          : "Unknown"}
      </button>
      <ul
        hidden={readonly}
        ref={ulRef}
        tabIndex={-1}
        className="dropdown-content dropdown-top menu ring ring-accent bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        {statusesOrder.map((status, index) => (
          <li key={index}>
            <label>
              <input
                name="status"
                type="radio"
                value={status}
                className="peer radio radio-primary"
                defaultChecked={currentStatus === status}
                onClick={(event) => {
                  updateStatusButton(event);
                  loseFocus(event);
                }}
                disabled={readonly}
              />{" "}
              {statuses[index]}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChooseStatusDropdown;
