"use client";

import { useEffect, useRef, useState } from "react";

import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getClientAuth } from "../../fire-base/firebase";

export default function CheckoutPhoneOTP({
  onVerified,
}: {
  onVerified: (phone: string, idToken?: string) => void;
}) {
  const [phone, setPhone] = useState("+84");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    (async () => {
      const auth = await getClientAuth();

      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              // reCAPTCHA solved
            },
          }
        );
      }
    })();

    return () => {
      // optional: cleanup nếu cần
    };
  }, []);

  const sendOTP = async () => {
    try {
      setSending(true);
      const auth = await getClientAuth();
      if (!recaptchaRef.current) throw new Error("recaptcha not ready");

      const normalized = phone.trim();

      const confirmation = await signInWithPhoneNumber(
        auth,
        normalized,
        recaptchaRef.current
      );
      confirmationRef.current = confirmation;
      setSentTo(normalized);
    } catch (e: any) {
      alert(e?.message || "Cannot send OTP");
      try { await recaptchaRef.current?.render(); } catch {}
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setVerifying(true);
      if (!confirmationRef.current) throw new Error("No OTP in progress");
      const result = await confirmationRef.current.confirm(code);
      const idToken = await result.user.getIdToken();
      onVerified(sentTo!, idToken);
    } catch (e: any) {
      alert(e?.message || "Invalid code");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <div id="recaptcha-container" />

      {!sentTo ? (
        <>
          <label className="text-sm">Số điện thoại (E.164):</label>
          <input
            className="border rounded px-3 py-2"
            placeholder="+84..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            onClick={sendOTP}
            disabled={sending}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {sending ? "Đang gửi..." : "Gửi OTP"}
          </button>
          <p className="text-xs text-gray-500">
            * Firebase sẽ tự kiểm tra reCAPTCHA (invisible).
          </p>
        </>
      ) : (
        <>
          <div className="text-sm">
            Mã OTP đã gửi tới <b>{sentTo}</b>
          </div>
          <input
            className="border rounded px-3 py-2"
            placeholder="Nhập mã 6 số"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={verifyOTP}
            disabled={verifying}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {verifying ? "Đang xác thực..." : "Xác thực"}
          </button>

          <button
            onClick={() => {
              setSentTo(null);
              confirmationRef.current = null;
              setCode("");
            }}
            className="text-sm underline"
          >
            Đổi số điện thoại
          </button>
        </>
      )}
    </div>
  );
}
