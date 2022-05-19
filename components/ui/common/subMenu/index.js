import { useRouter } from "next/router";

const renderButton = (text, goTo) => {
  const router = useRouter();
  const pathname = router.pathname;
  const isActiveLink = pathname === goTo ? "bg-[#ECB84A]" : "bg-gray-800";

  return (
    <button
      className={`relative inline-flex items-center px-4 mx-1 py-2 border border-transparent shadow-md text-sm font-medium rounded-md text-white ${isActiveLink} hover:bg-yellow-400 focus:outline-none`}
      type="button"
      onClick={() => router.push(goTo)}
    >
      {text}
    </button>
  );
};

export default function SubMenu() {
  return (
    <div className="flex justify-center mb-4">
      {renderButton("Agenda", "/")}
      {renderButton("Avui", "/avui-a-cardedeu")}
      {renderButton("El cap de setmana", "/cap-de-setmana-a-cardedeu")}
      {renderButton("Aquesta setmana", "/setmana-a-cardedeu")}
    </div>
  );
}
