import React from "react";

export default function Footer1() {
  return (
    <footer className="bg-gray-900 text-white px-8 py-12 text-center">
      <p className="text-gray-400 mb-4">
        © 2025 TechStore. All rights reserved.
      </p>
      <div className="space-x-4">
        <a href="#" className="hover:text-blue-400">
          Chính sách bảo mật
        </a>
        <a href="#" className="hover:text-blue-400">
          Điều khoản sử dụng
        </a>
        <a href="#" className="hover:text-blue-400">
          Liên hệ
        </a>
      </div>
    </footer>
  );
}
