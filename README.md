# Developer Hub - Kişisel Proje Dağıtım Platformu

Bu proje, kişisel oyunlarınızı, Minecraft modlarınızı ve eklentilerinizi, masaüstü araçlarınızı ve yazılımlarınızı tek bir çatı altında yayımlayabileceğiniz, doğrudan **GitHub Pages** üzerinde çalışan modüler, statik bir geliştirici platformudur.

---

## 🌟 Öne Çıkan Özellikler

- **Sıfır Derleme Bağımlılığı (Zero-Build):** `npm install`, Node.js veya webpack gerektirmez. Repoya push ettiğiniz an GitHub Pages üzerinde canlıya geçer.
- **Veri Odaklı Proje Yönetimi (JSON-Driven):** Yeni proje eklemek için HTML kodlarını düzenlemeniz gerekmez. Sadece `projects/{slug}/project.json` dosyasını oluşturup `projects/index.json` listesine eklemeniz yeterlidir.
- **Category ve Type Ayrımı:** Projeler hem kategoriye (Örn: *Minecraft*, *Games*, *Tools*) hem de türe (Örn: *Mod*, *Plugin*, *Game*, *Application*) göre bağımsız olarak etiketlenir ve filtrelenebilir.
- **Kapsamlı Arama ve Çoklu Filtreleme:** Canlı arama motoru, kategori sekmeleri, tür/durum/etiket filtreleri ve 4 farklı sıralama modu (Öne Çıkanlar, En Yeniler, Son Güncellenenler, Alfabetik).
- **Zengin Proje Detay Motoru (`project.html?id=slug`):** Ekran görüntüleri (büyütülebilir lightbox), doğrudan indirme bağlantıları, sistem gereksinimleri, kurulum talimatları ve sürüm geçmişi (changelog).
- **GitHub Pages Uyumluluğu:** Tüm kaynak ve dosya bağlantıları **relative path** (`./`) ile yazılmıştır; hem `username.github.io/` hem de `username.github.io/repo-name/` yapısında sorunsuz çalışır.
- **İndie Geliştirici Odaklı Karanlık Tema:** Göz yormayan, yüksek kontrastlı, gereksiz animasyon veya gradient içermeyen modern karanlık tema.
- **Erişilebilirlik & SEO:** Semantik HTML5, klavye ile gezinme, Open Graph etiketleri, `sitemap.xml` ve `robots.txt`.

---

## 📁 Dizin Yapısı

```text
developer-hub/
├── index.html               # Ana sayfa (Hero, Öne çıkanlar, Kategoriler, Son güncellemeler, Hakkımda)
├── projects.html            # Katalog sayfası (Canlı arama, Filtreler, Sıralama, Proje gridi)
├── project.html             # Proje detay motoru (?id=proje-slug parametresiyle çalışır)
├── 404.html                 # 404 Hata sayfası
├── favicon.svg              # Modern SVG favicon
├── robots.txt               # Arama motoru robot direktifleri
├── sitemap.xml              # Site haritası
├── README.md                # Kurulum ve proje ekleme kılavuzu
│
├── assets/
│   ├── css/
│   │   ├── variables.css    # Renk paleti, tipografi ve boşluk değişkenleri
│   │   ├── main.css         # Reset, temel düzen, responsive navigasyon ve footer
│   │   ├── components.css   # Proje kartları, rozetler (badge), arama ve filtreler
│   │   └── project-detail.css # Proje sayfası (hero, indirmeler, changelog, galeri)
│   ├── js/
│   │   ├── data-loader.js   # JSON manifest ve proje verilerini yükleyen modül
│   │   ├── app.js           # Genel arayüz ve ana sayfa kontrolcüsü
│   │   ├── catalog.js       # Katalog filtreleme, arama ve sıralama motoru
│   │   └── project-view.js  # Proje detay motoru ve görsel modalı
│   └── images/
│       ├── avatar.svg       # Geliştirici profil görseli / logo
│       └── projects/        # Proje kapakları ve ekran görüntüleri
│
└── projects/                # Projelerinizin veri klasörü
    ├── index.json           # Aktif projelerin slug listesi (Manifest)
    ├── cosmic-drift/        # Örnek 1: Oyun
    │   └── project.json
    ├── ore-harvester-mod/   # Örnek 2: Minecraft Modu
    │   └── project.json
    ├── easy-permissions-plugin/ # Örnek 3: Minecraft Eklentisi
    │   └── project.json
    └── quick-palette-tool/  # Örnek 4: Windows Masaüstü Aracı
        └── project.json
```

