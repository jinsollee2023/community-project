import { objectType, IResolveParams } from "@/types/types";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

interface Props {
  scope?: string;
  prompt?: string;
  ux_mode?: string;
  client_id: string;
  login_hint?: string;
  access_type?: string;
  auto_select?: boolean;
  cookie_policy?: string;
  hosted_domain?: string;
  discoveryDocs?: string;
  children?: React.ReactNode;
  isOnlyGetToken?: boolean;
  typeResponse?: "idToken" | "accessToken";
  onReject: (reject: string | objectType) => void;
  fetch_basic_profile?: boolean;
  onResolve: ({ provider, data }: IResolveParams) => void;
}

const JS_SRC = "https://accounts.google.com/gsi/client";
const SCRIPT_ID = "google-login";
const _window = window as any;

const GoogleLogin = ({
  client_id,
  scope = "https://www.googleapis.com/auth/userinfo.profile",
  prompt = "select_account",
  typeResponse = "accessToken",
  ux_mode,
  access_type = "online",
  onReject,
  onResolve,
  auto_select = false,
  isOnlyGetToken = false,
  cookie_policy = "single_host_origin",
  children,
  fetch_basic_profile = true,
}: Props) => {
  const scriptNodeRef = useRef<HTMLScriptElement>(null!);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [instance, setInstance] = useState<any>(null!);
  const redirect_uri = "https://community-project-js.vercel.app/auth";
  // const redirect_uri = "http://localhost:5173/auth";

  useEffect(() => {
    !isSdkLoaded && load();
  }, [isSdkLoaded]);

  useEffect(
    () => () => {
      if (scriptNodeRef.current) scriptNodeRef.current.remove();
    },
    []
  );

  const checkIsExistsSDKScript = useCallback(() => {
    return !!document.getElementById(SCRIPT_ID);
  }, []);

  const insertScriptGoogle = useCallback(
    (
      d: HTMLDocument,
      s: string = "script",
      id: string,
      jsSrc: string,
      cb: () => void
    ) => {
      const ggScriptTag: any = d.createElement(s);
      ggScriptTag.id = id;
      ggScriptTag.src = jsSrc;
      ggScriptTag.async = true;
      ggScriptTag.defer = true;
      const scriptNode = document.getElementsByTagName("script")![0];
      scriptNodeRef.current = ggScriptTag;
      scriptNode &&
        scriptNode.parentNode &&
        scriptNode.parentNode.insertBefore(ggScriptTag, scriptNode);
      ggScriptTag.onload = cb;
    },
    []
  );

  const handleResponse = useCallback(
    (res: objectType) => {
      if (res && access_type === "offline") {
        onResolve({
          provider: "google",
          data: res,
        });
      } else {
        if (res?.access_token) {
          if (isOnlyGetToken) {
            onResolve({
              provider: "google",
              data: res,
            });
          } else {
            fetch(
              `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${res.access_token}`
            )
              .then((response) => response.json())
              .then((userInfo) => {
                localStorage.setItem("user", JSON.stringify(userInfo));
                onResolve({
                  provider: "google",
                  data: userInfo,
                });
              })
              .catch((err) => {
                console.error("Error fetching user info:", err);
                onReject(err);
              });
          }
        } else {
          const data: objectType = res;
          if (isOnlyGetToken) {
            onResolve({
              provider: "google",
              data,
            });
          } else {
            onReject("Failed to retrieve access token");
          }
        }
      }
    },
    [access_type, isOnlyGetToken, onResolve, onReject]
  );

  const handleError = useCallback(
    (res: objectType) => {
      onReject({
        provider: "google",
        data: res,
      });
    },
    [onReject]
  );

  const load = useCallback(() => {
    if (checkIsExistsSDKScript()) {
      setIsSdkLoaded(true);
    } else {
      insertScriptGoogle(document, "script", SCRIPT_ID, JS_SRC, () => {
        const params = {
          client_id,
          ux_mode,
        };
        var client = null;
        if (typeResponse === "idToken") {
          _window.google.accounts.id.initialize({
            ...params,
            auto_select,
            prompt: "select_account",

            login_uri: redirect_uri,
            callback: handleResponse,
            native_callback: handleResponse,
            error_callback: handleError,
          });
        } else {
          const payload = {
            ...params,
            scope,
            prompt,
            access_type,
            redirect_uri,
            cookie_policy,
            immediate: true,
            fetch_basic_profile,
            callback: handleResponse,
            error_callback: handleError,
          };
          if (access_type === "offline") {
            client = _window.google.accounts.oauth2.initCodeClient(payload);
          } else
            client = _window.google.accounts.oauth2.initTokenClient(payload);
        }

        if (client) setInstance(client);
        setIsSdkLoaded(true);
      });
    }
  }, [
    scope,
    prompt,
    ux_mode,
    client_id,
    auto_select,
    access_type,
    redirect_uri,
    typeResponse,
    cookie_policy,
    handleResponse,
    handleError,
    fetch_basic_profile,
    insertScriptGoogle,
    checkIsExistsSDKScript,
  ]);

  const loginGoogle = useCallback(() => {
    if (!isSdkLoaded) return;
    if (!_window.google) {
      load();
      onReject("Google SDK isn't loaded!");
    } else {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=token&scope=email profile`;
    }
  }, [access_type, instance, isSdkLoaded, load, onReject]);

  return <div onClick={loginGoogle}>{children}</div>;
};

export default memo(GoogleLogin);
