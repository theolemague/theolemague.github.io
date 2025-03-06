import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import confLabels from "../../../services/labels.json";
// import confAboutMe from "../../services/aboutMe.json";
import RESUME from "@/services/resume.json";
import { MONTHS } from "@/constants";
import OpacityWrapper from "./OpacityWrapper";

const formatDate = (date: Date, lang: "fr" | "en" = "fr") => {
  const month = MONTHS[lang][date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const AboutMe = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<"fr" | "en">("en");

  useEffect(() => {
    if (["fr", "en"].includes(i18n.language)) setLang(i18n.language as "fr" | "en");
    else setLang("en");
  }, [i18n.language]);

  // const labels = confLabels[props.language];
  return (
    <div className="py-4 space-y-12">
      <OpacityWrapper>
        <section className="space-y-6" id="about-me">
          <div className="flex items-center gap-10 my-4">
            <h2 className="font-mono text-2xl font-semibold">01. {t("about-me.title")}</h2>
            <div className="flex-1 h-px bg-white" />
          </div>
          <p>{t("about-me.text")}</p>
        </section>
      </OpacityWrapper>

      <OpacityWrapper>
        <section className="space-y-6" id="education">
          <div className="flex items-center gap-10 my-4">
            <div className="flex-1 h-px bg-white" />
            <h2 className="font-mono text-2xl font-semibold">02. {t("educations.title")}</h2>
          </div>
          <div className="px-12 space-y-4">
            {RESUME.educations.map((item, index) => (
              <Education key={index} data={item} lang={lang} />
            ))}
          </div>
        </section>
      </OpacityWrapper>
      <OpacityWrapper>
        <section className="space-y-6" id="education">
          <div className="flex items-center gap-10 my-4">
            <h2 className="font-mono text-2xl font-semibold">03. {t("works.title")}</h2>
            <div className="flex-1 h-px bg-white" />
          </div>
          <div className="px-12 space-y-4">
            {RESUME.works.map((item, index) => (
              <Work key={index} data={item} lang={lang} />
            ))}
          </div>
        </section>
      </OpacityWrapper>
      <OpacityWrapper>
        <section className="space-y-6" id="education">
          <div className="flex items-center gap-10 my-4">
            <div className="flex-1 h-px bg-white" />
            <h2 className="font-mono text-2xl font-semibold">04. {t("skills.title")}</h2>
          </div>
          <div className="px-12 space-y-4">
            {RESUME.skills.map((item, index) => (
              <Skill key={index} data={item} lang={lang} />
            ))}
          </div>
        </section>
      </OpacityWrapper>
    </div>
  );
};

interface EducationProps {
  data: {
    name: { fr: string; en: string };
    city: { fr: string; en: string };
    description: { fr: string; en: string };
    start: string;
    end: string;
  };
  lang: "fr" | "en";
}
const Education = ({ data, lang }: EducationProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="w-20 space-y-4">
        <p>{formatDate(new Date(data.start), lang)}</p>
        <p>{formatDate(new Date(data.end), lang)}</p>
      </div>
      <div className="flex-1 space-y-4">
        <h1 className="text-lg font-semibold">{data.name[lang]}</h1>
        <p className="text-sm">{data.city[lang]}</p>
        <p className="text-sm">{data.description[lang]}</p>
      </div>
    </div>
  );
};

interface WorkProps {
  data: {
    name: { fr: string; en: string };
    city: { fr: string; en: string };
    company: { fr: string; en: string };
    start: string;
    end: string;
    tasks: { fr: string; en: string }[];
  };
  lang: "fr" | "en";
}
const Work = ({ data, lang }: WorkProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="w-20 space-y-4">
        <p>{formatDate(new Date(data.start), lang)}</p>
        <p>{formatDate(new Date(data.end), lang)}</p>
      </div>
      <div className="flex-1 space-y-4">
        <h1 className="text-lg font-semibold">{data.name[lang]}</h1>
        <p className="text-sm">
          {data.company[lang]} - {data.city[lang]}
        </p>
        <div>
          {data.tasks.map((item, index) => (
            <p key={index} className="text-sm">
              {item[lang]}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SkillProps {
  data: {
    name: { fr: string; en: string };
    skills: { fr: string; en: string }[];
  };
  lang: "fr" | "en";
}
const Skill = ({ data, lang }: SkillProps) => {
  return (
    <div className="flex-1 space-y-4">
      <h2 className="text-lg font-semibold">{data.name[lang]}</h2>
      <div>
        {data.skills.map((item, index) => (
          <p key={index} className="text-sm">
            {item[lang]}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AboutMe;
