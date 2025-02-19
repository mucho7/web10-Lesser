import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import useMemberStore from "../../../stores/useMemberStore";
import useThrottle from "../throttle/useThrottle";
import emitMemberStatusUpdate from "../../../utils/emitMemberStatusUpdate";
import { STORAGE_KEY } from "../../../constants/storageKey";

const useAwayUser = (socket: Socket) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const myInfo = useMemberStore((state) => state.myInfo);
  const [canAddStatusEventListener, setCanAddStatusEventListener] =
    useState(true);
  const throttle = useThrottle();
  const TIME = 1000 * 60 * 10;
  const THROTTLE_TIME = 3000;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const resetTimer = () => {
    timerRef.current = setTimeout(() => {
      emitMemberStatusUpdate(socket, {
        ...myInfo,
        status: "away",
      });

      clearTimer();
    }, TIME);
  };

  const handleUserStatus = () => {
    throttle(THROTTLE_TIME, () => {
      clearTimer();

      if (myInfo.status === "away") {
        emitMemberStatusUpdate(socket, {
          ...myInfo,
          status: "on",
        });
      }

      resetTimer();
    });
  };

  const handleCanAddStatusEventListener = (can: boolean) => {
    setCanAddStatusEventListener(can);
  };

  const addUserStatusEventListener = () => {
    window.addEventListener("mousemove", handleUserStatus);
    window.addEventListener("keydown", handleUserStatus);
    window.addEventListener("scroll", handleUserStatus);
    window.addEventListener("click", handleUserStatus);
    resetTimer();
  };

  const removeUserStatusEventListener = () => {
    window.removeEventListener("mousemove", handleUserStatus);
    window.removeEventListener("keydown", handleUserStatus);
    window.removeEventListener("scroll", handleUserStatus);
    window.removeEventListener("click", handleUserStatus);
    clearTimer();
  };

  useEffect(() => {
    if (canAddStatusEventListener) {
      addUserStatusEventListener();
    }

    if (
      localStorage.getItem(STORAGE_KEY.UPDATE_STATUS_WITH_INTENTION) === "true"
    ) {
      removeUserStatusEventListener();
      return;
    }

    return () => {
      removeUserStatusEventListener();
    };
  }, [myInfo]);

  return {
    addUserStatusEventListener,
    removeUserStatusEventListener,
    handleCanAddStatusEventListener,
  };
};

export default useAwayUser;
