import React, {useState, useEffect, useImperativeHandle, forwardRef} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

interface AlertDestructiveProps {
    message: string,
    className?: string,
    type: AlertDestructiveEnum;
}

export enum AlertDestructiveEnum {
    success = "success",
    error = "error",
}

const borderGradientColors = {
    error: "from-[#e74c3c] via-[#641e16] to-[#ec7063]",
    success: "from-[#138d75] via-[#0b5345] to-[#45b39d]",
};

const loadingGradientColors = {
    error: "from-[#e74c3c] to-[#ec7063]",
    success: "from-[#138d75] to-[#45b39d]",
};

const accentColors = {
    error: "text-[#e74c3c]",
    success: "text-[#138d75]",
};

// function PostIndex({ posts }: PostIndexProps)
export function AlertDestructive ({ message, className, type }: AlertDestructiveProps) {
    const [visible, setVisible] = useState(false)
    const [progress, setProgress] = useState(0)
    const duration = 10000
    const intervalTime = 50

    React.useEffect(() => resetAlert(), [message]);


    const resetAlert = () => {
        setProgress(0)
        setVisible(true)
    }

    useEffect(() => {
        if (!visible) return

        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev + (intervalTime / duration) * 100

                if (newProgress >= 100) {
                    clearInterval(interval)
                    setTimeout(() => setVisible(false), 100) // Small delay before hiding
                    return 100
                }

                return newProgress
            })
        }, intervalTime)

        return () => clearInterval(interval)
    }, [visible])

    if (!visible || message == '') return null;

    return (
        <div className={clsx(
            "w-80 bg-gradient-to-br rounded-lg p-1",
            className,
            borderGradientColors[type] || ""
        )}>
            <div className="flex-col bg-black/75 rounded-md p-3 relative overflow-clip ">
                <div className={accentColors[type]}>
                    {type === "error" ? (
                        <div className={"flex items-center justify-start font-bold"}>
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-3" />
                            <h6>Error</h6>
                        </div>
                    ) : (
                        <div className={"flex items-center justify-start font-bold"}>
                            <FontAwesomeIcon icon={faExclamationCircle} className="h-4 w-4 mr-3" />
                            <h6>Success</h6>
                        </div>
                    )}
                </div>
                <p>{message}</p>
            <div className="absolute top-0 left-0  h-1 bg-white/30 w-full rounded-full">
                    <div className={clsx(
                        "h-full bg-gradient-to-r transition-all duration-50 ease-linear",
                        loadingGradientColors[type],
                    )} style={{ width: `${progress}%` }} />
                </div>
            </div>
            {/* Progress bar at the bottom of the alert */}

        </div>
    )
}

