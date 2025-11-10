import Image from 'next/image'
import Link from 'next/link'

interface CoverImageProps {
  title: string
  slug?: string
  image: string
  priority?: boolean
  className?: string
  fill?: boolean
}

export default function CoverImage(props: CoverImageProps) {
  const { title, slug, image, priority, className, fill } = props

  const img = (
    <Image
      src={image}
      alt={title}
      priority={priority}
      className={className}
      fill={fill}
      sizes="100vw"
    />
  )

  return slug ? (
    <Link href={`/posts/${slug}`} aria-label={title} className="contents">
      {img}
    </Link>
  ) : (
    img
  )
}