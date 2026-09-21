using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Text;
using System.Web.Script.Serialization;
using System.Windows.Forms;

namespace ModHubManager
{
    public class ModItem
    {
        public string id { get; set; }
        public string type { get; set; }
        public string title { get; set; }
        public string version { get; set; }
        public string updated { get; set; }
        public string author { get; set; }
        public string platform { get; set; }
        public string platform_url { get; set; }
        public string download_url { get; set; }
        public string github_url { get; set; }
        public string evoweb_url { get; set; }
        public string icon { get; set; }
        public string install_code { get; set; }
        public string tagline_tr { get; set; }
        public string tagline_en { get; set; }
        public List<string> tags { get; set; }
        public List<string> features_tr { get; set; }
        public List<string> features_en { get; set; }

        public ModItem()
        {
            type = "personal";
            tags = new List<string>();
            features_tr = new List<string>();
            features_en = new List<string>();
        }
    }

    public class MainForm : Form
    {
        private List<ModItem> allMods = new List<ModItem>();
        private string jsonPath = "mods.json";
        private ModItem currentSelected = null;

        // UI Controls
        private TextBox txtSearch;
        private ComboBox cmbTabFilter;
        private ListBox lstMods;
        private Button btnAddNew;
        private Button btnDelete;

        private ComboBox cmbType;
        private TextBox txtId;
        private TextBox txtTitle;
        private TextBox txtVersion;
        private TextBox txtAuthor;
        private TextBox txtPlatform;
        private TextBox txtPlatformUrl;
        private TextBox txtDownloadUrl;
        private TextBox txtGithubUrl;
        private TextBox txtEvowebUrl;
        private TextBox txtInstallCode;
        private TextBox txtIcon;
        private Button btnBrowseIcon;
        private ComboBox cmbPresetIcon;
        private TextBox txtTaglineTr;
        private TextBox txtTaglineEn;
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
            this.Text = "Lkxex Mod Yöneticisi & Editör (Native C#)";
            this.Size = new Size(1080, 780);
            this.MinimumSize = new Size(950, 680);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(13, 17, 23);
            this.ForeColor = Color.FromArgb(240, 246, 252);
            this.Font = new Font("Segoe UI", 9.25f, FontStyle.Regular);

            BuildUI();
            LoadData();
        }

