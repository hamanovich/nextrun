import Image from "next/image";
import LogoImg from "@/public/logo.png";

export const Logo = ({
  size = 30,
  alt = "NextRun.dev",
  priority = false,
}: {
  size?: number;
  alt?: string;
  priority?: boolean;
}) => {
  return (
    <Image
      src={LogoImg}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
    />
  );
};
