"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Countdown() {
    const [duration, setDuration] = useState<number | string>("");
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleSetDuration = (): void => {
        if (typeof duration === "number" && duration > 0) {
            setTimeLeft(duration);
            setIsActive(false);
            setIsPaused(false);
            setDuration("");
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const handleStart = (): void => {
        if (timeLeft > 0) {
            setIsActive(true);
            setIsPaused(false);
        }
    };

    const handlePause = (): void => {
        if (isActive) {
            setIsPaused(true);
            setIsActive(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const handleReset = (): void => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(typeof duration === "number" ? duration : 0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        if (isActive && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current!);
                        timerRef.current = null;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isActive, isPaused]);

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (!isNaN(value)) {
            setDuration(value);
        } else {
            setDuration("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 p-4">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md transform transition-transform hover:scale-105">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center underline">Countdown Timer</h1>

                <div className="mb-6">
                    <Input
                        type="number"
                        placeholder="Enter duration in seconds"
                        value={duration}
                        onChange={handleDurationChange}
                        className="w-full p-3 border border-black-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    />
                    <Button
                        onClick={handleSetDuration}
                        className="w-full mt-3 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 active:bg-green-800 transition-all"
                    >
                        Set Duration
                    </Button>
                </div>

                <div className="text-4xl font-mono text-indigo-600 mb-6 text-center">
                    {formatTime(timeLeft)}
                </div>

                <div className="flex space-x-4 justify-center">
                    <Button
                        onClick={handleStart}
                        disabled={isActive || timeLeft === 0}
                        className="bg-purple-500 text-white py-2 px-6 rounded-lg hover:bg-purple-600 active:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all"
                    >
                        Start
                    </Button>
                    <Button
                        onClick={handlePause}
                        disabled={!isActive}
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
                    >
                        Pause
                    </Button>
                    <Button
                        onClick={handleReset}
                        className="bg-pink-500 text-white py-2 px-6 rounded-lg hover:bg-pink-600 active:bg-pink-700 transition-all"
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Countdown; 