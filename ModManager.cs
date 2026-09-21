using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Forms;

namespace ModHubManager
{
    public class ModLink
    {
        public string title { get; set; }
        public string url { get; set; }
        public string icon { get; set; }
    }

    public class ModItem
    {
        public string id { get; set; }
        public string type { get; set; }
        public string game { get; set; }
        public string title { get; set; }
        public string version { get; set; }
        public string updated { get; set; }
        public string author { get; set; }
        public string icon { get; set; }
        public string tagline_tr { get; set; }
        public string tagline_en { get; set; }
        public string overview_tr { get; set; }
        public string overview_en { get; set; }
        public string download_url { get; set; }
        public string install_code { get; set; }
        public List<string> tags { get; set; }
        public List<string> requirements { get; set; }
        public List<string> install_steps_tr { get; set; }
        public List<string> install_steps_en { get; set; }
        public List<string> features_tr { get; set; }
        public List<string> features_en { get; set; }
        public List<ModLink> links { get; set; }

        public ModItem()
        {
            type = "personal";
            game = "eFootball PES 2021";
            tags = new List<string>();
            requirements = new List<string>();
            install_steps_tr = new List<string>();
            install_steps_en = new List<string>();
            features_tr = new List<string>();
            features_en = new List<string>();
            links = new List<ModLink>();
        }
    }

    public class MainForm : Form
    {
        private List<ModItem> allMods = new List<ModItem>();
        private string jsonPath = "mods.json";
        private ModItem currentSelected = null;
        private HttpListener httpListener;
        private Thread httpThread;
        private const int Port = 54321;

        // UI Controls
        private TextBox txtSearch;
        private ComboBox cmbTabFilter;
        private ListBox lstMods;
        private Button btnAddNew;
        private Button btnDelete;

        private ComboBox cmbType;
        private TextBox txtGame;
        private TextBox txtId;
        private TextBox txtTitle;
        private TextBox txtVersion;
        private TextBox txtAuthor;
        private TextBox txtDownloadUrl;
        private TextBox txtInstallCode;
        private TextBox txtIcon;
        private Button btnBrowseIcon;
        private ComboBox cmbPresetIcon;

        private TextBox txtTaglineTr;
        private TextBox txtTaglineEn;
        private TextBox txtOverviewTr;
        private TextBox txtOverviewEn;
        private TextBox txtRequirements;
        private TextBox txtInstallStepsTr;
        private TextBox txtLinks;
        private TextBox txtTags;
        private TextBox txtFeaturesTr;
        private TextBox txtFeaturesEn;

        private Button btnSave;
        private Button btnPushGit;
        private Button btnPreviewSite;
        private Label lblStatus;

