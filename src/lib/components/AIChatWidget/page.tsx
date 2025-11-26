"use client";

import { MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../interface/ai";
import { AIService } from "../../service/ai.service";

export default function AIChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg: Message = { role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const data = await AIService.sendMessage(input);
            const aiMessage: Message = {
                role: "ai",
                text: data.reply || "Xin lỗi, tôi không tìm thấy thông tin phù hợp.",
                products: data.products || [],
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: "⚠️ Lỗi kết nối tới hệ thống, vui lòng thử lại sau.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 font-roboto">
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="relative bg-brand w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-300"
                >
                    <div className="bg-gradient-to-tr from-green-400 to-emerald-500 text-white p-2 md:p-2.5 rounded-full shadow-md">
                        <MessageCircleMore className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-white text-brand text-[9px] md:text-[10px] font-semibold px-1 rounded-full shadow">
                        Trợ lý AI
                    </span>
                </button>

            )}

            {open && (
                <div
                    className="animate-fadeIn bg-white
      w-[calc(100vw-3rem)] max-w-sm
      h-[65vh] max-h-[520px]
      md:w-[360px] md:h-[480px]
      flex flex-col rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-emerald-500 to-brand text-white px-3 py-2.5 md:px-4 md:py-3 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="bg-white text-brand font-bold flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full shadow-sm text-xs md:text-sm">
                                FM
                            </div>
                            <div>
                                <p className="text-xs md:text-sm font-semibold leading-none">FreshMart AI</p>
                                <p className="text-[10px] md:text-xs opacity-90">Hỗ trợ mua sắm nhanh</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-100 text-lg md:text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    <div
                        ref={chatRef}
                        className="flex-1 p-3 md:p-4 overflow-y-auto space-y-2.5 md:space-y-3 bg-gray-50 text-xs md:text-sm"
                    >
                        {messages.length === 0 && !loading && (
                            <div className="text-gray-400 text-center mt-6 md:mt-10 italic text-xs md:text-sm px-2">
                                👋 Xin chào! Tôi là trợ lý AI của FreshMart.<br />
                                Hãy hỏi tôi về sản phẩm, danh mục hoặc khuyến mãi nhé 💚
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`p-2.5 md:p-3 max-w-[85%] md:max-w-[80%] whitespace-pre-line rounded-2xl shadow-soft ${msg.role === "user"
                                        ? "bg-green-100 text-gray-800 rounded-br-none"
                                        : "bg-white border border-gray-200 text-gray-700 rounded-bl-none"
                                        }`}
                                >
                                    <div className="text-xs md:text-sm">{msg.text}</div>

                                    {msg.products && msg.products.length > 0 && (
                                        <div className="mt-2 md:mt-3 grid grid-cols-1 gap-2 md:gap-3">
                                            {msg.products.map((p: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 md:gap-3 bg-gray-50 border border-gray-200 rounded-xl p-1.5 md:p-2 shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg border flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs md:text-sm font-medium text-gray-800 line-clamp-1">{p.name}</p>
                                                        <p className="text-green-600 text-[10px] md:text-xs font-semibold">
                                                            {Number(p.price || 0).toLocaleString("vi-VN")}₫
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => router.push(`/products/${p.id}`)}
                                                        className="bg-brand text-white text-[10px] md:text-xs px-2 py-1 rounded-lg hover:bg-emerald-600 flex-shrink-0"
                                                    >
                                                        Mua
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex items-center space-x-2 text-gray-400 text-xs md:text-sm italic">
                                <div className="animate-bounce">●</div>
                                <div className="animate-bounce delay-100">●</div>
                                <div className="animate-bounce delay-200">●</div>
                                <span>AI đang trả lời...</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t p-2.5 md:p-3 bg-white flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <input
                                className="flex-1 border rounded-full px-3 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                placeholder="Nhập câu hỏi..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                className="bg-brand text-white font-medium px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-full hover:bg-emerald-600 transition-all duration-200 disabled:opacity-60"
                            >
                                Gửi
                            </button>
                        </div>
                        <p className="text-[10px] md:text-[11px] text-gray-400 text-center px-1">
                            💡 Mẹo: hỏi "Mã giảm giá hôm nay?" hoặc "Tìm Coca-Cola 1.5L"
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
