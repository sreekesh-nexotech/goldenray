import Link from "next/link"

type ButtonProps = {
    content: string;
    ButtonLink: string;
    ButtonBg: string;
    ButtonHover: string;
    Buttontext: string;
    ButtonBorder?: string;
}

export default function LinkingButton({
  content,
  ButtonLink,
  ButtonBg,
  ButtonHover,
  Buttontext,
  ButtonBorder,
}:ButtonProps) {
    return (
        <Link href={ButtonLink} className={`btn  ${ButtonBg} ${ButtonHover} ${Buttontext}  ${ButtonBorder}`}>
              {content} 
        </Link>
    )
    
}