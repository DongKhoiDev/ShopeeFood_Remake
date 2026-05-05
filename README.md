# 🛵 SFood - Ứng dụng đặt đồ ăn trực tuyến (Food Delivery & Ordering App)

## 🎯 Giới thiệu
SFood là một ứng dụng ứng dụng phân phối hình thức đặt đồ ăn (Food Delivery) được xây dựng bằng React, Vite, Tailwind CSS, kết hợp với Firebase (Authentication và Firestore). Ứng dụng cho phép người dùng tìm kiếm món ăn, đặt hàng, thanh toán (sandbox) và có trang quản trị (Admin/Dashboard) riêng.

---

## 🚀 Những gì đã hoàn thành (What's Done)

1.  **Xác thực người dùng (Authentication):**
    *   Hỗ trợ Đăng ký, Đăng nhập cơ bản (Email/Password).
    *   Hỗ trợ Đăng nhập với tài khoản Google. (Đã bỏ đăng nhập với Facebook do cấu hình phức tạp chưa khả dụng)
    *   Phân quyền Người dùng (User) và Quản trị viên (Admin).
    *   *Tài khoản Admin thử nghiệm:* 
        *   Email: `admin@sfood.com`
        *   Pass: `123456`

2.  **Tính năng Khách hàng (User Features):**
    *   Trang chủ hiển thị danh sách nhà hàng với các danh mục ẩm thực.
    *   Xem chi tiết Menu và Món ăn của nhà hàng, thêm món ăn vào Giỏ hàng.
    *   Tiến hành thanh toán (Checkout) và nhập thông tin giao hàng.
    *   Lịch sử / Theo dõi tiến độ đơn đặt hàng (Order Tracking).

3.  **Tính năng Quản trị hệ thống (Admin Dashboard):**
    *   Xem danh sách các đơn hàng hiện có của khách, cập nhật trạng thái đơn hàng (Đang chuẩn bị, Đang giao, v.v).
    *   Quản lý danh sách đối tác nhà hàng và xem thông tin sơ lược.

4.  **Backend với Firebase:**
    *   Tích hợp Auth & Firestore mạnh mẽ.
    *   Cấu trúc Firestore với các collections: `users`, `restaurants`, `orders`.
    *   Bảo mật bằng Firestore Security Rules chặt chẽ (`firestore.rules`).

---

## 🚧 Những gì chưa hoàn thành / Có thể phát triển thêm (To-Do)

1.  **Thanh toán thực (Payment Gateway Integration):**
    *   Hiện tại ứng dụng tạo các đơn hàng với phương thức (Cash/Card) nhưng mô phỏng. Cần kết nối tới cổng thanh toán (VNPay, MoMo, Stripe) ở backend.
2.  **Thông báo thời gian thực & Chat:**
    *   Gửi thông báo qua FCM hoặc thư xác nhận qua email tự động.
    *   Tích hợp chat trực tuyến với hỗ trợ viên hoặc Shipper.
3.  **Hệ thống Driver/Shipper App:**
    *   Thiếu phân hệ cho tài xế để nhận đơn hàng và cập nhật hành trình trên bản đồ.
4.  **Quản lý Media:**
    *   Upload ảnh Avatar, ảnh cover Nhà hàng (Firebase Storage chưa được áp dụng mà đang dùng Image URL placeholder hoặc copy Link).

---

## 🛠 Hướng dẫn Cài đặt & Chạy ứng dụng (Installation & Setup)

Yêu cầu môi trường có cài **Node.js** (Tối thiểu bản 18+).

### Bước 1: Cài đặt Dependencies
Sau khi tải hoặc clone code về, mở terminal ở thư mục dự án và chạy:
```bash
npm install
```

### Bước 2: Thiết lập Biến Môi Trường (Environment) & Firebase Config
Sao chép tập tin `.env.example` thành `.env` (hoặc `.env.local`), điền các giá trị thích hợp nếu có cấu hình Google OAuth.