        [System.Runtime.InteropServices.DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [STAThread]
        public static void Main()
        {
            try { SetProcessDPIAware(); } catch { }
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }

        public MainForm()
        {
            this.Text = "Lkxex Mod Vitrini & Editör (Native C#)";
            this.Size = new Size(1140, 820);
            this.MinimumSize = new Size(980, 720);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(9, 13, 22);
            this.ForeColor = Color.FromArgb(241, 245, 249);
            this.Font = new Font("Segoe UI", 9.25f, FontStyle.Regular);

            BuildUI();
            LoadData();
            StartHttpServer();

            this.FormClosing += (s, e) => StopHttpServer();
        }

        private void BuildUI()
        {
            // Top Action Bar
            Panel topBar = new Panel
            {
                Dock = DockStyle.Top,
                Height = 56,
                BackColor = Color.FromArgb(17, 24, 39),
                Padding = new Padding(14, 11, 14, 11)
            };

            Label lblAppTitle = new Label
            {
                Text = "⚡ Lkxex Mod Vitrini & Editör",
                ForeColor = Color.FromArgb(88, 101, 242),
                Font = new Font("Segoe UI", 12f, FontStyle.Bold),
                AutoSize = true,
                Location = new Point(14, 15)
            };
            topBar.Controls.Add(lblAppTitle);

            btnPreviewSite = CreateButton("🌐 Sitede Önizle (Local)", Color.FromArgb(26, 34, 52), Color.FromArgb(241, 245, 249), 175, 34);
            btnPreviewSite.Location = new Point(540, 11);
            btnPreviewSite.Click += (s, e) => OpenSitePreview();
            topBar.Controls.Add(btnPreviewSite);

            btnSave = CreateButton("💾 mods.json Kaydet", Color.FromArgb(16, 185, 129), Color.White, 160, 34);
            btnSave.Location = new Point(725, 11);
            btnSave.Click += (s, e) => SaveData(true);
            topBar.Controls.Add(btnSave);

            btnPushGit = CreateButton("🚀 GitHub'a Gönder (Push)", Color.FromArgb(88, 101, 242), Color.White, 190, 34);
            btnPushGit.Location = new Point(895, 11);
            btnPushGit.Click += (s, e) => PushToGitHub();
            topBar.Controls.Add(btnPushGit);

            this.Controls.Add(topBar);

            // Bottom Status Bar
            Panel statusBar = new Panel
            {
                Dock = DockStyle.Bottom,
                Height = 32,
                BackColor = Color.FromArgb(17, 24, 39),
                Padding = new Padding(14, 6, 14, 6)
            };
            lblStatus = new Label
            {
                Text = "Hazır • Sunucu: http://127.0.0.1:" + Port,
                ForeColor = Color.FromArgb(148, 163, 184),
                Dock = DockStyle.Fill,
                TextAlign = ContentAlignment.MiddleLeft
            };
            statusBar.Controls.Add(lblStatus);
            this.Controls.Add(statusBar);

            // Main Split: Left List, Right Form
            SplitContainer split = new SplitContainer
            {
                Dock = DockStyle.Fill,
                SplitterDistance = 340,
                FixedPanel = FixedPanel.Panel1,
                BackColor = Color.FromArgb(30, 41, 61)
            };
            this.Controls.Add(split);
            split.BringToFront();

            // --- LEFT PANEL ---
            Panel leftPanel = split.Panel1;
            leftPanel.BackColor = Color.FromArgb(9, 13, 22);
            leftPanel.Padding = new Padding(12);

            Label lblListHeader = new Label
            {
                Text = "📦 Mod Listesi",
                Font = new Font("Segoe UI", 10.5f, FontStyle.Bold),
                ForeColor = Color.FromArgb(241, 245, 249),
                Dock = DockStyle.Top,
                Height = 28
            };
            leftPanel.Controls.Add(lblListHeader);

            txtSearch = new TextBox
            {
                Dock = DockStyle.Top,
                BackColor = Color.FromArgb(17, 24, 39),
                ForeColor = Color.FromArgb(241, 245, 249),
                BorderStyle = BorderStyle.FixedSingle,
                Height = 26
            };
            txtSearch.TextChanged += (s, e) => RefreshList();
            leftPanel.Controls.Add(txtSearch);

            cmbTabFilter = new ComboBox
            {
                Dock = DockStyle.Top,
                DropDownStyle = ComboBoxStyle.DropDownList,
                BackColor = Color.FromArgb(17, 24, 39),
                ForeColor = Color.FromArgb(241, 245, 249),
                FlatStyle = FlatStyle.Flat
            };
            cmbTabFilter.Items.AddRange(new object[] { "Tümü (All Mods)", "⚡ Kendi Modlarım (Personal)", "🌟 Popüler Topluluk (Community)" });
            cmbTabFilter.SelectedIndex = 0;
            cmbTabFilter.SelectedIndexChanged += (s, e) => RefreshList();
            leftPanel.Controls.Add(cmbTabFilter);

            Panel spacerLeft = new Panel { Dock = DockStyle.Top, Height = 8 };
            leftPanel.Controls.Add(spacerLeft);

            lstMods = new ListBox
            {
                Dock = DockStyle.Fill,
                BackColor = Color.FromArgb(17, 24, 39),
                ForeColor = Color.FromArgb(241, 245, 249),
                BorderStyle = BorderStyle.FixedSingle,
                DrawMode = DrawMode.OwnerDrawFixed,
                ItemHeight = 46
            };
            lstMods.DrawItem += LstMods_DrawItem;
            lstMods.SelectedIndexChanged += LstMods_SelectedIndexChanged;
            leftPanel.Controls.Add(lstMods);

            Panel leftBottomBtns = new Panel
            {
                Dock = DockStyle.Bottom,
                Height = 44,
                Padding = new Padding(0, 8, 0, 0)
            };
            btnAddNew = CreateButton("➕ Yeni Mod Ekle", Color.FromArgb(16, 185, 129), Color.White, 150, 34);
            btnAddNew.Dock = DockStyle.Left;
            btnAddNew.Click += (s, e) => PrepareNewMod();
            leftBottomBtns.Controls.Add(btnAddNew);

            btnDelete = CreateButton("🗑️ Sil", Color.FromArgb(220, 38, 38), Color.White, 80, 34);
            btnDelete.Dock = DockStyle.Right;
            btnDelete.Click += (s, e) => DeleteCurrentMod();
            leftBottomBtns.Controls.Add(btnDelete);

            leftPanel.Controls.Add(leftBottomBtns);

            // --- RIGHT PANEL (EDITOR FORM) ---
            Panel rightPanel = split.Panel2;
            rightPanel.BackColor = Color.FromArgb(9, 13, 22);
            rightPanel.AutoScroll = true;
            rightPanel.Padding = new Padding(16, 12, 24, 20);

            TableLayoutPanel formTable = new TableLayoutPanel
            {
                Dock = DockStyle.Top,
                AutoSize = true,
                ColumnCount = 2,
                RowCount = 12,
                Padding = new Padding(0)
            };
            formTable.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50f));
            formTable.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50f));

            // Row 1: Type & Game
            cmbType = CreateComboBox(new string[] { "personal: ⚡ Kendi Modum (Geliştirici)", "community: 🌟 Popüler Topluluk Modu" });
            txtGame = CreateTextBox("Örn: eFootball PES 2021 veya Minecraft");
            formTable.Controls.Add(CreateFieldGroup("Mod Türü (Category):", cmbType), 0, 0);
            formTable.Controls.Add(CreateFieldGroup("Oyun Adı (Game / Platform):", txtGame), 1, 0);

            // Row 2: Title & Version
            txtTitle = CreateTextBox("Örn: PES 2021 Discord Rich Presence");
            txtVersion = CreateTextBox("Örn: v1.0.11");
            formTable.Controls.Add(CreateFieldGroup("Mod Başlığı (Title):", txtTitle), 0, 1);
            formTable.Controls.Add(CreateFieldGroup("Sürüm (Version):", txtVersion), 1, 1);

            // Row 3: ID & Author
            txtId = CreateTextBox("Örn: pes2021-discord-rpc");
            txtAuthor = CreateTextBox("Örn: Lkxex veya juce & nesa24");
            formTable.Controls.Add(CreateFieldGroup("Mod ID (Benzersiz Kısayol):", txtId), 0, 2);
            formTable.Controls.Add(CreateFieldGroup("Geliştirici / Yazar (Author):", txtAuthor), 1, 2);

            // Row 4: Download URL & Install Code
            txtDownloadUrl = CreateTextBox("https://github.com/.../release.zip");
            txtInstallCode = CreateTextBox("lua.module = \"discord_rpc.lua\"");
            txtInstallCode.Font = new Font("Consolas", 9f);
            txtInstallCode.ForeColor = Color.FromArgb(121, 192, 255);
            formTable.Controls.Add(CreateFieldGroup("Doğrudan İndirme Linki (.zip):", txtDownloadUrl), 0, 3);
            formTable.Controls.Add(CreateFieldGroup("Kurulum Satırı (sider.ini / config):", txtInstallCode), 1, 3);

            // Row 5: Icon Picker & Preset
            Panel iconPanel = new Panel { Dock = DockStyle.Fill, Height = 56 };
            txtIcon = new TextBox
            {
                Location = new Point(0, 0),
                Width = 230,
                Height = 24,
                BackColor = Color.FromArgb(17, 24, 39),
                ForeColor = Color.FromArgb(241, 245, 249),
                BorderStyle = BorderStyle.FixedSingle
            };
            btnBrowseIcon = CreateButton("📁 Gözat", Color.FromArgb(26, 34, 52), Color.FromArgb(241, 245, 249), 70, 24);
            btnBrowseIcon.Location = new Point(236, 0);
            btnBrowseIcon.Click += (s, e) => BrowseImage();

            cmbPresetIcon = new ComboBox
            {
                Location = new Point(0, 28),
                Width = 306,
                DropDownStyle = ComboBoxStyle.DropDownList,
                BackColor = Color.FromArgb(17, 24, 39),
                ForeColor = Color.FromArgb(241, 245, 249),
                FlatStyle = FlatStyle.Flat
            };
            cmbPresetIcon.Items.AddRange(new object[] {
                "⚡ Hazır İkon Seç...",
                "./assets/images/projects/pes2021-icon.svg",
                "./assets/images/icons/steam.svg",
                "./assets/images/icons/minecraft-pickaxe.svg",
                "./assets/images/icons/minecraft.svg",
                "./assets/images/icons/minecraft-cube.svg",
                "./assets/images/icons/discord.svg",
                "./assets/images/icons/gamepad.svg",
                "./assets/images/icons/tools.svg",
                "./assets/images/icons/plugin.svg",
                "./assets/images/icons/terminal.svg",
                "./assets/images/icons/windows.svg",
                "./assets/images/icons/github.svg",
                "./assets/images/icons/curseforge.svg",
                "./assets/images/icons/modrinth.svg",
                "./assets/images/icons/gamebanana.svg",
                "./assets/images/icons/unity.svg",
                "./assets/images/icons/unreal.svg",
                "./assets/images/icons/python.svg",
                "./assets/images/icons/lua.svg",
                "./assets/images/icons/csharp.svg",
                "./assets/images/icons/cplusplus.svg",
                "./assets/images/icons/java.svg"
            });
            cmbPresetIcon.SelectedIndex = 0;
            cmbPresetIcon.SelectedIndexChanged += (s, e) => {
                if (cmbPresetIcon.SelectedIndex > 0)
                    txtIcon.Text = cmbPresetIcon.SelectedItem.ToString();
            };

            iconPanel.Controls.Add(txtIcon);
            iconPanel.Controls.Add(btnBrowseIcon);
            iconPanel.Controls.Add(cmbPresetIcon);

            txtTags = CreateTextBox("PES 2021, Sider 7, Discord RPC, Zero-GC");
            formTable.Controls.Add(CreateFieldGroup("Küçük Resim / İkon (Icon):", iconPanel), 0, 4);
            formTable.Controls.Add(CreateFieldGroup("Etiketler (Virgülle ayırın):", txtTags), 1, 4);

            // Row 6: Multi-Platform Links
            txtLinks = CreateMultiTextBox(3, "Her satıra bir link: Başlık | URL | İkon (örn: EvoWeb | https://evoweb.uk/... | evoweb)");
            formTable.Controls.Add(CreateFieldGroup("Harici Platform & Topluluk Linkleri (Çoklu Link):", txtLinks), 0, 5);
            formTable.SetColumnSpan(formTable.GetControlFromPosition(0, 5), 2);

            // Row 7: Tagline TR & EN
            txtTaglineTr = CreateMultiTextBox(2, "Kart üzerinde görünecek kısa özet (Türkçe)...");
            txtTaglineEn = CreateMultiTextBox(2, "Short tagline for the card (English)...");
            formTable.Controls.Add(CreateFieldGroup("Kısa Özet (Türkçe):", txtTaglineTr), 0, 6);
            formTable.Controls.Add(CreateFieldGroup("Kısa Özet (İngilizce):", txtTaglineEn), 1, 6);

            // Row 8: Overview TR & EN
            txtOverviewTr = CreateMultiTextBox(4, "Mod detay vitrininde görünecek ayrıntılı açıklama (Türkçe)...");
            txtOverviewEn = CreateMultiTextBox(4, "Detailed overview for the showcase modal (English)...");
            formTable.Controls.Add(CreateFieldGroup("Detaylı Genel Bakış (Türkçe):", txtOverviewTr), 0, 7);
            formTable.Controls.Add(CreateFieldGroup("Detaylı Genel Bakış (İngilizce):", txtOverviewEn), 1, 7);

            // Row 9: Requirements & Install Steps
            txtRequirements = CreateTextBox("eFootball PES 2021 (Steam), Sider 7.1.4+ (Virgülle ayırın)");
            txtInstallStepsTr = CreateMultiTextBox(3, "Her satıra bir kurulum adımı yazın (1, 2, 3 diye otomatik numaralandırılır)...");
            formTable.Controls.Add(CreateFieldGroup("Gereksinimler (Requirements):", txtRequirements), 0, 8);
            formTable.Controls.Add(CreateFieldGroup("Adım Adım Kurulum (Türkçe):", txtInstallStepsTr), 1, 8);

            // Row 10: Features TR & EN
            txtFeaturesTr = CreateMultiTextBox(3, "Her satıra bir özellik maddesi yazın (Türkçe)...");
            txtFeaturesEn = CreateMultiTextBox(3, "One feature highlight per line (English)...");
            formTable.Controls.Add(CreateFieldGroup("Özellik Maddeleri (Türkçe):", txtFeaturesTr), 0, 9);
            formTable.Controls.Add(CreateFieldGroup("Özellik Maddeleri (İngilizce):", txtFeaturesEn), 1, 9);

            rightPanel.Controls.Add(formTable);
        }

        private Control CreateFieldGroup(string labelText, Control inputControl)
        {
            Panel p = new Panel
            {
                Dock = DockStyle.Fill,
                Margin = new Padding(4, 4, 4, 8),
                AutoSize = true
            };
            Label lbl = new Label
            {
                Text = labelText,
                ForeColor = Color.FromArgb(148, 163, 184),
                Font = new Font("Segoe UI", 8.5f, FontStyle.Bold),
                Dock = DockStyle.Top,
                Height = 18
            };
            p.Controls.Add(inputControl);
            p.Controls.Add(lbl);
            inputControl.Dock = DockStyle.Top;
            return p;
        }

        private TextBox CreateTextBox(string placeholder = "")
        {
            return new TextBox
            {
                BackColor = Color.FromArgb(17, 24, 39),
                ForeColor = Color.FromArgb(241, 245, 249),
                BorderStyle = BorderStyle.FixedSingle,
                Height = 24
            };
        }

        private TextBox CreateMultiTextBox(int lines, string placeholder = "")
        {
            return new TextBox
            {
                BackColor = Color.FromArgb(17, 24, 39),
                ForeColor = Color.FromArgb(241, 245, 249),
                BorderStyle = BorderStyle.FixedSingle,
                Multiline = true,
                ScrollBars = ScrollBars.Vertical,
                Height = lines * 22
            };
        }

        private ComboBox CreateComboBox(string[] items)
        {
            ComboBox cb = new ComboBox
            {
                DropDownStyle = ComboBoxStyle.DropDownList,
                BackColor = Color.FromArgb(17, 24, 39),
                ForeColor = Color.FromArgb(241, 245, 249),
                FlatStyle = FlatStyle.Flat
            };
            cb.Items.AddRange(items);
            if (items.Length > 0) cb.SelectedIndex = 0;
            return cb;
        }

        private Button CreateButton(string text, Color bg, Color fg, int w, int h)
        {
            Button b = new Button
            {
                Text = text,
                BackColor = bg,
                ForeColor = fg,
                Size = new Size(w, h),
                FlatStyle = FlatStyle.Flat,
                Cursor = Cursors.Hand,
                Font = new Font("Segoe UI", 9f, FontStyle.Bold)
            };
            b.FlatAppearance.BorderSize = 0;
            return b;
        }

        private void LstMods_DrawItem(object sender, DrawItemEventArgs e)
        {
            if (e.Index < 0 || e.Index >= lstMods.Items.Count) return;
            ModItem mod = lstMods.Items[e.Index] as ModItem;
            if (mod == null) return;

            bool isSelected = (e.State & DrawItemState.Selected) == DrawItemState.Selected;
            Color bg = isSelected ? Color.FromArgb(30, 41, 59) : Color.FromArgb(17, 24, 39);
            using (SolidBrush b = new SolidBrush(bg))
            {
                e.Graphics.FillRectangle(b, e.Bounds);
            }

            // Draw Category Tag Pill
            bool isComm = mod.type == "community";
            string typePill = isComm ? "TOPLULUK" : "KENDİ";
            Color pillBg = isComm ? Color.FromArgb(245, 158, 11) : Color.FromArgb(88, 101, 242);
            Rectangle pillRect = new Rectangle(e.Bounds.Right - 76, e.Bounds.Top + 8, 68, 18);
            using (SolidBrush pb = new SolidBrush(pillBg))
            {
                e.Graphics.FillRectangle(pb, pillRect);
            }
            using (SolidBrush tb = new SolidBrush(Color.White))
            {
                using (Font pf = new Font("Segoe UI", 7.5f, FontStyle.Bold))
                {
                    StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
                    e.Graphics.DrawString(typePill, pf, tb, pillRect, sf);
                }
            }

            // Draw Title & Game
            using (SolidBrush tb = new SolidBrush(Color.FromArgb(241, 245, 249)))
            {
                using (Font tf = new Font("Segoe UI", 9.25f, FontStyle.Bold))
                {
                    e.Graphics.DrawString(mod.title ?? "Başlıksız", tf, tb, e.Bounds.Left + 8, e.Bounds.Top + 6);
                }
            }
            using (SolidBrush sb = new SolidBrush(Color.FromArgb(148, 163, 184)))
            {
                using (Font sf = new Font("Segoe UI", 8.25f, FontStyle.Regular))
                {
                    string sub = (mod.game ?? "") + (string.IsNullOrEmpty(mod.version) ? "" : " • " + mod.version);
                    e.Graphics.DrawString(sub, sf, sb, e.Bounds.Left + 8, e.Bounds.Top + 26);
                }
            }

            // Bottom subtle divider
            using (Pen p = new Pen(Color.FromArgb(30, 41, 61)))
            {
                e.Graphics.DrawLine(p, e.Bounds.Left, e.Bounds.Bottom - 1, e.Bounds.Right, e.Bounds.Bottom - 1);
            }
        }

        private void LstMods_SelectedIndexChanged(object sender, EventArgs e)
        {
            ModItem item = lstMods.SelectedItem as ModItem;
            if (item != null)
            {
                currentSelected = item;
                PopulateForm(item);
            }
        }

        private void PopulateForm(ModItem m)
        {
            cmbType.SelectedIndex = (m.type == "community") ? 1 : 0;
            txtGame.Text = m.game ?? "";
            txtId.Text = m.id ?? "";
            txtTitle.Text = m.title ?? "";
            txtVersion.Text = m.version ?? "";
            txtAuthor.Text = m.author ?? "";
            txtDownloadUrl.Text = m.download_url ?? "";
            txtInstallCode.Text = m.install_code ?? "";
            txtIcon.Text = m.icon ?? "";
            txtTaglineTr.Text = m.tagline_tr ?? "";
            txtTaglineEn.Text = m.tagline_en ?? "";
            txtOverviewTr.Text = m.overview_tr ?? "";
            txtOverviewEn.Text = m.overview_en ?? "";
            txtTags.Text = m.tags != null ? string.Join(", ", m.tags.ToArray()) : "";
            txtRequirements.Text = m.requirements != null ? string.Join(", ", m.requirements.ToArray()) : "";
            txtInstallStepsTr.Text = m.install_steps_tr != null ? string.Join(Environment.NewLine, m.install_steps_tr.ToArray()) : "";
            txtFeaturesTr.Text = m.features_tr != null ? string.Join(Environment.NewLine, m.features_tr.ToArray()) : "";
            txtFeaturesEn.Text = m.features_en != null ? string.Join(Environment.NewLine, m.features_en.ToArray()) : "";

            // Format multi-links as: Title | URL | Icon
            List<string> linkLines = new List<string>();
            if (m.links != null)
            {
                foreach (var l in m.links)
                {
                    linkLines.Add(string.Format("{0} | {1} | {2}", l.title ?? "", l.url ?? "", l.icon ?? ""));
                }
            }
            txtLinks.Text = string.Join(Environment.NewLine, linkLines.ToArray());

            lblStatus.Text = "Seçildi: " + m.title;
        }

        private void PrepareNewMod()
        {
            currentSelected = null;
            lstMods.ClearSelected();
            cmbType.SelectedIndex = 0;
            txtGame.Text = "eFootball PES 2021";
            txtId.Text = "yeni-mod-" + DateTime.Now.ToString("HHmmss");
            txtTitle.Text = "";
            txtVersion.Text = "v1.0.0";
            txtAuthor.Text = "Lkxex";
            txtDownloadUrl.Text = "";
            txtInstallCode.Text = "";
            txtIcon.Text = "./assets/images/projects/pes2021-icon.svg";
            txtTaglineTr.Text = "";
            txtTaglineEn.Text = "";
            txtOverviewTr.Text = "";
            txtOverviewEn.Text = "";
            txtTags.Text = "";
            txtRequirements.Text = "";
            txtInstallStepsTr.Text = "";
            txtFeaturesTr.Text = "";
            txtFeaturesEn.Text = "";
            txtLinks.Text = "Discord | https://discord.gg/ | discord" + Environment.NewLine + "GitHub | https://github.com/Lkxex | github";
            txtTitle.Focus();
            lblStatus.Text = "Yeni mod formu hazırlandı.";
        }

        private void BrowseImage()
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Title = "Mod İkonu / Küçük Resmi Seç";
                ofd.Filter = "Görsel Dosyaları (*.png;*.jpg;*.jpeg;*.svg;*.ico;*.webp)|*.png;*.jpg;*.jpeg;*.svg;*.ico;*.webp|Tüm Dosyalar (*.*)|*.*";
                if (ofd.ShowDialog() == DialogResult.OK)
                {
                    try
                    {
                        string destDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "assets", "images", "projects");
                        if (!Directory.Exists(destDir)) Directory.CreateDirectory(destDir);
                        string fileName = Path.GetFileName(ofd.FileName);
                        string destPath = Path.Combine(destDir, fileName);
                        File.Copy(ofd.FileName, destPath, true);

                        txtIcon.Text = "./assets/images/projects/" + fileName;
                        lblStatus.Text = "Görsel projeye kopyalandı: " + fileName;
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Görsel kopyalanamadı: " + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }

        private void LoadData()
        {
            try
            {
                if (File.Exists(jsonPath))
                {
                    string json = File.ReadAllText(jsonPath, Encoding.UTF8);
                    JavaScriptSerializer ser = new JavaScriptSerializer();
                    object[] rawList = ser.Deserialize<object[]>(json);
                    allMods.Clear();

                    foreach (Dictionary<string, object> dict in rawList)
                    {
                        ModItem m = new ModItem
                        {
                            id = GetStr(dict, "id"),
                            type = GetStr(dict, "type", "personal"),
                            game = GetStr(dict, "game", "eFootball PES 2021"),
                            title = GetStr(dict, "title"),
                            version = GetStr(dict, "version"),
                            updated = GetStr(dict, "updated"),
                            author = GetStr(dict, "author"),
                            download_url = GetStr(dict, "download_url"),
                            icon = GetStr(dict, "icon"),
                            install_code = GetStr(dict, "install_code"),
                            tagline_tr = GetStr(dict, "tagline_tr"),
                            tagline_en = GetStr(dict, "tagline_en"),
                            overview_tr = GetStr(dict, "overview_tr"),
                            overview_en = GetStr(dict, "overview_en")
                        };

                        if (dict.ContainsKey("tags"))
                        {
                            ArrayList tList = dict["tags"] as ArrayList;
                            if (tList != null)
                            {
                                foreach (object o in tList) m.tags.Add(o.ToString());
                            }
                        }
                        if (dict.ContainsKey("requirements"))
                        {
                            ArrayList rList = dict["requirements"] as ArrayList;
                            if (rList != null)
                            {
                                foreach (object o in rList) m.requirements.Add(o.ToString());
                            }
                        }
                        if (dict.ContainsKey("install_steps_tr"))
                        {
                            ArrayList sList = dict["install_steps_tr"] as ArrayList;
                            if (sList != null)
                            {
                                foreach (object o in sList) m.install_steps_tr.Add(o.ToString());
                            }
                        }
                        if (dict.ContainsKey("install_steps_en"))
                        {
                            ArrayList sList = dict["install_steps_en"] as ArrayList;
                            if (sList != null)
                            {
                                foreach (object o in sList) m.install_steps_en.Add(o.ToString());
                            }
                        }
                        if (dict.ContainsKey("features_tr"))
                        {
                            ArrayList fTr = dict["features_tr"] as ArrayList;
                            if (fTr != null)
                            {
                                foreach (object o in fTr) m.features_tr.Add(o.ToString());
                            }
                        }
                        if (dict.ContainsKey("features_en"))
                        {
                            ArrayList fEn = dict["features_en"] as ArrayList;
                            if (fEn != null)
                            {
                                foreach (object o in fEn) m.features_en.Add(o.ToString());
                            }
                        }
                        if (dict.ContainsKey("links"))
                        {
                            ArrayList lList = dict["links"] as ArrayList;
                            if (lList != null)
                            {
                                foreach (object lo in lList)
                                {
                                    Dictionary<string, object> ld = lo as Dictionary<string, object>;
                                    if (ld != null)
                                    {
                                        m.links.Add(new ModLink
                                        {
                                            title = GetStr(ld, "title"),
                                            url = GetStr(ld, "url"),
                                            icon = GetStr(ld, "icon")
                                        });
                                    }
                                }
                            }
                        }

                        allMods.Add(m);
                    }

                    RefreshList();
                    if (allMods.Count > 0)
                    {
                        lstMods.SelectedIndex = 0;
                    }
                    lblStatus.Text = "Yüklendi: " + allMods.Count + " mod.";
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("mods.json okunamadı: " + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void RefreshList()
        {
            string q = txtSearch.Text.Trim().ToLower();
            int filterType = cmbTabFilter.SelectedIndex; // 0: all, 1: personal, 2: community

            lstMods.Items.Clear();
            foreach (var m in allMods)
            {
                if (filterType == 1 && m.type == "community") continue;
                if (filterType == 2 && m.type != "community") continue;

                if (!string.IsNullOrEmpty(q))
                {
                    bool match = (m.title != null && m.title.ToLower().Contains(q)) ||
                                 (m.author != null && m.author.ToLower().Contains(q)) ||
                                 (m.game != null && m.game.ToLower().Contains(q)) ||
                                 (m.id != null && m.id.ToLower().Contains(q));
                    if (!match) continue;
                }

                lstMods.Items.Add(m);
            }
        }

        private void SaveData(bool showMsg)
        {
            if (string.IsNullOrEmpty(txtTitle.Text.Trim()))
            {
                MessageBox.Show("Lütfen mod başlığını girin.", "Uyarı", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            string modId = txtId.Text.Trim();
            if (string.IsNullOrEmpty(modId))
            {
                modId = txtTitle.Text.Trim().ToLower().Replace(" ", "-");
            }

            ModItem target = currentSelected;
            if (target == null)
            {
                target = new ModItem();
                allMods.Add(target);
                currentSelected = target;
            }

            target.id = modId;
            target.type = cmbType.SelectedIndex == 1 ? "community" : "personal";
            target.game = txtGame.Text.Trim();
            target.title = txtTitle.Text.Trim();
            target.version = txtVersion.Text.Trim();
            target.updated = DateTime.Now.ToString("yyyy-MM-dd");
            target.author = txtAuthor.Text.Trim();
            target.download_url = txtDownloadUrl.Text.Trim();
            target.install_code = txtInstallCode.Text.Trim();
            target.icon = txtIcon.Text.Trim();
            target.tagline_tr = txtTaglineTr.Text.Trim();
            target.tagline_en = txtTaglineEn.Text.Trim();
            target.overview_tr = txtOverviewTr.Text.Trim();
            target.overview_en = txtOverviewEn.Text.Trim();

            target.tags = new List<string>();
            foreach (string t in txtTags.Text.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                target.tags.Add(t.Trim());
            }

            target.requirements = new List<string>();
            foreach (string r in txtRequirements.Text.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                target.requirements.Add(r.Trim());
            }

            target.install_steps_tr = new List<string>();
            foreach (string s in txtInstallStepsTr.Text.Split(new string[] { Environment.NewLine, "\n" }, StringSplitOptions.RemoveEmptyEntries))
            {
                target.install_steps_tr.Add(s.Trim());
            }

            target.features_tr = new List<string>();
            foreach (string f in txtFeaturesTr.Text.Split(new string[] { Environment.NewLine, "\n" }, StringSplitOptions.RemoveEmptyEntries))
            {
                target.features_tr.Add(f.Trim());
            }

            target.features_en = new List<string>();
            foreach (string f in txtFeaturesEn.Text.Split(new string[] { Environment.NewLine, "\n" }, StringSplitOptions.RemoveEmptyEntries))
            {
                target.features_en.Add(f.Trim());
            }

            // Parse Multi-Links: Title | URL | Icon
            target.links = new List<ModLink>();
            foreach (string line in txtLinks.Text.Split(new string[] { Environment.NewLine, "\n" }, StringSplitOptions.RemoveEmptyEntries))
            {
                string[] parts = line.Split('|');
                if (parts.Length >= 2)
                {
                    target.links.Add(new ModLink
                    {
                        title = parts[0].Trim(),
                        url = parts[1].Trim(),
                        icon = parts.Length > 2 ? parts[2].Trim() : parts[0].Trim().ToLower()
                    });
                }
            }

            try
            {
                JavaScriptSerializer ser = new JavaScriptSerializer();
                string json = ser.Serialize(allMods);
                string formatted = FormatJson(json);

                File.WriteAllText(jsonPath, formatted, new UTF8Encoding(false));
                RefreshList();
                lblStatus.Text = "Değişiklikler başarıyla kaydedildi (" + DateTime.Now.ToString("HH:mm:ss") + ")";

                if (showMsg)
                {
                    MessageBox.Show("mods.json başarıyla kaydedildi!", "Başarılı", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Kaydedilemedi: " + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void DeleteCurrentMod()
        {
            if (currentSelected == null) return;
            if (MessageBox.Show("'" + currentSelected.title + "' modunu silmek istediğinize emin misiniz?", "Onay", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                allMods.Remove(currentSelected);
                currentSelected = null;
                SaveData(false);
                RefreshList();
                if (lstMods.Items.Count > 0) lstMods.SelectedIndex = 0;
                else PrepareNewMod();
            }
        }

        private void PushToGitHub()
        {
            SaveData(false);
            btnPushGit.Enabled = false;
            btnPushGit.Text = "⏳ Gönderiliyor...";
            lblStatus.Text = "Git commit ve push yapılıyor...";

            try
            {
                string output = RunGitCommand("add .");
                output += Environment.NewLine + RunGitCommand("commit -m \"Update mods data via Native ModManager\"");
                output += Environment.NewLine + RunGitCommand("push origin main");

                MessageBox.Show("GitHub'a başarıyla gönderildi!\n\nÇıktı:\n" + output, "GitHub Güncellendi", MessageBoxButtons.OK, MessageBoxIcon.Information);
                lblStatus.Text = "GitHub Pages canlıya alındı!";
            }
            catch (Exception ex)
            {
                MessageBox.Show("Git hatası: " + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Error);
                lblStatus.Text = "Git işlemi başarısız oldu.";
            }
            finally
            {
                btnPushGit.Enabled = true;
                btnPushGit.Text = "🚀 GitHub'a Gönder (Push)";
            }
        }

        private string RunGitCommand(string args)
        {
            ProcessStartInfo psi = new ProcessStartInfo
            {
                FileName = "git",
                Arguments = args,
                WorkingDirectory = AppDomain.CurrentDomain.BaseDirectory,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (Process p = Process.Start(psi))
            {
                string stdout = p.StandardOutput.ReadToEnd();
                string stderr = p.StandardError.ReadToEnd();
                p.WaitForExit();
                return (stdout + " " + stderr).Trim();
            }
        }

        // Built-in Lightweight HTTP Server
        private void StartHttpServer()
        {
            try
            {
                httpListener = new HttpListener();
                httpListener.Prefixes.Add("http://127.0.0.1:" + Port + "/");
                httpListener.Start();

                httpThread = new Thread(ListenLoop) { IsBackground = true };
                httpThread.Start();
            }
            catch (Exception ex)
            {
                lblStatus.Text = "HTTP Sunucu başlatılamadı: " + ex.Message;
            }
        }

        private void StopHttpServer()
        {
            try
            {
                if (httpListener != null && httpListener.IsListening)
                {
                    httpListener.Stop();
                    httpListener.Close();
                }
            }
            catch { }
        }

        private void ListenLoop()
        {
            while (httpListener != null && httpListener.IsListening)
            {
                try
                {
                    HttpListenerContext ctx = httpListener.GetContext();
                    ThreadPool.QueueUserWorkItem((state) => HandleRequest(ctx));
                }
                catch { break; }
            }
        }

        private void HandleRequest(HttpListenerContext ctx)
        {
            try
            {
                string rawUrl = ctx.Request.Url.AbsolutePath;
                if (rawUrl == "/" || string.IsNullOrEmpty(rawUrl)) rawUrl = "/index.html";

                string relPath = rawUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                string fullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, relPath);

                if (File.Exists(fullPath))
                {
                    byte[] bytes = File.ReadAllBytes(fullPath);
                    string ext = Path.GetExtension(fullPath).ToLower();
                    string mime = "text/plain";
                    if (ext == ".html" || ext == ".htm") mime = "text/html; charset=utf-8";
                    else if (ext == ".js") mime = "text/javascript; charset=utf-8";
                    else if (ext == ".json") mime = "application/json; charset=utf-8";
                    else if (ext == ".css") mime = "text/css; charset=utf-8";
                    else if (ext == ".svg") mime = "image/svg+xml";
                    else if (ext == ".png") mime = "image/png";
                    else if (ext == ".jpg" || ext == ".jpeg") mime = "image/jpeg";
                    else if (ext == ".ico") mime = "image/x-icon";

                    ctx.Response.ContentType = mime;
                    ctx.Response.ContentLength64 = bytes.Length;
                    ctx.Response.StatusCode = 200;
                    ctx.Response.OutputStream.Write(bytes, 0, bytes.Length);
                }
                else
                {
                    ctx.Response.StatusCode = 404;
                }
            }
            catch { }
            finally
            {
                try { ctx.Response.OutputStream.Close(); } catch { }
            }
        }

        private void OpenSitePreview()
        {
            try
            {
                string url = "http://127.0.0.1:" + Port + "/index.html";
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
                lblStatus.Text = "Site yerel sunucu üzerinden açıldı: " + url;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Önizleme açılamadı: " + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private string GetStr(Dictionary<string, object> dict, string key, string def = "")
        {
            if (dict.ContainsKey(key) && dict[key] != null) return dict[key].ToString();
            return def;
        }

        private string FormatJson(string json)
        {
            int indent = 0;
            bool inQuotes = false;
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < json.Length; i++)
            {
                char ch = json[i];
                if (ch == '\"' && (i == 0 || json[i - 1] != '\\'))
                {
                    inQuotes = !inQuotes;
                    sb.Append(ch);
                }
                else if (!inQuotes)
                {
                    if (ch == '{' || ch == '[')
                    {
                        sb.Append(ch);
                        sb.AppendLine();
                        indent += 2;
                        sb.Append(new string(' ', indent));
                    }
                    else if (ch == '}' || ch == ']')
                    {
                        sb.AppendLine();
                        indent -= 2;
                        if (indent < 0) indent = 0;
                        sb.Append(new string(' ', indent));
                        sb.Append(ch);
                    }
                    else if (ch == ',')
                    {
                        sb.Append(ch);
                        sb.AppendLine();
                        sb.Append(new string(' ', indent));
                    }
                    else if (ch == ':')
                    {
                        sb.Append(": ");
                    }
                    else
                    {
                        sb.Append(ch);
                    }
                }
                else
                {
                    sb.Append(ch);
                }
            }
            return sb.ToString();
        }
    }
}
