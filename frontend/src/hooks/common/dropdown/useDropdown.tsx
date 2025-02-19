import { WheelEvent, useEffect, useRef, useState } from "react";
import chevronDownIcon from "../../../assets/icons/chevron-down.svg";
import chevronUpIcon from "../../../assets/icons/chevron-up.svg";

interface useDropdownParams {
  placeholder: string;
  options: string[];
  defaultOption?: string;
}

interface DropdownProps {
  buttonClassName?: string;
  containerClassName?: string;
  itemClassName?: string;
  iconSize?: string;
  selectOption?: (option: string) => void;
}

const useDropdown = ({
  placeholder,
  options,
  defaultOption,
}: useDropdownParams) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    defaultOption ? defaultOption : ""
  );
  const dropdownRef = useRef<HTMLButtonElement>(null);
  const handleChangeSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  const Dropdown = ({
    buttonClassName = "",
    containerClassName = "",
    itemClassName = "",
    iconSize = "24",
    selectOption,
  }: DropdownProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleButtonClick = () => {
      setOpen((prevState) => !prevState);
    };

    const handleOptionClick = (option: string) => {
      if (selectOption) {
        selectOption(option);
      }
      handleChangeSelectedOption(option);
      setOpen(false);
    };

    const handleOutsideClick = ({ target }: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target as Node)
      ) {
        setOpen(false);
      }
    };

    useEffect(() => {
      window.addEventListener("click", handleOutsideClick);

      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }, []);

    return (
      <div className="relative">
        <button
          type="button"
          ref={dropdownRef}
          onClick={handleButtonClick}
          className={`${buttonClassName} ${open && "shadow-none"}`}
          style={{ wordBreak: "keep-all" }}
        >
          {selectedOption || placeholder}
          {open ? (
            <div className={iconSize}>
              <img src={chevronUpIcon} className="w-full" />
            </div>
          ) : (
            <div className={iconSize}>
              <img src={chevronDownIcon} className="w-full" />
            </div>
          )}
        </button>
        {open && (
          <ul
            className={`${containerClassName} absolute`}
            onWheel={(event: WheelEvent) => {
              event.stopPropagation();
            }}
          >
            {options.map((option, index) => (
              <li
                key={index}
                onMouseDown={() => handleOptionClick(option)}
                className={`${
                  selectedOption === option
                    ? "text-middle-green"
                    : "text-text-gray"
                } ${itemClassName} hover:cursor-pointer`}
                style={{ wordBreak: "keep-all" }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return { Dropdown, selectedOption, handleChangeSelectedOption };
};

export default useDropdown;
