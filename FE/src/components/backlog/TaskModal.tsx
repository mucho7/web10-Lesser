import React, { useState } from 'react';
import { BacklogState, TaskData } from '../../types/backlog';

interface TaskModalProps {
  onClose: () => void;
  setBacklogState: React.Dispatch<React.SetStateAction<BacklogState>>;
  epicIndex: number;
  storyIndex: number;
}

const TaskModal = ({ onClose, setBacklogState, epicIndex, storyIndex }: TaskModalProps) => {
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    member: '',
    point: 0,
    completionCondition: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value, 10);
    setTaskData((prevData) => ({ ...prevData, [name]: isNaN(parsedValue) ? '' : parsedValue }));
  };

  const handleCreateTaskButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (taskData.title.trim() === '' || taskData.member.trim() === '' || taskData.completionCondition.trim() === '') {
      return;
    }

    setBacklogState((prevState) => {
      const updatedEpics = [...prevState.epics];
      const updatedStories = [...updatedEpics[epicIndex].stories];
      updatedStories[storyIndex] = {
        ...updatedStories[storyIndex],
        tasks: [...updatedStories[storyIndex].tasks, taskData],
      };
      updatedEpics[epicIndex] = {
        ...updatedEpics[epicIndex],
        stories: updatedStories,
      };
      return { ...prevState, epics: updatedEpics };
    });

    setTaskData({
      title: '',
      point: 0,
      member: '',
      completionCondition: '',
    });
    onClose();
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-5/12 h-3/4 rounded-md bg-white p-8 text-house-green">
        <form className="flex flex-col h-full justify-between">
          <p className="text-l font-bold">Task</p>
          <div className="flex flex-col gap-2">
            <label className="text-s" htmlFor="title">
              <span className="text-m font-bold pr-2">업무 내용</span>
              Story를 구현하기 위해 필요한 업무를 작성합니다
            </label>
            <input
              className="w-full p-2 border rounded-sm border-starbucks-green text-s outline-starbucks-green"
              type="text"
              id="title"
              name="title"
              placeholder="어떤 업무를 수행할 예정인가요?"
              value={taskData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-s" htmlFor="completionCondition">
              <span className="text-m font-bold pr-2">인수조건</span>
              Task를 완료하기 위한 조건을 작성합니다.
            </label>
            <textarea
              className="w-full p-2 border rounded-sm border-starbucks-green text-s resize-none outline-starbucks-green"
              rows={5}
              id="completionCondition"
              name="completionCondition"
              placeholder={
                '예시 조건)\n' +
                '몇 개의 테스트 코드를 통과해야 합니다\n' +
                '사전에 작성한 예상 유저 시나리오와 비교하여 동작을 확인합니다'
              }
              value={taskData.completionCondition}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="member" className="text-s">
              <span className="text-m font-bold pr-2">담당자</span>
              Task를 수행할 멤버를 선정합니다
            </label>
            <input
              className="w-1/3 p-2 border rounded-sm border-starbucks-green text-s outline-starbucks-green"
              type="text"
              id="member"
              name="member"
              placeholder="담당자"
              value={taskData.member}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="point" className="text-s">
              <span className="text-m font-bold pr-2">Point</span>
              Task를 완료하기 위해 소요되는 시간을 예상합니다
            </label>
            <div className="flex w-1/3 pr-3 items-center border rounded-sm border-starbucks-green justify-between">
              <input
                className="w-full p-2 text-s outline-none"
                type="number"
                id="point"
                name="point"
                value={taskData.point}
                onChange={handleNumberInputChange}
              />
              <p className="font-bold text-starbucks-green">Point</p>
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <button
              className="border-2 rounded-md border-starbucks-green px-4 py-1 font-bold text-starbucks-green"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              취소
            </button>
            <button
              className="border-2 rounded-md border-starbucks-green px-4 py-1 bg-starbucks-green font-bold text-true-white"
              onClick={handleCreateTaskButtonClick}
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
