import { CATEGORY_COLOR } from "../../constants/backlog";
import { EpicColor } from "../../types/DTO/backlogDTO";

interface CategoryChipProps {
  content: string;
  bgColor: EpicColor;
}

const CategoryChip = ({ content, bgColor }: CategoryChipProps) => (
  <div
    title={content}
    className={`w-fit max-w-[4.5rem] rounded-md ${CATEGORY_COLOR[bgColor]} px-2 py-[2px] overflow-hidden text-ellipsis whitespace-nowrap`}
  >
    {content}
  </div>
);

export default CategoryChip;
