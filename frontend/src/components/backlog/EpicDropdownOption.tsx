import CategoryChip from "./CategoryChip";
import MenuKebab from "../../assets/icons/menu-kebab.svg?react";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import useDropdownState from "../../hooks/common/dropdown/useDropdownState";
import EpicUpdateBox from "./EpicUpdateBox";
import { MouseEvent, useRef } from "react";

interface EpicDropdownOptionProps {
  epic: EpicCategoryDTO;
}

const EpicDropdownOption = ({ epic }: EpicDropdownOptionProps) => {
  const { open, handleOpen, handleClose } = useDropdownState();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleMenuButtonClick = (event: MouseEvent) => {
    event.stopPropagation();
    handleOpen();
  };

  return (
    <>
      <div className="flex justify-between px-1 py-1 rounded-md group hover:cursor-pointer hover:bg-gray-100">
        <CategoryChip content={epic.name} bgColor={epic.color} />
        <button
          className="invisible px-1 rounded-md group-hover:visible hover:bg-gray-300"
          type="button"
          onClick={handleMenuButtonClick}
          ref={buttonRef}
        >
          <MenuKebab width={20} height={20} stroke="#696969" />
        </button>
      </div>
      {open && (
        <EpicUpdateBox
          epic={epic}
          onBoxClose={handleClose}
          buttonRef={buttonRef}
        />
      )}
    </>
  );
};

export default EpicDropdownOption;
