import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import OpacityWrapper from "./OpacityWrapper";

const HelloWorld = () => {
  const { t } = useTranslation();
  return (
    <OpacityWrapper>
      <section className="space-y-6" id="hello-world">
        <h2 className="font-mono font-semibold text-3xl text-slate-400">{t("home.hello-world")}</h2>
        <h1 className="text-5xl font-bold">{t("home.i-am-theo")}</h1>
        <h3 className="text-4xl font-bold text-gray-200">{t("home.job-title")}</h3>
        <p className="text-lg">{t("home.presentation")}</p>
        <Link to="/works" className="link">
          {t("home.my-works")}
        </Link>
      </section>
    </OpacityWrapper>
  );
};

export default HelloWorld;
