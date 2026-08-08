import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { atomOneLight } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import bash from "react-syntax-highlighter/dist/cjs/languages/hljs/bash";
import css from "react-syntax-highlighter/dist/cjs/languages/hljs/css";
import dockerfile from "react-syntax-highlighter/dist/cjs/languages/hljs/dockerfile";
import go from "react-syntax-highlighter/dist/cjs/languages/hljs/go";
import java from "react-syntax-highlighter/dist/cjs/languages/hljs/java";
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json";
import markdown from "react-syntax-highlighter/dist/cjs/languages/hljs/markdown";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import rust from "react-syntax-highlighter/dist/cjs/languages/hljs/rust";
import sql from "react-syntax-highlighter/dist/cjs/languages/hljs/sql";
import typescript from "react-syntax-highlighter/dist/cjs/languages/hljs/typescript";
import xml from "react-syntax-highlighter/dist/cjs/languages/hljs/xml";
import yaml from "react-syntax-highlighter/dist/cjs/languages/hljs/yaml";
import { normalizeLanguage } from "@/lib/markdown/language";

const languages: Array<[string, Parameters<typeof SyntaxHighlighter.registerLanguage>[1]]> = [
  ["bash", bash],
  ["css", css],
  ["dockerfile", dockerfile],
  ["go", go],
  ["java", java],
  ["javascript", javascript],
  ["json", json],
  ["markdown", markdown],
  ["python", python],
  ["rust", rust],
  ["sql", sql],
  ["typescript", typescript],
  ["tsx", typescript],
  ["jsx", javascript],
  ["html", xml],
  ["xml", xml],
  ["yaml", yaml],
];

for (const [name, grammar] of languages) {
  SyntaxHighlighter.registerLanguage(name, grammar);
}

interface Props {
  code: string;
  language: string;
  isDark: boolean;
  showLineNumbers: boolean;
}

export default function SyntaxHighlighterClient({ code, language, isDark, showLineNumbers }: Props) {
  const style = isDark ? atomOneDark : atomOneLight;
  const hljsLanguage = normalizeLanguage(language);

  return (
    <SyntaxHighlighter
      language={hljsLanguage}
      style={style}
      customStyle={{
        margin: 0,
        padding: "1.25rem",
        fontSize: "0.875rem",
        lineHeight: "1.6",
        background: isDark ? "hsl(220 13% 11%)" : "hsl(220 14% 97%)",
      }}
      showLineNumbers={showLineNumbers}
      lineNumberStyle={{
        minWidth: "2.5em",
        paddingRight: "1em",
        color: isDark ? "hsl(220 13% 40%)" : "hsl(220 14% 65%)",
        userSelect: "none",
      }}
      wrapLongLines={false}
    >
      {code}
    </SyntaxHighlighter>
  );
}
