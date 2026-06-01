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
      className={`btn ${ButtonBg} ${ButtonHover} ${Buttontext} ${ButtonBorder ?? ""} ${className ?? ""}`}
    >
      {content}
    </Link>
  );
}
