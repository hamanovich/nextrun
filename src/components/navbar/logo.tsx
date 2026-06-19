export const Logo = ({
  size = 30,
  alt = "NextRun.dev",
  className,
}: {
  size?: number;
  alt?: string;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="none"
    role="img"
    aria-label={alt}
    className={className}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M56 0h144a56 56 0 0 1 56 56v144a56 56 0 0 1-56 56H56a56 56 0 0 1-56-56V56A56 56 0 0 1 56 0Zm18 64h44l30 54v-54h34v128h-44l-30-54v54H74V64Z"
    />
  </svg>
);
