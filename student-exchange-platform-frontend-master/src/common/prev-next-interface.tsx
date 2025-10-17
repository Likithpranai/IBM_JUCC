import React from "react";

export interface PrevNextInterfaceProps<T> {
    onPrev: ((() => void) | React.Dispatch<React.SetStateAction<T>>)[],
    onNext: ((() => void) | React.Dispatch<React.SetStateAction<T>>)[],
}