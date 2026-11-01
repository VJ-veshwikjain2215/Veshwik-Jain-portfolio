import { FaJava, FaWindows } from "react-icons/fa6";
import {
  SiSpringboot,
  SiReact,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiMysql,
  SiGithub,
  SiLinux,
  SiGit,
} from "react-icons/si";
import { LuDatabase, LuCodeXml } from "react-icons/lu";
import { TbApi, TbSql, TbBrandCpp } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";

const icons = {
  Java: FaJava,
  "Spring Boot": SiSpringboot,
  "REST APIs": TbApi,
  React: SiReact,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  CSS: SiCss,
  MySQL: SiMysql,
  DBMS: LuDatabase,
  SQL: TbSql,
  Git: SiGit,
  GitHub: SiGithub,
  "VS Code": VscVscode,
  Linux: SiLinux,
  Windows: FaWindows,
  "C/C++": TbBrandCpp,
};
export default function TechnologyLabel({ name }) {
  const Icon = icons[name] || LuCodeXml;
  return (
    <span className="tech-label">
      <Icon aria-hidden="true" focusable="false" />
      <span>{name}</span>
    </span>
  );
}
