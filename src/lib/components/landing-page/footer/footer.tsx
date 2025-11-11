"use client";

import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-footer text-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-10">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-brand grid place-items-center font-bold text-white">
                F
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">FreshMart</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-5 sm:leading-6">
              Nền tảng thực phẩm trực tuyến hàng đầu Việt Nam, giao hàng tươi sống chất lượng đến tận nhà từ 2025.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <Link href="https://www.facebook.com/tran.tien.343643/" aria-label="Facebook" className="hover:text-brand transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://www.instagram.com/trntin_203/" aria-label="Instagram" className="hover:text-brand transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://www.youtube.com/@TiensenseiDM" aria-label="Youtube" className="hover:text-brand transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="https://x.com/Tiensensei" aria-label="Twitter" className="hover:text-brand transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Giới thiệu</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li><Link className="hover:text-white transition-colors" href="#">Về chúng tôi</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Tất cả sản phẩm</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Ưu đãi đặc biệt</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Theo dõi đơn hàng</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Liên hệ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li><Link className="hover:text-white transition-colors" href="#">Trung tâm trợ giúp</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Chính sách đổi trả</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Hướng dẫn mua hàng</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Chính sách bảo mật</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-white font-semibold text-sm sm:text-base">Liên hệ với chúng tôi</h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-white font-medium">Hotline: 1900 1234</span>
                  <span className="text-slate-400 text-xs">7:30 - 21:00 (Miễn phí)</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" />
                <span>support@freshmart.vn</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" />
                <span className="leading-5">
                  41 Phạm Văn Trị, P.Gò Vấp<br />TP. Hồ Chí Minh
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-white font-semibold text-sm sm:text-base">Đăng ký nhận tin</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Nhận thông tin khuyến mãi và tin tức mới nhất
            </p>
            <form className="space-y-2">
              <input
                type="email"
                required
                placeholder="Nhập email của bạn"
                className="w-full rounded-lg border border-footer-border bg-slate-800/50 px-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center rounded-lg bg-brand px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-brand/90 transition-colors"
              >
                Đăng ký ngay
              </button>
            </form>

            <div className="pt-2">
              <p className="text-xs text-slate-400 mb-2">Tải app FreshMart</p>
              <div className="flex gap-2">
                <Link href="#" className="flex-1">
                  <div className="bg-slate-800/50 hover:bg-slate-800 transition-colors rounded-lg p-2 flex items-center gap-2 border border-footer-border">
                    <div className="bg-white rounded p-1">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] text-slate-400 leading-none">Tải về</p>
                      <p className="text-[11px] font-semibold text-white leading-tight">App Store</p>
                    </div>
                  </div>
                </Link>
                <Link href="#" className="flex-1">
                  <div className="bg-slate-800/50 hover:bg-slate-800 transition-colors rounded-lg p-2 flex items-center gap-2 border border-footer-border">
                    <div className="bg-white rounded p-1">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <path d="M3.609 3.609L13.5 13.5M13.5 13.5l7.5 7.5-3.609 2.109M13.5 13.5l7.5-7.5-18 3.609 7.5 7.5 3.609-2.109z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] text-slate-400 leading-none">Tải về</p>
                      <p className="text-[11px] font-semibold text-white leading-tight">Google Play</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 border-t border-footer-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-400">
              © 2025 FreshMart. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              GPĐKKD: 0123456789 do Sở KH & ĐT TP.HCM cấp ngày 23/11/2024
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Heart className="h-3.5 w-3.5 text-pink-500" />
            <span>Made with love in Vietnam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
