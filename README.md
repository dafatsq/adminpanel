# Admin Panel NestJS

Admin panel untuk manajemen data **Kategori** dan **Produk** dengan fitur autentikasi, CRUD, pencarian, dan error handling. Dibangun menggunakan **NestJS TypeScript** dengan pattern **MVC** (Model-View-Controller).

## Fitur Utama

- ✅ **Autentikasi** — Login/logout dengan session-based authentication (Passport.js + bcrypt)
- ✅ **CRUD Kategori** — Tambah, lihat, edit, hapus kategori
- ✅ **CRUD Produk** — Tambah, lihat, edit, hapus produk (dengan pilihan kategori)
- ✅ **Relasi One-to-Many** — Satu kategori memiliki banyak produk
- ✅ **Pencarian** — Fitur search pada halaman kategori dan produk
- ✅ **MVC Pattern** — Model (Entity + Service), View (Handlebars), Controller
- ✅ **Error Handling** — Validasi form, redirect handling, user-friendly error messages
- ✅ **Responsive UI** — Bootstrap 5 dengan dark sidebar navigation

## Desain Database

```
┌──────────────────┐           ┌──────────────────────┐
│      User        │           │      Category         │
├──────────────────┤           ├──────────────────────┤
│ id        PK     │           │ id          PK        │
│ username  UNIQUE │           │ name                  │
│ password  HASH   │           │ description           │
│ fullName         │           │ createdAt             │
└──────────────────┘           │ updatedAt             │
                               └──────────┬───────────┘
                                          │ 1
                                          │
                                          │ *
                               ┌──────────┴───────────┐
                               │      Product          │
                               ├──────────────────────┤
                               │ id          PK        │
                               │ name                  │
                               │ description           │
                               │ price       DECIMAL   │
                               │ stock       INT       │
                               │ categoryId  FK        │
                               │ createdAt             │
                               │ updatedAt             │
                               └──────────────────────┘
```

**Relasi:** Category (1) → Product (*) — One to Many

## Screenshot Aplikasi

### Halaman Login
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Daftar Kategori
![Categories List](screenshots/category.png)

### Daftar Produk
![Products List](screenshots/products.png)

## Arsitektur MVC

```
src/
├── entities/                  # MODEL — Database entities (TypeORM)
│   ├── user.entity.ts
│   ├── category.entity.ts
│   └── product.entity.ts
├── category/
│   ├── category.module.ts
│   ├── category.service.ts    # MODEL — Business logic & data access
│   └── category.controller.ts # CONTROLLER — Route handling
├── product/
│   ├── product.module.ts
│   ├── product.service.ts     # MODEL — Business logic & data access
│   └── product.controller.ts  # CONTROLLER — Route handling
├── auth/                      # Authentication module
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── local.strategy.ts
│   ├── session.serializer.ts
│   └── guards/
│       ├── authenticated.guard.ts
│       └── login.guard.ts
├── seed/                      # Database seeder
│   ├── seed.module.ts
│   └── seed.service.ts
├── app.module.ts
├── app.controller.ts          # Dashboard controller
└── main.ts                    # Bootstrap & configuration

views/                         # VIEW — Handlebars templates
├── layouts/
│   └── main.hbs               # Layout utama dengan sidebar
├── login.hbs
├── dashboard.hbs
├── categories/
│   ├── list.hbs
│   ├── detail.hbs
│   └── form.hbs
├── products/
│   ├── list.hbs
│   ├── detail.hbs
│   └── form.hbs
└── error.hbs
```

## Dependencies

| Package | Versi | Fungsi |
|---------|-------|--------|
| `@nestjs/core` | ^11.x | Framework core |
| `@nestjs/typeorm` | ^11.x | ORM integration |
| `typeorm` | ^0.3.x | Database ORM |
| `sqlite3` | ^5.x | SQLite database driver |
| `@nestjs/passport` | ^11.x | Authentication framework |
| `passport` | ^0.7.x | Auth strategies |
| `passport-local` | ^1.x | Username/password strategy |
| `bcrypt` | ^5.x | Password hashing |
| `hbs` | ^4.x | Handlebars view engine |
| `express-session` | ^1.x | Session management |

## Cara Menjalankan

### Prerequisites
- Node.js >= 18
- npm >= 9

### Instalasi

```bash
# Clone repository
git clone https://github.com/dafatsq/adminpanel.git
cd adminpanel

# Install dependencies
npm install

# Jalankan dalam mode development
npm run start:dev

# Atau mode production
npm start
```

Aplikasi akan berjalan di **http://localhost:3000**

### Login Default
- **Username:** `admin`
- **Password:** `admin123`

## Endpoints

| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/login` | Halaman login |
| POST | `/login` | Proses login |
| GET | `/logout` | Logout |
| GET | `/` | Dashboard |
| GET | `/categories` | Daftar kategori |
| GET | `/categories?search=keyword` | Pencarian kategori |
| GET | `/categories/create` | Form tambah kategori |
| POST | `/categories` | Simpan kategori baru |
| GET | `/categories/:id` | Detail kategori |
| GET | `/categories/:id/edit` | Form edit kategori |
| POST | `/categories/:id` | Update kategori |
| POST | `/categories/:id/delete` | Hapus kategori |
| GET | `/products` | Daftar produk |
| GET | `/products?search=keyword` | Pencarian produk |
| GET | `/products/create` | Form tambah produk |
| POST | `/products` | Simpan produk baru |
| GET | `/products/:id` | Detail produk |
| GET | `/products/:id/edit` | Form edit produk |
| POST | `/products/:id` | Update produk |
| POST | `/products/:id/delete` | Hapus produk |

> **Catatan:** Semua endpoint mengembalikan **HTML pages** (MVC pattern), bukan JSON API.

## Implementasi MVC Pattern

### 1. Model Layer
- **Entities:** Definisi struktur tabel database (`user.entity.ts`, `category.entity.ts`, `product.entity.ts`)
- **Services:** Business logic dan data access (`category.service.ts`, `product.service.ts`, `auth.service.ts`)

### 2. View Layer
- **Templates:** Handlebars files (`.hbs`) di folder `views/`
- **Layout:** Main layout dengan sidebar navigation
- **Components:** Login, dashboard, categories, products

### 3. Controller Layer
- **Controllers:** Handle HTTP requests, call services, render views
- **Route mapping:** `@Get()`, `@Post()` decorators
- **Request handling:** `@Req()`, `@Res()`, `@Param()`, `@Query()`, `@Body()`

## Error Handling

### 1. Authentication Errors
- **Login gagal:** Redirect ke `/login?error=Username atau password salah`
- **Belum login:** Redirect ke `/login` (tidak menampilkan 403 JSON)

### 2. Validation Errors
- **Form validation:** Inline checks dengan error messages
- **Error display:** Red alert di atas form dengan daftar errors
- **Form preservation:** Input user tetap terisi saat validation gagal

### 3. Not Found Errors
- **Data tidak ditemukan:** Redirect ke list page
- **Graceful handling:** Tidak menampilkan raw 404 error

### 4. Success Messages
- **Flash messages:** Query string `?success=...`
- **Green alerts:** Ditampilkan di list pages

## Fitur Pencarian

Implementasi search menggunakan TypeORM `Like()`:

```typescript
// Di Service Layer
async findAll(search?: string) {
  if (search) {
    return this.repository.find({
      where: [
        { name: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
      ],
      relations: ['products'], // atau ['category'] untuk products
    });
  }
  return this.repository.find({ relations: [...] });
}
```

Search dilakukan di kolom **name** dan **description** untuk kategori maupun produk.

## Teknologi

- **Runtime:** Node.js 18+
- **Framework:** NestJS 11 (TypeScript)
- **Database:** SQLite (via TypeORM)
- **View Engine:** Handlebars (HBS)
- **Authentication:** Passport.js (Local Strategy + Sessions)
- **Styling:** Bootstrap 5 + Bootstrap Icons
- **Password Hashing:** bcrypt

## Catatan untuk Developer

- Database menggunakan **SQLite** (`database.sqlite`) yang otomatis dibuat saat pertama kali dijalankan
- **Seed data** otomatis terisi saat startup (1 admin user, 5 kategori, 15 produk)
- Hapus file `database.sqlite` untuk reset database
- Session disimpan di **memory** (restart server = logout semua user)
- Pattern MVC: Entity + Service = **Model**, Controller = **Controller**, `.hbs` files = **View**
- Semua responses berbentuk **HTML pages** atau **redirects**, bukan JSON API
- File `database.sqlite` dan `node_modules/` sudah masuk `.gitignore`

## Development

```bash
# Development mode dengan auto-reload
npm run start:dev

# Production mode
npm run build
npm start

# Reset database (hapus file database)
rm database.sqlite
# Kemudian restart server untuk reseed
```

## Struktur Database Seed

### Users
- 1 admin user (`admin` / `admin123`)

### Categories (5)
1. Elektronik
2. Pakaian
3. Makanan & Minuman
4. Olahraga
5. Buku

### Products (15)
- 3 produk per kategori
- Harga range: Rp 25,000 - Rp 15,000,000
- Stok range: 10 - 500 unit

## License

MIT

## Author

Developed as a technical challenge for DOT Indonesia internship.
