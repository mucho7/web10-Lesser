import { ChangeEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SIGNUP_STEP } from "../../constants/account";
import NextStepButton from "../common/NextStepButton";
import {
  getGithubUsername,
  getNicknameAvailability,
} from "../../apis/api/signupAPI";
import useWheelDown from "../../hooks/pages/account/useWheelDown";
import useDebounce from "../../hooks/common/useDebounce";

interface NicknameInputProps {
  currentStepNumber: number;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<{ NUMBER: number; NAME: string }>
  >;
  nicknameValueRef: React.MutableRefObject<string>;
  inputElementRef: React.MutableRefObject<HTMLInputElement | null>;
}

const NicknameInput = ({
  currentStepNumber,
  setCurrentStep,
  nicknameValueRef,
  inputElementRef,
}: NicknameInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [validated, setValidated] = useState<boolean | null>(null);
  const debounce = useDebounce();
  const location = useLocation();

  const goToNextStep = () => {
    inputElementRef.current?.blur;
    setCurrentStep(SIGNUP_STEP.STEP2);
  };

  useWheelDown({
    currentStepNumber,
    targetStepNumber: SIGNUP_STEP.STEP1.NUMBER,
    dependency: validated,
    goToNextStep,
  });

  const nicknameAvailabilityCheck = async () => {
    if (!inputValue) {
      return;
    }

    const available = await getNicknameAvailability(inputValue);
    if (available) {
      setValidated(true);
    } else {
      setValidated(false);
    }
  };

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const value = target.value.trim();
    setInputValue(value);
    nicknameValueRef.current = value;
  };

  const handleEnterDown = ({ key }: React.KeyboardEvent) => {
    if (key === "Enter" && validated) {
      goToNextStep();
    }
  };

  useEffect(() => {
    setValidated(null);
    debounce(1000, nicknameAvailabilityCheck);
  }, [inputValue]);

  useEffect(() => {
    const getUsername = async () => {
      const githubUsername = await getGithubUsername(
        location.state.tempIdToken
      );
      setInputValue(githubUsername);
      nicknameValueRef.current = githubUsername;
    };

    getUsername();
  }, []);

  return (
    <div
      className={`flex gap-[4.375rem] h-[100%] ${
        currentStepNumber === SIGNUP_STEP.STEP1.NUMBER
          ? "items-center"
          : "items-end"
      }`}
    >
      <div className="w-[80%]">
        <label
          className="text-3xl font-semibold text-dark-gray"
          htmlFor="nickname"
        >
          LESSER에서 사용할 제 이름은
        </label>
        <br />
        <div className="flex w-[525px]">
          <div className="inline">
            <input
              type="text"
              name="nickname"
              id="nickname"
              ref={inputElementRef}
              value={inputValue}
              autoComplete="off"
              onChange={handleInputChange}
              onKeyDown={handleEnterDown}
              className={`w-[27.5rem] h-[3rem] border-b-2 focus:outline-none focus:border-b-3 font-semibold text-3xl ${
                inputValue && validated && "border-b-3 border-middle-green "
              } 
              ${
                validated !== null && !validated
                  ? "border-b-3 border-error-red focus:border-error-red"
                  : "focus:border-middle-green"
              }`}
            />
            {validated !== null && !validated && (
              <p className="font-bold text-error-red text-xxs">
                이미 사용 중인 닉네임입니다
              </p>
            )}
          </div>
          <span className="text-3xl font-semibold text-dark-gray">입니다</span>
        </div>
      </div>
      <div className="min-w-[6.875rem] self-end">
        {validated && currentStepNumber !== SIGNUP_STEP.STEP2.NUMBER && (
          <NextStepButton onNextButtonClick={goToNextStep}>Next</NextStepButton>
        )}
      </div>
    </div>
  );
};

export default NicknameInput;
