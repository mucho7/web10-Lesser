import { useEffect } from "react";
import { Link } from "react-router-dom";
import { TypingText } from "../components/login";

const TempHomepage = () => {
  useEffect(() => {
    fetch("/test").then(async (response) => {
      console.log(await response.json());
    });
  });
  return (
    <div>
      <div className="shadow-box bg-white mb-[40px]">
        <h1 className="text-xl">임시 페이지</h1>
      </div>
      <ul>
        <li>
          <Link to={"/login"} className="hover:underline">
            Log in
          </Link>
        </li>
        <li>
          <Link to={"/signup"} className="hover:underline">
            Sign up
          </Link>
        </li>
      </ul>
      <div className="w-screen border-4 border-black">
        <p className="text-xl font-bold">Typing 애니메이션 테스트</p>
        <p>애니메이션 문구 : abcdefg</p>
        <p>테스트 결과 :</p>
        <TypingText text="abcdefg" frame={100} startTime={0} />
        <TypingText text="abcdefg" frame={100} startTime={700} />
      </div>
    </div>
  );
};

export default TempHomepage;
