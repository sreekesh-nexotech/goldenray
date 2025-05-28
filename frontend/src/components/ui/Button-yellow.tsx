import Link from "next/link"

type ButtonYellowProps = {
    content: string,
    ButtonLink: string,
}

export default function ButtonYellow({
  content,
  ButtonLink,
}:ButtonYellowProps) {
    return (
        <Link href={ButtonLink} className="btn bg-[#F7BA41] text-[#272218] hover:bg-yellow-500">
              {content}
        </Link>
    )
    
}