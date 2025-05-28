import Link from "next/link"

type ButtonWhiteProps = {
    content: string,
    ButtonLink: string,
}

export default function ButtonWhite({
  content,
  ButtonLink,
}:ButtonWhiteProps) {
    return (
        <Link href={ButtonLink} className="btn bg-[#FFFFFF] text-[#272218] hover:bg-[#d7d4d4]">
              {content}
        </Link>
    )
    
}