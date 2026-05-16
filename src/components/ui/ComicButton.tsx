import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const comicButtonVariants = cva(
    "border-4 border-black font-comic-title tracking-widest transition-all cursor-pointer inline-flex items-center justify-center shadow-comic active:translate-x-[2px] active:translate-y-[2px] active:shadow-comic-active disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                red: "bg-comic-red text-white hover:bg-red-500",
                blue: "bg-comic-blue text-black hover:bg-blue-300",
                green: "bg-comic-green text-black hover:bg-green-400",
                white: "bg-white text-black hover:bg-gray-100",
                cyan: "bg-comic-cyan text-black hover:bg-cyan-200",
            },
            size: {
                xs: "text-xs py-1 px-3 border-[3px] shadow-[2px_2px_0_0_#000] active:shadow-[1px_1px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px]",
                md: "text-xl px-6 py-2",
                lg: "text-2xl px-6 py-2",
            }
        },
        defaultVariants: {
            variant: "white",
            size: "md",
        }
    }
);

export interface ComicButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof comicButtonVariants> { }

export const ComicButton: React.FC<ComicButtonProps> = ({
    className,
    variant,
    size,
    ...props
}) => {
    return (
        <button
            className={cn(comicButtonVariants({ variant, size, className }))}
            {...props}
        />
    );
};
