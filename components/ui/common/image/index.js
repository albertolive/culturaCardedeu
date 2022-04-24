import { useState } from "react";
import Image from "next/image";

const DEFAULT_IMAGE = "/static/images/locations/cardedeu/1.jpeg";

export default function ImageComponent({
  title,
  image = DEFAULT_IMAGE,
  width = 200,
  height = 230,
  className,
}) {
  const [src, setSrc] = useState(image);

  const onError = () => setSrc(DEFAULT_IMAGE);

  return (
    <div className={`flex-1 h-full next-image-wrapper ${className}`}>
      <Image
        className="object-cover"
        src={src}
        layout="responsive"
        width={width}
        height={height}
        alt={title}
        placeholder="blur"
        blurDataURL="/static/images/blur.png"
        onError={onError}
      />
    </div>
  );
}
