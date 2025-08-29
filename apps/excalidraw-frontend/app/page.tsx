import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen flex items-center justify-center gap-3">
      <Link href="/signup">
        <button className="px-6 py-3 rounded bg-blue-500 hover:bg-blue-600 text-white">Sign Up</button>
      </Link>
      <Link href="/signin">
        <button className="px-6 py-3 rounded bg-blue-500 hover:bg-blue-600 text-white">Sign In</button>
      </Link>
    </div>
  );
}