        private void BuildUI()
        {
            // Top Action Bar
            Panel topBar = new Panel
            {
                Dock = DockStyle.Top,
                Height = 54,
                BackColor = Color.FromArgb(22, 27, 34),
                Padding = new Padding(12, 10, 12, 10)
            };

            Label lblAppTitle = new Label
            {
                Text = "⚡ Lkxex Hub Manager",
                ForeColor = Color.FromArgb(88, 101, 242),
                Font = new Font("Segoe UI", 12f, FontStyle.Bold),
                AutoSize = true,
                Location = new Point(12, 14)
            };
            topBar.Controls.Add(lblAppTitle);

            btnPreviewSite = CreateButton("🌐 Sitede Önizle", Color.FromArgb(33, 38, 45), Color.FromArgb(240, 246, 252), 130, 32);
            btnPreviewSite.Location = new Point(560, 10);
            btnPreviewSite.Click += (s, e) => OpenSitePreview();
            topBar.Controls.Add(btnPreviewSite);

            btnSave = CreateButton("💾 mods.json Kaydet", Color.FromArgb(35, 134, 54), Color.White, 160, 32);
            btnSave.Location = new Point(700, 10);
            btnSave.Click += (s, e) => SaveData(true);
            topBar.Controls.Add(btnSave);

            btnPushGit = CreateButton("🚀 GitHub'a Gönder (Push)", Color.FromArgb(88, 101, 242), Color.White, 180, 32);
            btnPushGit.Location = new Point(870, 10);
            btnPushGit.Click += (s, e) => PushToGitHub();
            topBar.Controls.Add(btnPushGit);

            this.Controls.Add(topBar);

            // Bottom Status Bar
            Panel statusBar = new Panel
            {
                Dock = DockStyle.Bottom,
                Height = 30,
                BackColor = Color.FromArgb(22, 27, 34),
                Padding = new Padding(12, 5, 12, 5)
            };
            lblStatus = new Label
            {
                Text = "Hazır",
                ForeColor = Color.FromArgb(139, 148, 158),
                Dock = DockStyle.Fill,
                TextAlign = ContentAlignment.MiddleLeft
            };
            statusBar.Controls.Add(lblStatus);
            this.Controls.Add(statusBar);

            // Main Split: Left List, Right Form
            SplitContainer split = new SplitContainer
            {
                Dock = DockStyle.Fill,
                SplitterDistance = 330,
                FixedPanel = FixedPanel.Panel1,
                BackColor = Color.FromArgb(48, 54, 61)
            };
            this.Controls.Add(split);
            split.BringToFront();

            // --- LEFT PANEL ---
            Panel leftPanel = split.Panel1;
            leftPanel.BackColor = Color.FromArgb(13, 17, 23);
            leftPanel.Padding = new Padding(12);

            Label lblListHeader = new Label
            {
                Text = "📦 Mod Listesi",
                Font = new Font("Segoe UI", 10.5f, FontStyle.Bold),
                ForeColor = Color.FromArgb(240, 246, 252),
                Dock = DockStyle.Top,
                Height = 26
            };
            leftPanel.Controls.Add(lblListHeader);

            txtSearch = new TextBox
            {
                Dock = DockStyle.Top,
                BackColor = Color.FromArgb(22, 27, 34),
                ForeColor = Color.FromArgb(240, 246, 252),
                BorderStyle = BorderStyle.FixedSingle,
                Height = 26
            };
            txtSearch.TextChanged += (s, e) => RefreshList();
            leftPanel.Controls.Add(txtSearch);

            cmbTabFilter = new ComboBox
            {
                Dock = DockStyle.Top,
                DropDownStyle = ComboBoxStyle.DropDownList,
                BackColor = Color.FromArgb(22, 27, 34),
                ForeColor = Color.FromArgb(240, 246, 252),
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
                BackColor = Color.FromArgb(22, 27, 34),
                ForeColor = Color.FromArgb(240, 246, 252),
                BorderStyle = BorderStyle.FixedSingle,
                DrawMode = DrawMode.OwnerDrawFixed,
                ItemHeight = 44
            };
            lstMods.DrawItem += LstMods_DrawItem;
            lstMods.SelectedIndexChanged += LstMods_SelectedIndexChanged;
            leftPanel.Controls.Add(lstMods);

            Panel leftBottomBtns = new Panel
            {
                Dock = DockStyle.Bottom,
                Height = 42,
                Padding = new Padding(0, 8, 0, 0)
            };
            btnAddNew = CreateButton("➕ Yeni Mod Ekle", Color.FromArgb(35, 134, 54), Color.White, 145, 32);
            btnAddNew.Dock = DockStyle.Left;
            btnAddNew.Click += (s, e) => PrepareNewMod();
            leftBottomBtns.Controls.Add(btnAddNew);

            btnDelete = CreateButton("🗑️ Sil", Color.FromArgb(218, 54, 51), Color.White, 80, 32);
            btnDelete.Dock = DockStyle.Right;
            btnDelete.Click += (s, e) => DeleteCurrentMod();
            leftBottomBtns.Controls.Add(btnDelete);

            leftPanel.Controls.Add(leftBottomBtns);

            // --- RIGHT PANEL (EDITOR FORM) ---
            Panel rightPanel = split.Panel2;
            rightPanel.BackColor = Color.FromArgb(13, 17, 23);
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

            // Row 1: Type & ID
            cmbType = CreateComboBox(new string[] { "personal: ⚡ Kendi Modum (Geliştirici)", "community: 🌟 Popüler Topluluk Modu" });
            txtId = CreateTextBox("Örn: pes2021-discord-rpc");
            formTable.Controls.Add(CreateFieldGroup("Mod Türü (Category):", cmbType), 0, 0);
            formTable.Controls.Add(CreateFieldGroup("Mod ID (Benzersiz Kısayol):", txtId), 1, 0);

            // Row 2: Title & Version
            txtTitle = CreateTextBox("Örn: PES 2021 Discord Rich Presence");
            txtVersion = CreateTextBox("Örn: v1.0.11");
            formTable.Controls.Add(CreateFieldGroup("Mod Başlığı (Title):", txtTitle), 0, 1);
            formTable.Controls.Add(CreateFieldGroup("Sürüm (Version):", txtVersion), 1, 1);

            // Row 3: Author & Platform
            txtAuthor = CreateTextBox("Örn: Lkxex veya juce & nesa24");
            txtPlatform = CreateTextBox("Örn: EvoWeb, Modrinth, CurseForge, GitHub");
            formTable.Controls.Add(CreateFieldGroup("Geliştirici / Yazar (Author):", txtAuthor), 0, 2);
            formTable.Controls.Add(CreateFieldGroup("Platform Adı (Platform):", txtPlatform), 1, 2);

            // Row 4: Platform URL & Download URL
            txtPlatformUrl = CreateTextBox("https://evoweb.uk/... veya https://modrinth.com/...");
            txtDownloadUrl = CreateTextBox("https://github.com/.../release.zip");
            formTable.Controls.Add(CreateFieldGroup("Mod Sayfası URL (Platform URL):", txtPlatformUrl), 0, 3);
            formTable.Controls.Add(CreateFieldGroup("Doğrudan İndirme Linki (Download URL):", txtDownloadUrl), 1, 3);

            // Row 5: GitHub URL & EvoWeb URL
            txtGithubUrl = CreateTextBox("https://github.com/...");
            txtEvowebUrl = CreateTextBox("https://evoweb.uk/threads/...");
            formTable.Controls.Add(CreateFieldGroup("GitHub Depo Linki:", txtGithubUrl), 0, 4);
            formTable.Controls.Add(CreateFieldGroup("EvoWeb / Forum Linki (Opsiyonel):", txtEvowebUrl), 1, 4);

            // Row 6: Install Code & Icon Picker
            txtInstallCode = CreateTextBox("lua.module = \"discord_rpc.lua\"");
            txtInstallCode.Font = new Font("Consolas", 9f);
            txtInstallCode.ForeColor = Color.FromArgb(121, 192, 255);

            Panel iconPanel = new Panel { Dock = DockStyle.Fill, Height = 56 };
            txtIcon = new TextBox
            {
                Location = new Point(0, 0),
                Width = 220,
                Height = 24,
                BackColor = Color.FromArgb(22, 27, 34),
                ForeColor = Color.FromArgb(240, 246, 252),
                BorderStyle = BorderStyle.FixedSingle
            };
            btnBrowseIcon = CreateButton("📁 Gözat", Color.FromArgb(33, 38, 45), Color.FromArgb(240, 246, 252), 70, 24);
            btnBrowseIcon.Location = new Point(226, 0);
            btnBrowseIcon.Click += (s, e) => BrowseImage();

            cmbPresetIcon = new ComboBox
            {
                Location = new Point(0, 28),
                Width = 296,
                DropDownStyle = ComboBoxStyle.DropDownList,
                BackColor = Color.FromArgb(22, 27, 34),
                ForeColor = Color.FromArgb(240, 246, 252),
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

            formTable.Controls.Add(CreateFieldGroup("Kurulum Satırı (sider.ini / config):", txtInstallCode), 0, 5);
            formTable.Controls.Add(CreateFieldGroup("Küçük Resim / İkon (Icon):", iconPanel), 1, 5);

            // Row 7: Tagline TR & Tagline EN
            txtTaglineTr = CreateMultiTextBox(2, "Modun ne yaptığını kısaca anlatın (Türkçe)...");
            txtTaglineEn = CreateMultiTextBox(2, "Brief description in English...");
            formTable.Controls.Add(CreateFieldGroup("Açıklama (Türkçe):", txtTaglineTr), 0, 6);
            formTable.Controls.Add(CreateFieldGroup("Açıklama (İngilizce):", txtTaglineEn), 1, 6);

            // Row 8: Tags
            txtTags = CreateTextBox("PES 2021, Sider 7, Discord RPC, Zero-GC");
            formTable.Controls.Add(CreateFieldGroup("Etiketler (Virgülle ayırın):", txtTags), 0, 7);
            formTable.SetColumnSpan(formTable.GetControlFromPosition(0, 7), 2);

            // Row 9: Features TR & Features EN
            txtFeaturesTr = CreateMultiTextBox(3, "Her satıra bir özellik maddesi yazın (Türkçe)...");
            txtFeaturesEn = CreateMultiTextBox(3, "One feature bullet per line (English)...");
            formTable.Controls.Add(CreateFieldGroup("Özellikler / Maddeler (Türkçe):", txtFeaturesTr), 0, 8);
            formTable.Controls.Add(CreateFieldGroup("Özellikler / Maddeler (İngilizce):", txtFeaturesEn), 1, 8);

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
                ForeColor = Color.FromArgb(139, 148, 158),
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
                BackColor = Color.FromArgb(22, 27, 34),
                ForeColor = Color.FromArgb(240, 246, 252),
                BorderStyle = BorderStyle.FixedSingle,
                Height = 24
            };
        }

