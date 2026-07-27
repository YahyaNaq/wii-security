import Image from "next/image";
import { useTheme } from "../theme/ThemeContext";

export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  const { mode, toggleMode } = useTheme();

  return (
    <Image
      src="/wii-security-logo.png"
      alt="WII Security"
      width={1500}
      height={1500}
      className={`${className} object-contain rounded-md ${mode === 'dark' ? 'bg-foreground' : ''}`}
      priority
    />
  );
}
