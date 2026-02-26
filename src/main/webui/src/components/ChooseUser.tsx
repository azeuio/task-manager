import type { User } from "@/api/types";
import React, { useEffect, useRef } from "react";

interface ChooseUserDropdownProps {
  current?: number;
  users: User[];
  updateUser: (event: React.MouseEvent<HTMLInputElement>) => void;
  readonly?: boolean;
}
function ChooseUserDropdown({
  current,
  users,
  updateUser,
  readonly,
}: ChooseUserDropdownProps) {
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Update the radio button selection when currentStatus changes
    if (ulRef.current) {
      const radioButtons = ulRef.current.querySelectorAll(
        'input[name="user"]',
      ) as NodeListOf<HTMLInputElement>;
      radioButtons.forEach((radio) => {
        radio.checked = parseInt(radio.value, 10) === current;
      });
    }
  }, [current, users]);

  const loseFocus = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    target.blur();
  };

  const getUserName = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    return user?.displayName ?? user?.username ?? "Unknown";
  };

  return (
    <div className="dropdown dropdown-top">
      <button
        tabIndex={0}
        id="user-dropdown"
        role="button"
        className="btn m-1"
        disabled={readonly}
      >
        {current !== undefined ? getUserName(current) : "Unknown"}
      </button>
      <ul
        hidden={readonly}
        ref={ulRef}
        tabIndex={-1}
        className="dropdown-content dropdown-top menu ring ring-accent bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        {users.map((user) => (
          <li key={user.id}>
            <label>
              <input
                name="user"
                type="radio"
                value={user.id}
                className="peer radio radio-primary"
                defaultChecked={current === user.id}
                onClick={(event) => {
                  updateUser(event);
                  loseFocus(event);
                }}
                disabled={readonly}
              />{" "}
              {user.displayName}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChooseUserDropdown;