        private TextBox CreateMultiTextBox(int lines, string placeholder = "")
        {
            return new TextBox
            {
                BackColor = Color.FromArgb(22, 27, 34),
                ForeColor = Color.FromArgb(240, 246, 252),
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
                BackColor = Color.FromArgb(22, 27, 34),
                ForeColor = Color.FromArgb(240, 246, 252),
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
            Color bg = isSelected ? Color.FromArgb(30, 41, 59) : Color.FromArgb(22, 27, 34);
            using (SolidBrush b = new SolidBrush(bg))
            {
                e.Graphics.FillRectangle(b, e.Bounds);
            }

            // Draw Category Tag Pill
            bool isComm = mod.type == "community";
            string typePill = isComm ? "TOPLULUK" : "KENDİ";
            Color pillBg = isComm ? Color.FromArgb(245, 158, 11) : Color.FromArgb(88, 101, 242);
            Rectangle pillRect = new Rectangle(e.Bounds.Right - 74, e.Bounds.Top + 6, 66, 18);
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

            // Draw Title & Version
            using (SolidBrush tb = new SolidBrush(Color.FromArgb(240, 246, 252)))
            {
                using (Font tf = new Font("Segoe UI", 9.25f, FontStyle.Bold))
                {
                    e.Graphics.DrawString(mod.title ?? "Başlıksız", tf, tb, e.Bounds.Left + 8, e.Bounds.Top + 5);
                }
            }
            using (SolidBrush sb = new SolidBrush(Color.FromArgb(139, 148, 158)))
            {
                using (Font sf = new Font("Segoe UI", 8.25f, FontStyle.Regular))
                {
                    string sub = (mod.version ?? "") + (string.IsNullOrEmpty(mod.author) ? "" : " • " + mod.author);
                    e.Graphics.DrawString(sub, sf, sb, e.Bounds.Left + 8, e.Bounds.Top + 24);
                }
            }

            // Bottom subtle divider
            using (Pen p = new Pen(Color.FromArgb(33, 38, 45)))
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
            txtId.Text = m.id ?? "";
            txtTitle.Text = m.title ?? "";
            txtVersion.Text = m.version ?? "";
            txtAuthor.Text = m.author ?? "";
            txtPlatform.Text = m.platform ?? "";
            txtPlatformUrl.Text = m.platform_url ?? "";
            txtDownloadUrl.Text = m.download_url ?? "";
            txtGithubUrl.Text = m.github_url ?? "";
            txtEvowebUrl.Text = m.evoweb_url ?? "";
            txtInstallCode.Text = m.install_code ?? "";
            txtIcon.Text = m.icon ?? "";
            txtTaglineTr.Text = m.tagline_tr ?? "";
            txtTaglineEn.Text = m.tagline_en ?? "";
            txtTags.Text = m.tags != null ? string.Join(", ", m.tags.ToArray()) : "";
            txtFeaturesTr.Text = m.features_tr != null ? string.Join(Environment.NewLine, m.features_tr.ToArray()) : "";
            txtFeaturesEn.Text = m.features_en != null ? string.Join(Environment.NewLine, m.features_en.ToArray()) : "";

            lblStatus.Text = "Seçildi: " + m.title;
        }

        private void PrepareNewMod()
        {
            currentSelected = null;
            lstMods.ClearSelected();
            cmbType.SelectedIndex = 0;
            txtId.Text = "yeni-mod-" + DateTime.Now.ToString("HHmmss");
            txtTitle.Text = "";
            txtVersion.Text = "v1.0.0";
            txtAuthor.Text = "Lkxex";
            txtPlatform.Text = "";
            txtPlatformUrl.Text = "";
            txtDownloadUrl.Text = "";
            txtGithubUrl.Text = "";
            txtEvowebUrl.Text = "";
            txtInstallCode.Text = "";
            txtIcon.Text = "./assets/images/projects/pes2021-icon.svg";
            txtTaglineTr.Text = "";
            txtTaglineEn.Text = "";
            txtTags.Text = "";
            txtFeaturesTr.Text = "";
            txtFeaturesEn.Text = "";
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
                            title = GetStr(dict, "title"),
                            version = GetStr(dict, "version"),
                            updated = GetStr(dict, "updated"),
                            author = GetStr(dict, "author"),
                            platform = GetStr(dict, "platform"),
                            platform_url = GetStr(dict, "platform_url"),
                            download_url = GetStr(dict, "download_url"),
                            github_url = GetStr(dict, "github_url"),
                            evoweb_url = GetStr(dict, "evoweb_url"),
                            icon = GetStr(dict, "icon"),
                            install_code = GetStr(dict, "install_code"),
                            tagline_tr = GetStr(dict, "tagline_tr"),
                            tagline_en = GetStr(dict, "tagline_en")
                        };

                        if (dict.ContainsKey("tags"))
                        {
                            ArrayList tList = dict["tags"] as ArrayList;
                            if (tList != null)
                            {
                                foreach (object o in tList) m.tags.Add(o.ToString());
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
                                 (m.platform != null && m.platform.ToLower().Contains(q)) ||
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
            target.title = txtTitle.Text.Trim();
            target.version = txtVersion.Text.Trim();
            target.updated = DateTime.Now.ToString("yyyy-MM-dd");
            target.author = txtAuthor.Text.Trim();
            target.platform = txtPlatform.Text.Trim();
            target.platform_url = txtPlatformUrl.Text.Trim();
            target.download_url = txtDownloadUrl.Text.Trim();
            target.github_url = txtGithubUrl.Text.Trim();
            target.evoweb_url = txtEvowebUrl.Text.Trim();
            target.install_code = txtInstallCode.Text.Trim();
            target.icon = txtIcon.Text.Trim();
            target.tagline_tr = txtTaglineTr.Text.Trim();
            target.tagline_en = txtTaglineEn.Text.Trim();

            target.tags = new List<string>();
            foreach (string t in txtTags.Text.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                target.tags.Add(t.Trim());
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

        private void OpenSitePreview()
        {
            try
            {
                string indexPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "index.html");
                Process.Start(new ProcessStartInfo(indexPath) { UseShellExecute = true });
                lblStatus.Text = "Site tarayıcıda açıldı.";
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
