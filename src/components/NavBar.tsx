import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const ANCHORS = ["hello-world", "about-me", "works"];

const SideBar = () => {
  const { t } = useTranslation();
  const [activeAnchor, setActiveAnchor] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const currentAnchor = ANCHORS.find((anchor) => {
        const element = document.getElementById(anchor);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      });

      if (currentAnchor) setActiveAnchor(currentAnchor);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside className="h-full w-full flex flex-col justify-end items-end gap-6 py-24 px-6">
      <ul className="space-y-4">
        <li className={`text-lg text-right ${activeAnchor === "hello-world" ? "text-white font-semibold" : "text-gray-400"}`}>
          <a href="#hello-world">{t("navbar.home")}</a>
        </li>
        <li className={`text-lg text-right ${activeAnchor === "about-me" ? "text-white font-semibold" : "text-gray-400"}`}>
          <a href="#about-me">{t("navbar.me")}</a>
        </li>
        <li className={`text-lg text-right ${activeAnchor === "works" ? "text-white font-semibold" : "text-gray-400"}`}>
          <a href="#works">{t("navbar.works")}</a>
        </li>
      </ul>
    </aside>
  );
};
export default SideBar;