Dự án này sử dụng Firebase. Cấu hình được đặt tại `firebase-applet-config.json`, bao gồm api key, auth domain, firestoreDatabaseId, project id.
Nếu bạn tự thiết lập dự án Firebase trên tài khoản riêng:
1. Tạo Firebase project tại console.firebase.google.com
2. Bật **Firebase Authentication** trong đó mở Sign-in providers: *Email/Password*, *Google*.
3. Bật **Cloud Firestore**. 
4. Thay thế nội dung file `firebase-applet-config.json` bằng cấu hình của dự án Firebase của bạn.

### Bước 3: Áp dụng Security Rules cho Firestore (Bắt buộc)
Các quy tắc bảo mật Database được lưu trong file `firestore.rules`.
- Bạn sao chép toàn bộ nội dung file `firestore.rules` và dán (Publish) vào **Tab Rules** của **Cloud Firestore** trên tài khoản Firebase của bạn để App có quyền Read/Write Database một cách bảo mật.

### Bước 4: Chạy project
Khởi động development server:
```bash
npm run dev
```

Truy cập ứng dụng trên trình duyệt web theo cổng hiển thị ở console. Thường là `http://localhost:5173`. Chúc bạn trải nghiệm ứng dụng vui vẻ!

---

## 🌐 Hướng dẫn Deploy (Xuất bản ứng dụng miễn phí)

Vì đây là ứng dụng React (Client-side) thiết lập qua Vite và sử dụng Firebase Backend (Serverless), bạn có nhiều cách để xuất bản ứng dụng hoàn toàn miễn phí cực kỳ nhanh chóng:

### 1. Thông qua trình chia sẻ của AI Studio (Nhanh nhất)
Nền tảng bạn đang dùng để tạo dự án (Google AI Studio) hỗ trợ Deploy tức thì lên Cloud Run. Mọi thứ hoàn toàn tự động!
- Ở góc trên cùng bên phải màn hình làm việc của AI Studio, bạn nhấn vào nút **Share** hoặc **Deploy**.
- Một URL công khai sẽ tự động được tạo ra (Ví dụ: `https://ais-pre-...run.app`). Bạn có thể sao chép liên kết này và gửi cho bạn bè hoặc người thân trải nghiệm ngay lập tức. Đây là phiên bản cloud server, chạy miễn phí trên server Google!

### 2. Triển khai miễn phí lên Vercel / Netlify (Khuyên dùng cho Frontend)
Nếu bạn muốn có một tuỳ chỉnh sâu hơn và đường dẫn rõ ràng hơn:
1. Nhấn **Export** tại AI Studio và xuất mã nguồn này qua **GitHub** (hoặc tải **ZIP** và tự đẩy lên tài khoản GitHub của bạn).
2. Đăng nhập vào [Vercel](https://vercel.com) hoặc [Netlify](https://netlify.com) (Đều miễn phí).
3. "Add new site/project" và liên kết với kho lưu trữ GitHub của bạn.
4. Cấu hình sẽ tự nhận diện đây là build Vite (`npm run build`). Click Deploy. Xong!

### 3. Firebase Hosting (Cùng hệ sinh thái Google & Firebase của bạn)
Nếu bạn đã tạo Firebase Project để host Database và Authentication ở trên, bạn cũng có thể deploy front-end lên chính Firebase đó miễn phí:
1. Cài Firebase CLI: `npm install -g firebase-tools`
2. Đăng nhập: `firebase login`
3. Khởi tạo Firebase trong thư mục dự án: `firebase init hosting` 
   - Public directory: nhập `dist`
   - Single-page app: `Yes`
4. Xây dựng ứng dụng: `npm run build`
5. Triển khai cuối cùng: `firebase deploy --only hosting`

Chúc thiết kế và hoàn thiện ứng dụng xuất sắc!
