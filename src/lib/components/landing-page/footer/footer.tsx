"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-footer text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-brand grid place-items-center font-bold">
                F
              </div>
              <span className="text-2xl font-bold">FreshMart</span>
            </div>
            <p className="text-slate-400 text-sm leading-6 max-w-md">
              Vietnam&apos;s premier online food marketplace, delivering fresh,
              quality groceries to your doorstep since 2024.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 hover:text-white" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 hover:text-white" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 hover:text-white" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link className="hover:text-white" href="#">About Us</Link></li>
              <li><Link className="hover:text-white" href="#">All Products</Link></li>
              <li><Link className="hover:text-white" href="#">Special Deals</Link></li>
              <li><Link className="hover:text-white" href="#">Track Order</Link></li>
              <li><Link className="hover:text-white" href="#">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link className="hover:text-white" href="#">Help Center</Link></li>
              <li><Link className="hover:text-white" href="#">Returns &amp; Refunds</Link></li>
              <li><Link className="hover:text-white" href="#">Shipping Info</Link></li>
              <li><Link className="hover:text-white" href="#">Privacy Policy</Link></li>
              <li><Link className="hover:text-white" href="#">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-4 col-span-2">
            <h3 className="text-white font-semibold">Stay Connected</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>1900-1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>support@freshmart.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>41 Phan Van Tri St, District Go Vap, Ho Chi Minh City</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-400">Subscribe to our newsletter</p>
              <form className="flex items-center gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-footer-border bg-transparent px-3 py-2 text-sm placeholder:text-slate-500 focus:border-brand focus:ring-2 focus:ring-brand"
                />
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-footer-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-400">© 2024 FreshMart. All rights reserved.</p>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            Made with <Heart className="h-4 w-4 text-pink-500" /> in Vietnam
          </p>
          <nav className="flex items-center gap-6 text-xs">
            <Link href="#" className="text-slate-300 hover:text-white">Terms</Link>
            <Link href="#" className="text-slate-300 hover:text-white">Privacy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
