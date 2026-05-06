# 🛵 ShopeeFood - Ứng dụng đặt đồ ăn trực tuyến (Food Delivery & Ordering App)

## 🎯 Giới thiệu
ShopeeFood là một ứng dụng ứng dụng phân phối hình thức đặt đồ ăn (Food Delivery) được xây dựng bằng React, Vite, Tailwind CSS, kết hợp với Firebase (Authentication và Firestore). Ứng dụng cho phép người dùng tìm kiếm món ăn, đặt hàng, thanh toán (sandbox) và có trang quản trị (Admin/Dashboard) riêng.

---

## 🚀 Những gì đã hoàn thành (What's Done)

1.  **Xác thực người dùng (Authentication):**
    *   Hỗ trợ Đăng ký, Đăng nhập cơ bản (Email/Password).
    *   Hỗ trợ Đăng nhập với tài khoản Google. (Đã bỏ đăng nhập với Facebook do cấu hình phức tạp chưa khả dụng)
    *   Phân quyền Người dùng (User) và Quản trị viên (Admin).
    *   *Tài khoản Admin thử nghiệm:* 
        *   Email: `admin@ShopeeFood.com`
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

## 🛠️ HƯỚNG DẪN CẤU HÌNH MÔI TRƯỜNG & CHẠY DỰ ÁN 

### 📋 Yêu cầu hệ thống:
*   **Node.js** bản mới nhất (khuyến nghị từ bản `18.x` hoặc `20.x` trở lên để đảm bảo tính tương thích).
*   Đã có cài đặt **NPM** (đi kèm khi cài đặt Node.js).

---

### 🚀 Các Bước Triển Khai Chi Tiết:

#### 🔹 Bước 1: Cài đặt Thư viện (Dependencies)
Mở cửa sổ dòng lệnh (Terminal/Command Prompt) tại thư mục gốc của dự án và chạy lệnh sau để tự động tải các gói tài nguyên:
```bash
npm install
```

#### 🔹 Bước 2: Thiết lập Tệp Cấu hình Firebase
Dự án được kết nối trực tiếp với hệ cơ sở dữ liệu **Cloud Firestore (Real-time Database)** đã được thiết lập sẵn của nhóm. Cấu hình kết nối nằm trọn vẹn trong tệp `firebase-applet-config.json` ở thư mục gốc. 
*   *Lưu ý:* Thầy/Cô **không cần cấu hình thêm bất kỳ tài nguyên cơ sở dữ liệu nào** vì hệ thống Firebase của nhóm đã hoạt động 24/7 trực tuyến.
*   Nếu Thầy/Cô muốn tự triển khai trên Firebase cá nhân: Thay thế nội dung file `firebase-applet-config.json` bằng Credentials tương ứng của Thầy/Cô.

#### 🔹 Bước 3: Áp dụng Quy Tắc Bảo Mật (Firestore Security Rules)
Các quy tắc bảo mật phân quyền nghiêm ngặt của dự án được lưu trong file `firestore.rules`.
*   Quy tắc này ngăn chặn tuyệt đối khách hàng truy cập trái phép vào dữ liệu kinh doanh của Admin, đồng thời cô lập dữ liệu cá nhân của từng khách hàng.
*   Nội dung rules này đã được deploy trực tiếp lên server chính thức.

#### 🔹 Bước 4: Khởi Chạy Ứng Dụng Độc Lập
Chạy lệnh dưới đây để khởi chạy máy chủ phát triển cục bộ:
```bash
npm run dev
```
Sau đó, Thầy/Cô chỉ cần click vào liên kết hiển thị trên màn hình terminal (thường là `http://localhost:5173`) để mở giao diện đặt đồ ăn trực tuyến!

---

### 🔑 THÔNG TIN TÀI KHOẢN THỬ NGHIỆM ĐỂ ĐÁNH GIÁ:

Để hỗ trợ Thầy/Cô đánh giá toàn diện hệ thống quản trị, phân quyền và giám sát thông minh BI (Business Intelligence), nhóm đã tạo sẵn các tài khoản thử nghiệm sau:

| Vai trò | Email đăng nhập | Mật khẩu | Chức năng đánh giá chính |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@ShopeeFood.com` | `123456` | Trải nghiệm **Operation Control Center**, Line Chart thời gian thực, Custom Heatmap, và bảng giám sát Live Orders |
| **Khách hàng mẫu (User)** | `user@ShopeeFood.com` | `123456` | Trải nghiệm luồng đặt hàng, giỏ hàng, và trang cá nhân Customer Dashboard |


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
