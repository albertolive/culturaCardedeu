import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const AdArticle = dynamic(() => import("@components/ui/adArticle"), {
  loading: () => "",
  ssr: false,
});

const RenderButton = ({ text, goTo }) => {
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
    <>
      <div className="min-h-[325px] lg:min-h-[100px]">
        <AdArticle slot="6387726014" />
      </div>
      <div className="flex justify-center my-4">
        <RenderButton text="Agenda" goTo="/" />
        <RenderButton text="Avui" goTo="/avui-a-cardedeu" />
        <RenderButton
          text="El cap de setmana"
          goTo="/cap-de-setmana-a-cardedeu"
        />
        <RenderButton text="Aquesta setmana" goTo="/setmana-a-cardedeu" />
      </div>
    </>
  );
}
