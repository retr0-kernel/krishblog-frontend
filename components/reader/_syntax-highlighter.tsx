import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { atomOneLight } from "react-syntax-highlighter/dist/cjs/styles/hljs";

interface Props {
  code: string;
  language: string;
  isDark: boolean;
  showLineNumbers: boolean;
}

export default function SyntaxHighlighterClient({ code, language, isDark, showLineNumbers }: Props) {
  const style = isDark ? atomOneDark : atomOneLight;

  return (
    <SyntaxHighlighter
      language={language}
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

