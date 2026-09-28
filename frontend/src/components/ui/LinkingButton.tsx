import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  content: ReactNode;
  ButtonLink: string;
  ButtonBg: string;
  ButtonHover: string;
  Buttontext: string;
  ButtonBorder?: string;
  className?: string;
};

export default function LinkingButton({
  content,
  ButtonLink,
  ButtonBg,
  ButtonHover,
  Buttontext,
  ButtonBorder,
  className,
}: ButtonProps) {
  return (
    <Link
      href={ButtonLink}
      className={`btn w-full justify-center rounded-xl border border-transparent text-[14px] font-semibold leading-[20px] transition-all duration-200 sm:w-auto ${ButtonBg} ${ButtonHover} ${Buttontext} ${ButtonBorder ?? ""} ${className ?? ""}`}
    >
      {content}
    </Link>
  );
}
