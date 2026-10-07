import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type RouteState = { path: string; parts: string[]; loading: boolean };

const RouteCtx = createContext<RouteState>({ path: "/", parts: [], loading: false });

function parse(): { path: string; parts: string[] } {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return { path, parts: path.split("/").filter(Boolean) };
}

export function useRouteContext() {
  return useContext(RouteCtx);
}

export function RouteProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => parse());
  const [loading, setLoading] = useState(false);

  const onHash = useCallback(() => {
    const next = parse();
    setLoading(true);
    window.setTimeout(() => {
      setState(next);
      window.scrollTo({ top: 0, behavior: "auto" });
      window.setTimeout(() => setLoading(false), 80);
    }, 160);
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = "/";
    return () => window.removeEventListener("hashchange", onHash);
  }, [onHash]);

  return (
    <RouteCtx.Provider value={{ ...state, loading }}>{children}</RouteCtx.Provider>
  );
}

export function Link({
  to,
  className = "",
  children,
  ariaLabel,
  onClick,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  const href = `#${to.startsWith("/") ? to : `/${to}`}`;
  return (
    <a href={href} className={className} aria-label={ariaLabel} onClick={() => onClick?.()}>
      {children}
    </a>
  );
}
