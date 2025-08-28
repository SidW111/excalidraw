export default function AuthPage({ IsSignIn }: { IsSignIn: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-5 m-5">
        <div className="flex flex-col gap-2">
          {!IsSignIn && <input type="text" placeholder="name" className="border  p-2 rounded-md"/>}
          <input type="text" placeholder="email" className="border  p-2 rounded-md" />
          <input type="password" placeholder="password" className="border  p-2 rounded-md" />
          <button className="rounded  py-2 border  cursor-pointer bg-blue-500 hover:bg-blue-700">{IsSignIn ? "Sign In" : "Sign Up"}</button>
        </div>
      </div>
    </div>
  );
}
