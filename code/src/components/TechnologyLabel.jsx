import { FaJava } from "react-icons/fa6";
import {
  SiSpringboot,
  SiReact,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiGithub,
  SiGit,
  SiKotlin,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiFlyway,
  SiApachemaven,
  SiGithubactions,
} from "react-icons/si";
import { LuDatabase, LuCodeXml } from "react-icons/lu";
import { TbApi, TbSql } from "react-icons/tb";

const icons = {
  Java: FaJava,
  "Spring Boot": SiSpringboot,
  "REST APIs": TbApi,
  React: SiReact,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  CSS: SiCss,
  SQL: TbSql,
  Git: SiGit,
  GitHub: SiGithub,
  Kotlin: SiKotlin,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  PostgreSQL: SiPostgresql,
  JDBC: LuDatabase,
  Flyway: SiFlyway,
  Maven: SiApachemaven,
  "GitHub Actions": SiGithubactions,
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
