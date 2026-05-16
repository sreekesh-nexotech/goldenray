import Link from "next/link";

type ButtonProps = {
  content: string;
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