---

## 🚀 Yeni Proje Nasıl Eklenir? (2 Basit Adım)

Yeni bir oyun, mod, eklenti veya araç eklemek için sadece 2 adım gereklidir:

### Adım 1: Proje JSON Dosyasını Oluşturun
`projects/` klasörü altına projenizin kısa adıyla (slug) yeni bir klasör açın ve içine `project.json` dosyasını ekleyin:

**Örnek:** `projects/my-new-game/project.json`
```json
{
  "id": "my-new-game",
  "title": "My New Game",
  "tagline": "Projenizin bir cümlelik kısa açıklaması.",
  "category": "Games",
  "type": "Game",
  "status": "Active",
  "version": "v1.0.0",
  "featured": true,
  "releaseDate": "2026-03-21",
  "updatedDate": "2026-03-21",
  "tags": ["Godot", "Action", "Indie"],
  "coverImage": "./assets/images/projects/my-new-game-cover.jpg",
  "links": {
    "github": "https://github.com/kullanici-adiniz/my-new-game",
    "download": "https://github.com/kullanici-adiniz/my-new-game/releases",
    "demo": "https://itch.io/...",
    "docs": "https://github.com/kullanici-adiniz/my-new-game#readme"
  },
  "summary": "Projenin detaylı açıklaması ve amacı.",
  "features": [
    "Özellik 1",
    "Özellik 2",
    "Özellik 3"
  ],
  "requirements": {
    "os": "Windows 10/11",
    "memory": "4 GB RAM"
  },
  "screenshots": [
    {
      "url": "./assets/images/projects/my-new-game-screen1.jpg",
      "caption": "Oyun içi görüntü"
    }
  ],
  "installation": "1. .zip arşivini indirin.\n2. Klasöre çıkartın.\n3. .exe dosyasını çalıştırın.",
  "downloads": [
    {
      "name": "Windows x64 Sürümü",
      "filename": "MyNewGame-win64.zip",
      "size": "45 MB",
      "version": "v1.0.0",
      "url": "https://github.com/kullanici-adiniz/my-new-game/releases/download/v1.0.0/MyNewGame-win64.zip"
    }
  ],
  "changelog": [
    {
      "version": "v1.0.0",
      "date": "2026-03-21",
      "changes": [
        "İlk kararlı sürüm yayınlandı."
      ]
    }
  ]
}
```

### Adım 2: `projects/index.json` Dosyasına Ekleyin
`projects/index.json` dosyasını açıp projenizin slug değerini listeye ekleyin:

```json
{
  "projects": [
    "cosmic-drift",
    "ore-harvester-mod",
    "easy-permissions-plugin",
    "quick-palette-tool",
    "my-new-game"
  ]
}
```

Bu kadar! Siteniz ana sayfada, katalogda ve arama motorunda yeni projenizi otomatik olarak listeleyecek ve `project.html?id=my-new-game` sayfası anında hazır olacaktır.

---

## 🌐 GitHub Pages Kurulumu

1. Bu klasördeki tüm dosyaları GitHub'da açtığınız bir depoya (repository) yükleyin:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial Developer Hub setup"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/DEPO_ADINIZ.git
   git push -u origin main
   ```
2. GitHub'da deponuzun **Settings** > **Pages** menüsüne gidin.
3. **Build and deployment** altında:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` ve `/ (root)` seçin.
4. **Save** butonuna tıklayın. 1-2 dakika içinde siteniz `https://kullanici-adiniz.github.io/depo-adiniz/` adresinde canlıya geçecektir!
