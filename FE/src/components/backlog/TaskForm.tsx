interface TaskFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  close: () => void;
  formRef: React.RefObject<HTMLFormElement>;
  defaultData?: {
    id: number;
    title: string;
    userId: string | number;
    point: number;
    condition: string;
  } | null;
}

const TaskForm = ({ handleSubmit, close, formRef, defaultData = null }: TaskFormProps) => {
  return (
    <div className="fixed top-0 left-0 bg-black w-screen h-screen bg-opacity-30 flex justify-center items-center font-pretendard">
      <div className="w-[31.875rem] h-[33.75rem] rounded-md bg-white p-6 text-house-green">
        <form className="flex flex-col h-full justify-between" onSubmit={handleSubmit} ref={formRef}>
          <p className="text-l font-bold">Task</p>
          <label className="text-s" htmlFor="title">
            <span className="text-m font-bold pr-2">업무 내용</span>
            Story를 구현하기 위해 필요한 업무를 작성합니다
          </label>
          <input
            className="w-full py-2 px-2.5 border rounded-sm border-starbucks-green outline-starbucks-green text-s"
            type="text"
            id="title"
            name="title"
            placeholder="어떤 업무를 수행할 예정인가요?"
            defaultValue={defaultData?.title}
          />
          <div className="flex flex-col gap-2">
            <label className="text-s" htmlFor="condition">
              <span className="text-m font-bold pr-2">인수조건</span>
              Task를 완료하기 위한 조건을 작성합니다.
            </label>
            <textarea
              className="w-full py-2 px-2.5 resize-none border rounded-sm border-starbucks-green outline-starbucks-green text-s "
              rows={4}
              id="condition"
              name="condition"
              placeholder={
                '예시 조건)\n' +
                '몇 개의 테스트 코드를 통과해야 합니다\n' +
                '사전에 작성한 예상 유저 시나리오와 비교하여 동작을 확인합니다'
              }
              defaultValue={defaultData?.condition}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="userId" className="text-s">
              <span className="text-m font-bold pr-2">담당자</span>
              Task를 수행할 멤버를 선정합니다
            </label>
            <input
              className="w-[9.375rem] py-2 px-2.5 border rounded-sm border-starbucks-green outline-starbucks-green text-s"
              type="text"
              id="userId"
              name="userId"
              placeholder="담당자"
              defaultValue={defaultData?.userId}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="point" className="text-s">
              <span className="text-m font-bold pr-2">Point</span>
              Task를 완료하기 위해 소요되는 시간을 예상합니다
            </label>

            <div className="flex w-[9.375rem] pr-3 items-center border rounded-sm border-starbucks-green justify-between">
              <input
                className="w-full py-2 px-2.5 text-s outline-none"
                type="number"
                id="point"
                name="point"
                defaultValue={defaultData?.point}
              />
              <p className="font-bold text-starbucks-green">Point</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="border-2 rounded-md border-starbucks-green px-4 py-1.5 font-bold text-starbucks-green text-s"
              onClick={close}
            >
              취소
            </button>
            <button
              type="submit"
              className="border-2 rounded-md border-starbucks-green px-4 py-1.5 bg-starbucks-green font-bold text-true-white text-s"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
