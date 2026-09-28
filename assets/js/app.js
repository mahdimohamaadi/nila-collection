(function(){
"use strict";

/* ============================================================
   Persistence — this is now a real multi-page site (separate
   HTML files, real navigation), so cart/wishlist/theme/language
   need to survive a page load to feel like one cohesive store.
   Falls back to in-memory only if storage is unavailable (e.g.
   when previewed inside an environment that blocks it) — the
   site still works, it just won't remember state across pages.
   ============================================================ */
const STORE_PREFIX = 'nila_';
function storeGet(key, fallback){
  try{
    const raw = localStorage.getItem(STORE_PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  }catch(e){ return fallback; }
}
function storeSet(key, value){
  try{ localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value)); }catch(e){ /* ignore */ }
}

/* ============================================================
   Language / translation system (Persian default, English toggle)
   ============================================================ */
let currentLang = storeGet('lang', 'fa');
const I18N = {
  fa:{
    nav_new:"جدیدترین‌ها", nav_women:"زنانه", nav_men:"مردانه", nav_access:"اکسسوری",
    nav_collections:"مجموعه‌ها", nav_about:"درباره ما", nav_bestsellers:"پرفروش‌ها",
    aria_search:"جست‌وجو", aria_account:"حساب کاربری", aria_wishlist:"علاقه‌مندی‌ها",
    aria_wishlist_add:"افزودن به علاقه‌مندی‌ها", aria_cart:"سبد خرید",
    aria_menu_open:"باز کردن منو", aria_menu_close:"بستن منو",
    aria_theme:"تغییر حالت نمایش", aria_lang:"تغییر زبان", aria_colors:"انتخاب رنگ",
    aria_search_close:"بستن جست‌وجو", aria_cart_close:"بستن سبد خرید", aria_prev:"قبلی", aria_next:"بعدی", aria_subscribe:"عضویت", aria_home:"نیلا — صفحه اصلی", aria_menu_nav:"منوی ناوبری", aria_primary_nav:"ناوبری اصلی", aria_theme_group:"حالت نمایش", aria_theme_light:"حالت روشن", aria_theme_dark:"حالت تیره",
    hero_eyebrow:"مجموعهٔ پاییز · زمستان ۲۰۲۶",
    hero_desc:"پوشاکی که بین راحتی روزمره و ظرافتِ یک برند واقعی تعادل برقرار می‌کند. مجموعهٔ تازهٔ نیلا از امروز در دسترس است.",
    hero_cta1:"مشاهدهٔ مجموعه", hero_cta2:"زنانه و مردانه",
    trust_ship_t:"ارسال رایگان", trust_ship_d:"بالای ۲,۰۰۰,۰۰۰ تومان",
    trust_return_t:"۷ روز مهلت بازگشت", trust_return_d:"بدون پرسش اضافه",
    trust_pay_t:"پرداخت امن", trust_pay_d:"درگاه معتبر بانکی",
    trust_auth_t:"ضمانت اصالت", trust_auth_d:"روی تمام محصولات",
    cat_heading:"خرید بر اساس دسته", cat_desc:"سه دنیای نیلا؛ هرکدام با انتخابی مجزا از پارچه و برش.",
    cat_women:"زنانه", cat_men:"مردانه", cat_access:"اکسسوری",
    cat_count_women:"۴۲ محصول", cat_count_men:"۳۱ محصول", cat_count_access:"۱۸ محصول",
    ws_title:"زنانه", ws_subtitle:"وقتی سادگی، امضای توست.", ws_cta:"مشاهده تمام محصولات",
    ws_tab_clothing:"لباس", ws_tab_coat:"مانتو", ws_tab_access:"اکسسوری",
    wm_title:"مردانه", wm_subtitle:"استایل ماندگار، برای هر موقعیت.",
    wm_tab_clothing:"لباس", wm_tab_apparel:"پوشاک", wm_tab_shoes:"کفش",
    wa_title:"اکسسوری", wa_subtitle:"جزئیاتی که استایل شما را کامل می‌کنند.",
    wa_tab_watch:"ساعت", wa_tab_glasses:"عینک", wa_tab_bag:"کیف", wa_tab_jewelry:"زیورآلات",
    aria_tabs_women:"دسته‌های زنانه", aria_tabs_men:"دسته‌های مردانه", aria_tabs_access:"دسته‌های اکسسوری",
    new_heading:"جدیدترین‌ها", new_desc:"تازه‌ترین قطعات نیلا، همین امروز اضافه شدند.",
    promo_kicker:"مجموعهٔ تازه", promo_heading:"پاییز · زمستان ۲۰۲۶",
    promo_desc:"لایه‌های گرم، برش‌های تمیز، رنگ‌بندی خنثی. مجموعه‌ای برای فصلی که همین حالا شروع شده.",
    promo_cta:"مشاهدهٔ کالکشن",
    best_heading:"پرفروش‌های نیلا", best_desc:"آن‌ها که بیشتر از همه دوباره سفارش داده می‌شوند.",
    best_viewall:"مشاهدهٔ همه",
    badge_new:"جدید", badge_bestseller:"پرفروش", quickadd:"افزودن به سبد",
    nl_heading:"از اولین‌ها باش", nl_desc:"خبرِ رسیدنِ مجموعهٔ تازه و تخفیف‌های ویژه، پیش از همه، فقط برای مشترکین.",
    nl_placeholder:"ایمیل شما", nl_note:"بدون اسپم. هر وقت خواستی، لغو کن.",
    nl_success:"ثبت شد — به جمعِ نیلا خوش آمدی.",
    footer_tagline:"فروشگاه آنلاین پوشاک زنانه، مردانه و اکسسوری با کیفیتی که حس می‌کنی.",
    footer_shop_h:"فروشگاه", footer_brand_h:"نیلا", footer_support_h:"پشتیبانی", footer_social_h:"همراهی",
    footer_about:"دربارهٔ ما", footer_collab:"همکاری با ما", footer_wholesale:"فروش عمده",
    footer_contact:"تماس با ما", footer_shipping:"ارسال و مرجوعی", footer_sizeguide:"راهنمای سایز",
    footer_instagram:"اینستاگرام", footer_telegram:"تلگرام", footer_pinterest:"پینترست",
    footer_copyright:"© ۱۴۰۴ نیلا — تمامی حقوق محفوظ است.", footer_madein:"طراحی در تهران",
    cart_heading:"سبد خرید", cart_subtotal:"جمعِ اقلام", cart_total:"مجموع",
    cart_checkout:"ادامهٔ خرید", cart_note:"ارسال رایگان برای خریدهای بالای ۲,۰۰۰,۰۰۰ تومان",
    cart_empty_msg:"سبد خرید شما خالی است. هنوز چیزی برای نگه‌داشتن پیدا نکردی؟",
    cart_empty_link:"مشاهدهٔ جدیدترین‌ها", cart_remove:"حذف",
    search_placeholder:"جست‌وجوی محصول، رنگ یا دسته…",
    toast_added_cart:'«{name}» به سبد اضافه شد.', toast_added_wish:'«{name}» به علاقه‌مندی‌ها اضافه شد.',
    toast_wish_empty:"لیست علاقه‌مندی‌ها خالی است.", toast_wish_view:"برای مشاهدهٔ کاملِ لیست، وارد شوید.",
    toast_account:"برای مشاهدهٔ حساب کاربری، وارد شوید.",
    toast_checkout_demo:"این یک دموی طراحی است — تسویه‌حساب پیاده‌سازی نشده.",
    toast_generic_demo:"این بخش در دموی فعلی ساخته نشده.", toast_newsletter:"عضویت با موفقیت ثبت شد.",
    mm_wishlist:"علاقه‌مندی‌ها", mm_account:"حساب کاربری",
    aria_auth_close:"بستن پنجرهٔ حساب کاربری",
    auth_tab_login:"ورود", auth_tab_signup:"ثبت‌نام",
    auth_title_login:"ورود به حساب کاربری", auth_title_signup:"ساختِ حساب کاربری",
    form_password:"رمز عبور",
    auth_cta_login:"ورود", auth_cta_signup:"ساختِ حساب",
    auth_switch_to_signup:"حساب کاربری نداری؟ ثبت‌نام کن", auth_switch_to_login:"قبلاً ثبت‌نام کردی؟ وارد شو",
    auth_err_fill:"لطفاً همهٔ فیلدها را پر کن.", auth_err_email:"یک ایمیلِ معتبر وارد کن.",
    auth_err_password_len:"رمز عبور باید حداقل ۶ کاراکتر باشد.",
    auth_err_exists:"این ایمیل قبلاً ثبت‌نام شده — وارد شو.",
    auth_err_invalid:"ایمیل یا رمز عبور اشتباه است.",
    auth_success_signup:"خوش آمدی، {name}! حساب کاربری‌ات ساخته شد.",
    auth_success_login:"خوش برگشتی، {name}!", auth_logout_success:"از حساب کاربری خارج شدی.",
    auth_title_account:"حساب من", auth_signed_in_as:"وارد شده با", auth_logout:"خروج از حساب",
    auth_demo_note:"این یک دموی طراحی است — اطلاعات فقط در همین مرورگر ذخیره می‌شود.",
    qty_decrease:"کاهش تعداد", qty_increase:"افزایش تعداد",
    grid_empty:"هنوز محصولی در این دسته اضافه نشده — به‌زودی برمی‌گردیم.",
    form_name:"نام و نام خانوادگی", form_email:"ایمیل", form_phone:"شمارهٔ تماس",
    form_message:"پیام", form_other:"سایر",
    about_eyebrow:"دربارهٔ نیلا", about_h1:"داستانی که با یک نخ شروع شد",
    about_lead:"نیلا از دلِ یک کارگاهِ کوچک در تهران متولد شد؛ جایی که هنوز هم هر تکه لباس با دقت طراحی، رنگ‌شده و دوخته می‌شود.",
    about_quote:"لباس، ظرفِ خاطره‌هاست. ما آن را برای سال‌ها می‌دوزیم، نه برای یک فصل.",
    about_body1:"نیلا در سال ۱۴۰۲ با یک ایدهٔ ساده شکل گرفت: پوشاکی که هم راحتِ روزمره باشد و هم ظرافتِ یک برندِ واقعی را داشته باشد. از همان روزِ اول، تصمیم گرفتیم به‌جای تولیدِ انبوه، روی کیفیت و جزئیات تمرکز کنیم.",
    about_body2:"امروز، تیمِ کوچکِ ما همچنان همان فلسفه را دنبال می‌کند؛ انتخابِ دقیقِ پارچه، دوختِ دست و بازرسیِ تک‌به‌تکِ هر محصول پیش از رسیدن به دستِ شما.",
    about_values_h:"ارزش‌های ما", about_values_desc:"آنچه هر تصمیمِ ما را شکل می‌دهد.",
    about_val1_t:"کیفیتِ بی‌قید و شرط", about_val1_d:"هر پارچه پیش از دوخت، از نظرِ دوام و احساسِ روی پوست بررسی می‌شود.",
    about_val2_t:"دوختِ دست", about_val2_d:"هر قطعه، از برش تا دوختِ نهایی، زیرِ نظرِ مستقیمِ خیاطانِ ماست.",
    about_val3_t:"تولیدِ محدود", about_val3_d:"هر مدل در تعدادِ محدود تولید می‌شود تا کیفیت فدای کمیت نشود.",
    about_val4_t:"دسترسیِ سراسری", about_val4_d:"ارسال به سراسرِ کشور، با بسته‌بندیِ ساده و قابلِ بازیافت.",
    about_stat1_n:"۱۴۰۲", about_stat1_l:"آغازِ کارگاه",
    about_stat2_n:"۶", about_stat2_l:"نفر، تمام‌وقت",
    about_stat3_n:"+۵۰۰۰", about_stat3_l:"مشتریِ راضی",
    about_stat4_n:"+۱۶", about_stat4_l:"محصولِ فعال",
    about_cta:"مشاهدهٔ مجموعه",
    collab_eyebrow:"همکاری با نیلا", collab_h1:"بیا با هم کار کنیم",
    collab_lead:"اگر برندت، صفحه‌ات یا فروشگاهت با فلسفهٔ نیلا همسو است، دوست داریم بشناسیمت.",
    collab_c1_t:"فروشگاه‌های همکار", collab_c1_d:"اگر فروشگاهی دارید و به عرضهٔ مجموعهٔ نیلا در کنارِ برندهای دیگر علاقه‌مندید، فرمِ زیر را پر کنید.",
    collab_c2_t:"اینفلوئنسرها و خالقانِ محتوا", collab_c2_d:"برای همکاری در معرفیِ مجموعه‌های نیلا در فضای مجازی و شبکه‌های اجتماعی.",
    collab_c3_t:"رسانه و مطبوعات", collab_c3_d:"برای درخواستِ مصاحبه، عکسِ باکیفیت یا اطلاعاتِ مطبوعاتیِ برند.",
    collab_form_h:"فرمِ درخواستِ همکاری", collab_form_desc:"ظرفِ ۳ تا ۵ روزِ کاری پاسخ می‌دهیم.",
    collab_form_type:"نوعِ همکاری", collab_form_submit:"ارسالِ درخواست",
    wholesale_eyebrow:"خریدِ عمده", wholesale_h1:"نیلا را در فروشگاهت عرضه کن",
    wholesale_lead:"برای فروشگاه‌ها و کسب‌وکارهایی که می‌خواهند مجموعهٔ نیلا را در مقیاسِ بزرگ‌تر عرضه کنند.",
    wholesale_terms_h:"شرایطِ همکاری",
    wholesale_b1_t:"حداقلِ سفارش", wholesale_b1_d:"حداقلِ سفارشِ عمده، ۲۰ قطعه در هر مدل و رنگ است.",
    wholesale_b2_t:"قیمت‌گذاریِ پلکانی", wholesale_b2_d:"هرچه حجمِ سفارش بیشتر باشد، درصدِ تخفیفِ عمده هم بیشتر می‌شود.",
    wholesale_b3_t:"زمانِ آماده‌سازی", wholesale_b3_d:"سفارش‌های عمده معمولاً ظرفِ ۱۰ تا ۱۴ روزِ کاری آماده و ارسال می‌شوند.",
    wholesale_b4_t:"پشتیبانیِ اختصاصی", wholesale_b4_d:"یک کارشناسِ فروشِ عمده، از ابتدا تا تحویلِ سفارش همراهِ شماست.",
    wholesale_form_h:"درخواستِ همکاریِ عمده", wholesale_form_desc:"ظرفِ ۳ تا ۵ روزِ کاری پاسخ می‌دهیم.",
    wholesale_form_business:"نامِ کسب‌وکار", wholesale_form_volume:"حجمِ سفارشِ تخمینی",
    wholesale_vol1:"۲۰ تا ۵۰ قطعه", wholesale_vol2:"۵۰ تا ۲۰۰ قطعه", wholesale_vol3:"بیش از ۲۰۰ قطعه",
    wholesale_form_submit:"ارسالِ درخواست",
    size_eyebrow:"راهنمای سایز", size_h1:"سایزِ درست را پیدا کن",
    size_lead:"برای انتخابِ دقیق‌ترین سایز، اندازه‌های خودت را با جدولِ زیر مقایسه کن.",
    size_how_h:"چطور اندازه بگیریم",
    size_step1_t:"دورِ سینه", size_step1_d:"متر را دورِ برجسته‌ترین قسمتِ سینه، به‌صورتِ افقی و بدون فشار، بپیچید.",
    size_step2_t:"دورِ کمر", size_step2_d:"باریک‌ترین قسمتِ کمر، درست بالای ناف را اندازه بگیرید.",
    size_step3_t:"دورِ باسن", size_step3_d:"متر را دورِ برجسته‌ترین قسمتِ باسن، به‌صورتِ افقی، بکشید.",
    size_women_h:"جدولِ سایزِ زنانه", size_unit:"تمامِ اندازه‌ها بر حسبِ سانتی‌متر است.",
    size_col_size:"سایز", size_col_bust:"دورِ سینه", size_col_waist:"دورِ کمر", size_col_hip:"دورِ باسن",
    size_men_h:"جدولِ سایزِ مردانه", size_col_chest:"دورِ سینه", size_col_inseam:"طولِ داخلِ پا",
    size_note:"اگر بینِ دو سایز مردد هستید، معمولاً سایزِ بزرگ‌تر را پیشنهاد می‌کنیم.",
    toast_collab_success:"درخواستِ همکاری ثبت شد — به‌زودی پاسخ می‌دهیم.",
    toast_wholesale_success:"درخواست ثبت شد — کارشناسِ فروشِ عمده به‌زودی تماس می‌گیرد.",
  },
  en:{
    nav_new:"New In", nav_women:"Women", nav_men:"Men", nav_access:"Accessories",
    nav_collections:"Collections", nav_about:"About Us", nav_bestsellers:"Bestsellers",
    aria_search:"Search", aria_account:"Account", aria_wishlist:"Wishlist",
    aria_wishlist_add:"Add to wishlist", aria_cart:"Shopping cart",
    aria_menu_open:"Open menu", aria_menu_close:"Close menu",
    aria_theme:"Toggle theme", aria_lang:"Change language", aria_colors:"Choose color",
    aria_search_close:"Close search", aria_cart_close:"Close cart", aria_prev:"Previous", aria_next:"Next", aria_subscribe:"Subscribe", aria_home:"Nila — Homepage", aria_menu_nav:"Navigation Menu", aria_primary_nav:"Main Navigation", aria_theme_group:"Display mode", aria_theme_light:"Light mode", aria_theme_dark:"Dark mode",
    hero_eyebrow:"Autumn · Winter 2026 Collection",
    hero_desc:"Clothing that balances everyday comfort with the elegance of a real brand. Nila's new collection is available today.",
    hero_cta1:"View Collection", hero_cta2:"Women & Men",
    trust_ship_t:"Free Shipping", trust_ship_d:"On orders over 2,000,000 Toman",
    trust_return_t:"7-Day Returns", trust_return_d:"No questions asked",
    trust_pay_t:"Secure Payment", trust_pay_d:"Trusted payment gateway",
    trust_auth_t:"Authenticity Guarantee", trust_auth_d:"On all products",
    cat_heading:"Shop by Category", cat_desc:"Three worlds of Nila, each with its own choice of fabric and cut.",
    cat_women:"Women", cat_men:"Men", cat_access:"Accessories",
    cat_count_women:"42 Products", cat_count_men:"31 Products", cat_count_access:"18 Products",
    ws_title:"Women", ws_subtitle:"When simplicity is your signature.", ws_cta:"View All Products",
    ws_tab_clothing:"Clothing", ws_tab_coat:"Coats", ws_tab_access:"Accessories",
    wm_title:"Men", wm_subtitle:"Timeless style, for every occasion.",
    wm_tab_clothing:"Clothing", wm_tab_apparel:"Apparel", wm_tab_shoes:"Shoes",
    wa_title:"Accessories", wa_subtitle:"Details that complete your style.",
    wa_tab_watch:"Watches", wa_tab_glasses:"Eyewear", wa_tab_bag:"Bags", wa_tab_jewelry:"Jewelry",
    aria_tabs_women:"Women categories", aria_tabs_men:"Men categories", aria_tabs_access:"Accessories categories",
    new_heading:"New Arrivals", new_desc:"The newest pieces from Nila, added today.",
    promo_kicker:"New Collection", promo_heading:"Autumn · Winter 2026",
    promo_desc:"Warm layers, clean cuts, a neutral palette. A collection for a season that's already begun.",
    promo_cta:"View Collection",
    best_heading:"Nila Bestsellers", best_desc:"The ones that get reordered the most.",
    best_viewall:"View All",
    badge_new:"New", badge_bestseller:"Bestseller", quickadd:"Add to Bag",
    nl_heading:"Be the First to Know", nl_desc:"News of new arrivals and special offers, before anyone else, just for subscribers.",
    nl_placeholder:"Your email", nl_note:"No spam. Unsubscribe anytime.",
    nl_success:"You're subscribed — welcome to Nila.",
    footer_tagline:"Online store for women's, men's, and accessory fashion with quality you can feel.",
    footer_shop_h:"Shop", footer_brand_h:"Nila", footer_support_h:"Support", footer_social_h:"Follow Us",
    footer_about:"About Us", footer_collab:"Work With Us", footer_wholesale:"Wholesale",
    footer_contact:"Contact Us", footer_shipping:"Shipping & Returns", footer_sizeguide:"Size Guide",
    footer_instagram:"Instagram", footer_telegram:"Telegram", footer_pinterest:"Pinterest",
    footer_copyright:"© 2026 Nila — All rights reserved.", footer_madein:"Designed in Tehran",
    cart_heading:"Shopping Cart", cart_subtotal:"Subtotal", cart_total:"Total",
    cart_checkout:"Proceed to Checkout", cart_note:"Free shipping on orders over 2,000,000 Toman",
    cart_empty_msg:"Your cart is empty. Haven't found anything to keep yet?",
    cart_empty_link:"View New Arrivals", cart_remove:"Remove",
    search_placeholder:"Search for products, colors, or categories…",
    toast_added_cart:'"{name}" added to your bag.', toast_added_wish:'"{name}" added to your wishlist.',
    toast_wish_empty:"Your wishlist is empty.", toast_wish_view:"Sign in to view your full wishlist.",
    toast_account:"Sign in to view your account.",
    toast_checkout_demo:"This is a design demo — checkout isn't implemented.",
    toast_generic_demo:"This section hasn't been built in the current demo.", toast_newsletter:"You've successfully subscribed.",
    mm_wishlist:"Wishlist", mm_account:"Account",
    aria_auth_close:"Close account window",
    auth_tab_login:"Log In", auth_tab_signup:"Sign Up",
    auth_title_login:"Log In to Your Account", auth_title_signup:"Create an Account",
    form_password:"Password",
    auth_cta_login:"Log In", auth_cta_signup:"Create Account",
    auth_switch_to_signup:"Don't have an account? Sign up", auth_switch_to_login:"Already have an account? Log in",
    auth_err_fill:"Please fill in all fields.", auth_err_email:"Enter a valid email address.",
    auth_err_password_len:"Password must be at least 6 characters.",
    auth_err_exists:"This email is already registered — log in instead.",
    auth_err_invalid:"Incorrect email or password.",
    auth_success_signup:"Welcome, {name}! Your account has been created.",
    auth_success_login:"Welcome back, {name}!", auth_logout_success:"You've been logged out.",
    auth_title_account:"My Account", auth_signed_in_as:"Signed in as", auth_logout:"Log Out",
    auth_demo_note:"This is a design demo — your info is stored only in this browser.",
    qty_decrease:"Decrease quantity", qty_increase:"Increase quantity",
    grid_empty:"No products in this category yet — check back soon.",
    form_name:"Full Name", form_email:"Email", form_phone:"Phone Number",
    form_message:"Message", form_other:"Other",
    about_eyebrow:"About Nila", about_h1:"A story that started with a thread",
    about_lead:"Nila was born in a small workshop in Tehran, where every garment is still designed, dyed, and sewn with care.",
    about_quote:"Clothing is a vessel of memories. We sew it for years, not for a season.",
    about_body1:"Nila took shape in 2023 around a simple idea: clothing that's both comfortable for everyday life and carries the elegance of a real brand. From day one, we chose to focus on quality and detail instead of mass production.",
    about_body2:"Today, our small team still follows that same philosophy: careful fabric selection, hand stitching, and individual inspection of every product before it reaches you.",
    about_values_h:"Our Values", about_values_desc:"What shapes every decision we make.",
    about_val1_t:"Uncompromising Quality", about_val1_d:"Every fabric is checked for durability and feel before it's ever sewn.",
    about_val2_t:"Handmade Stitching", about_val2_d:"Each piece, from cutting to final stitch, is done under our tailors' direct care.",
    about_val3_t:"Limited Production", about_val3_d:"Every style is made in limited quantities so quality is never sacrificed for volume.",
    about_val4_t:"Nationwide Delivery", about_val4_d:"Shipping across the country, with simple, recyclable packaging.",
    about_stat1_n:"2023", about_stat1_l:"Workshop Founded",
    about_stat2_n:"6", about_stat2_l:"Full-Time Team Members",
    about_stat3_n:"5000+", about_stat3_l:"Happy Customers",
    about_stat4_n:"16+", about_stat4_l:"Active Products",
    about_cta:"View Collection",
    collab_eyebrow:"Work With Nila", collab_h1:"Let's Work Together",
    collab_lead:"If your brand, page, or store aligns with Nila's philosophy, we'd love to get to know you.",
    collab_c1_t:"Retail Partners", collab_c1_d:"If you have a store and are interested in carrying Nila alongside other brands, fill out the form below.",
    collab_c2_t:"Influencers & Creators", collab_c2_d:"For collaborations promoting Nila's collections online and on social media.",
    collab_c3_t:"Press & Media", collab_c3_d:"For interview requests, high-resolution photos, or brand press information.",
    collab_form_h:"Collaboration Request Form", collab_form_desc:"We respond within 3–5 business days.",
    collab_form_type:"Collaboration Type", collab_form_submit:"Submit Request",
    wholesale_eyebrow:"Wholesale", wholesale_h1:"Carry Nila in Your Store",
    wholesale_lead:"For stores and businesses looking to carry the Nila collection at a larger scale.",
    wholesale_terms_h:"Terms of Partnership",
    wholesale_b1_t:"Minimum Order", wholesale_b1_d:"The minimum wholesale order is 20 pieces per style and color.",
    wholesale_b2_t:"Tiered Pricing", wholesale_b2_d:"The larger the order volume, the higher the wholesale discount.",
    wholesale_b3_t:"Lead Time", wholesale_b3_d:"Wholesale orders are typically prepared and shipped within 10–14 business days.",
    wholesale_b4_t:"Dedicated Support", wholesale_b4_d:"A wholesale account manager is with you from order to delivery.",
    wholesale_form_h:"Wholesale Partnership Request", wholesale_form_desc:"We respond within 3–5 business days.",
    wholesale_form_business:"Business Name", wholesale_form_volume:"Estimated Order Volume",
    wholesale_vol1:"20–50 pieces", wholesale_vol2:"50–200 pieces", wholesale_vol3:"More than 200 pieces",
    wholesale_form_submit:"Submit Request",
    size_eyebrow:"Size Guide", size_h1:"Find Your Right Size",
    size_lead:"Compare your own measurements with the chart below for the most accurate fit.",
    size_how_h:"How to Measure",
    size_step1_t:"Bust / Chest", size_step1_d:"Wrap the tape horizontally around the fullest part of your chest, without pulling tight.",
    size_step2_t:"Waist", size_step2_d:"Measure the narrowest part of your waist, just above the belly button.",
    size_step3_t:"Hips", size_step3_d:"Wrap the tape horizontally around the fullest part of your hips.",
    size_women_h:"Women's Size Chart", size_unit:"All measurements are in centimeters.",
    size_col_size:"Size", size_col_bust:"Bust", size_col_waist:"Waist", size_col_hip:"Hip",
    size_men_h:"Men's Size Chart", size_col_chest:"Chest", size_col_inseam:"Inseam",
    size_note:"If you're between two sizes, we generally recommend sizing up.",
    toast_collab_success:"Your request has been submitted — we'll be in touch soon.",
    toast_wholesale_success:"Request submitted — our wholesale team will reach out soon.",
  }
};
function t(key){ return (I18N[currentLang] && I18N[currentLang][key]) ?? key; }
function tf(key, vars){ let s = t(key); for(const k in vars) s = s.replace('{'+k+'}', vars[k]); return s; }

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
function toFaDigits(str){ return str.replace(/[0-9]/g, d => FA_DIGITS[+d]); }
function toEnDigits(str){ return str.replace(/[۰-۹]/g, d => String(FA_DIGITS.indexOf(d))); }

/* ============================================================
   Product data — centralized, image-based (no SVG artwork)
   Drop real files at these paths; the placeholder disappears
   automatically the moment a real image loads successfully.
   ============================================================ */
const PRODUCTS = [
  { id:1, name:{fa:"کتِ بلندِ خاکستری", en:"Long Grey Coat"},
    category:{fa:"مانتو و کت · زنانه", en:"Coats · Women"}, price:4980000,
    image:"assets/products/product-01.jpg", hoverImage:null,
    badge:"new", dept:"women", tab:"coat", colors:[
      {hex:"#232323", fa:"مشکی", en:"Black"},
      {hex:"#8A8676", fa:"خاکی", en:"Khaki"},
      {hex:"#43454C", fa:"دودی", en:"Smoke"} ] },
  { id:2, name:{fa:"پیراهنِ کتانِ کرم", en:"Cream Linen Shirt"},
    category:{fa:"پیراهن · مردانه", en:"Shirts · Men"}, price:1850000,
    image:"assets/products/product-02.jpg", hoverImage:null,
    badge:"new", dept:"men", tab:"clothing", colors:[
      {hex:"#DDD3BE", fa:"کرم", en:"Cream"},
      {hex:"#F2F0EC", fa:"سفید", en:"White"},
      {hex:"#9DAAC2", fa:"آبی روشن", en:"Light Blue"} ] },
  { id:3, name:{fa:"شلوارِ پشمیِ راسته", en:"Straight Wool Trousers"},
    category:{fa:"شلوار · مردانه", en:"Trousers · Men"}, price:2350000,
    image:"assets/products/product-03.jpg", hoverImage:null,
    badge:null, dept:"men", tab:"apparel", colors:[
      {hex:"#232323", fa:"مشکی", en:"Black"},
      {hex:"#4B4E5A", fa:"دودی", en:"Charcoal"},
      {hex:"#5C5A55", fa:"خاکستری", en:"Grey"} ] },
  { id:4, name:{fa:"تی‌شرتِ یقه‌گرد", en:"Crew Neck T-Shirt"},
    category:{fa:"تی‌شرت · یونیسکس", en:"T-Shirts · Unisex"}, price:980000,
    image:"assets/products/product-04.jpg", hoverImage:null,
    badge:"new", dept:"unisex", tab:"clothing", colors:[
      {hex:"#232323", fa:"مشکی", en:"Black"},
      {hex:"#F2F0EC", fa:"سفید", en:"White"},
      {hex:"#6E2A3A", fa:"زرشکی", en:"Burgundy"} ] },
  { id:5, name:{fa:"ژاکتِ بافتِ باز", en:"Open Knit Cardigan"},
    category:{fa:"ژاکت · زنانه", en:"Knitwear · Women"}, price:2750000,
    image:"assets/products/product-05.jpg", hoverImage:null,
    badge:"bestseller", dept:"women", tab:"clothing", colors:[
      {hex:"#8A8676", fa:"خاکی", en:"Khaki"},
      {hex:"#DDD3BE", fa:"کرم", en:"Cream"},
      {hex:"#4B4E5A", fa:"دودی", en:"Charcoal"} ] },
  { id:6, name:{fa:"دامنِ میدیِ کتان", en:"Linen Midi Skirt"},
    category:{fa:"دامن · زنانه", en:"Skirts · Women"}, price:1950000,
    image:"assets/products/product-06.jpg", hoverImage:null,
    badge:"new", dept:"women", tab:"clothing", colors:[
      {hex:"#7A6E5D", fa:"قهوه‌ای روشن", en:"Taupe"},
      {hex:"#232323", fa:"مشکی", en:"Black"} ] },
  { id:7, name:{fa:"کیفِ چرمِ دستی", en:"Handmade Leather Bag"},
    category:{fa:"اکسسوری", en:"Accessories"}, price:3450000,
    image:"assets/products/product-07.jpg", hoverImage:null,
    badge:"bestseller", dept:"unisex", tab:"bag", colors:[
      {hex:"#7A5230", fa:"عسلی", en:"Honey"},
      {hex:"#232323", fa:"مشکی", en:"Black"} ] },
  { id:8, name:{fa:"شالِ گردنِ پشمی", en:"Wool Scarf"},
    category:{fa:"اکسسوری", en:"Accessories"}, price:1250000,
    image:"assets/products/product-08.jpg", hoverImage:null,
    badge:null, dept:"unisex", tab:"jewelry", colors:[
      {hex:"#2E3B63", fa:"سرمه‌ای", en:"Navy"},
      {hex:"#5C5A55", fa:"خاکستری", en:"Grey"} ] },
  { id:9, name:{fa:"پالتوی پشمیِ کرم", en:"Cream Wool Overcoat"},
    category:{fa:"مانتو و کت · زنانه", en:"Coats · Women"}, price:5250000,
    image:"assets/products/product-09.jpg", hoverImage:null,
    badge:"new", dept:"women", tab:"coat", colors:[
      {hex:"#DDD3BE", fa:"کرم", en:"Cream"},
      {hex:"#232323", fa:"مشکی", en:"Black"} ] },
  { id:10, name:{fa:"دامنِ پلیسهٔ بلند", en:"Long Pleated Skirt"},
    category:{fa:"دامن · زنانه", en:"Skirts · Women"}, price:2150000,
    image:"assets/products/product-10.jpg", hoverImage:null,
    badge:null, dept:"women", tab:"clothing", colors:[
      {hex:"#5C5A55", fa:"خاکستری", en:"Grey"},
      {hex:"#7A6E5D", fa:"قهوه‌ای روشن", en:"Taupe"} ] },
  { id:11, name:{fa:"تی‌شرتِ یقه‌اسکیِ مشکی", en:"Black Turtleneck"},
    category:{fa:"تی‌شرت · مردانه", en:"Knitwear · Men"}, price:1150000,
    image:"assets/products/product-11.jpg", hoverImage:null,
    badge:"new", dept:"men", tab:"clothing", colors:[
      {hex:"#232323", fa:"مشکی", en:"Black"},
      {hex:"#4B4E5A", fa:"دودی", en:"Charcoal"} ] },
  { id:12, name:{fa:"شلوارِ جینِ راستهٔ آبی", en:"Straight Blue Jeans"},
    category:{fa:"شلوار · مردانه", en:"Trousers · Men"}, price:1950000,
    image:"assets/products/product-12.jpg", hoverImage:null,
    badge:null, dept:"men", tab:"apparel", colors:[
      {hex:"#3A4A63", fa:"آبی", en:"Blue"},
      {hex:"#232323", fa:"مشکی", en:"Black"} ] },
  { id:13, name:{fa:"اسنیکرِ چرمِ سفید", en:"White Leather Sneakers"},
    category:{fa:"کفش · مردانه", en:"Shoes · Men"}, price:2890000,
    image:"assets/products/product-13.jpg", hoverImage:null,
    badge:"new", dept:"men", tab:"shoes", colors:[
      {hex:"#F2F0EC", fa:"سفید", en:"White"},
      {hex:"#232323", fa:"مشکی", en:"Black"} ] },
  { id:14, name:{fa:"چکمهٔ چرمِ ساقه‌کوتاه", en:"Leather Chelsea Boots"},
    category:{fa:"کفش · مردانه", en:"Shoes · Men"}, price:3650000,
    image:"assets/products/product-14.jpg", hoverImage:null,
    badge:"bestseller", dept:"men", tab:"shoes", colors:[
      {hex:"#7A5230", fa:"عسلی", en:"Honey"},
      {hex:"#232323", fa:"مشکی", en:"Black"} ] },
  { id:15, name:{fa:"ساعتِ مچیِ کلاسیک", en:"Classic Wristwatch"},
    category:{fa:"اکسسوری", en:"Accessories"}, price:4200000,
    description:{
      fa:"طراحیِ کلاسیک، محصولِ اختصاصیِ نیلا — مستقل و بدون وابستگی به هیچ برندِ ساعت‌سازیِ دیگر.",
      en:"Classic design, exclusively by Nila — independent, not affiliated with any other watch brand."},
    image:"assets/products/product-15.jpg", hoverImage:null,
    badge:"new", dept:"unisex", tab:"watch", colors:[
      {hex:"#7A5230", fa:"قهوه‌ای", en:"Brown"},
      {hex:"#232323", fa:"مشکی", en:"Black"} ] },
  { id:16, name:{fa:"عینکِ آفتابیِ کلاسیک", en:"Classic Sunglasses"},
    category:{fa:"اکسسوری", en:"Accessories"}, price:1890000,
    image:"assets/products/product-16.jpg", hoverImage:null,
    badge:null, dept:"unisex", tab:"glasses", colors:[
      {hex:"#232323", fa:"مشکی", en:"Black"},
      {hex:"#7A6E5D", fa:"قهوه‌ای روشن", en:"Taupe"} ] },
];

const fmtPrice = n => currentLang === 'en'
  ? n.toLocaleString('en-US') + ' Toman'
  : n.toLocaleString('fa-IR') + ' تومان';
const $  = (s,el=document) => el.querySelector(s);
const $$ = (s,el=document) => Array.from(el.querySelectorAll(s));

let CART = storeGet('cart', []);
let WISH = new Set(storeGet('wish', []));

/* ============================================================
   Image fallback — graceful, layout-safe
   ============================================================ */
function bindImgFallback(img){
  img.addEventListener('error', function handler(){
    img.removeEventListener('error', handler);
    img.style.display = 'none';
    const slot = img.closest('.img-slot');
    if(slot) slot.classList.add('img-fallback');
  });
}
$$('.img-slot img').forEach(bindImgFallback);

/* ============================================================
   Product card factory — language-aware, with real color selection
   ============================================================ */
function productCard(p, railMode){
  const el = document.createElement('div');
  el.className = 'product-card' + (railMode ? ' rail-card' : '');
  el.dataset.id = p.id;
  el.dataset.colorIndex = '0';
  const name = p.name[currentLang];
  const category = p.category[currentLang];
  const badgeLabel = p.badge ? t(p.badge === 'bestseller' ? 'badge_bestseller' : 'badge_new') : '';
  el.innerHTML = `
    <div class="product-figure">
      ${p.badge ? `<span class="pf-badge${p.badge==='bestseller'?' sale':''}">${badgeLabel}</span>` : ''}
      <button class="pf-wish" data-id="${p.id}" aria-label="${t('aria_wishlist_add')}">
        <svg viewBox="0 0 24 24"><use href="#ic-heart"/></svg>
      </button>
      <div class="pf-image-clip">
        <div class="img-slot img-primary" data-fallback-label="${p.image}">
          <svg class="fallback-mark" viewBox="0 0 24 24"><use href="#ic-image"/></svg>
          <img src="${p.image}" alt="${name}" loading="lazy">
        </div>
        ${p.hoverImage ? `
        <div class="img-slot img-hover" data-fallback-label="${p.hoverImage}">
          <svg class="fallback-mark" viewBox="0 0 24 24"><use href="#ic-image"/></svg>
          <img src="${p.hoverImage}" alt="${name}" loading="lazy">
        </div>` : ''}
      </div>
      <div class="pf-quickadd">
        <button class="js-quickadd" data-id="${p.id}">
          <svg viewBox="0 0 24 24"><use href="#ic-plus"/></svg>
          ${t('quickadd')}
        </button>
      </div>
    </div>
    <div class="product-swatches" role="group" aria-label="${t('aria_colors')}">
      ${p.colors.map((c,i)=>`<button type="button" class="swatch ${i===0?'on':''}" data-idx="${i}" style="background:${c.hex}" aria-label="${c[currentLang]}" aria-pressed="${i===0}" title="${c[currentLang]}"></button>`).join('')}
      <span class="swatch-label">${p.colors[0][currentLang]}</span>
    </div>
    <div class="product-info">
      <div>
        <h3>${name}</h3>
        <div class="cat">${category}</div>
        ${p.description ? `<p class="pf-desc">${p.description[currentLang]}</p>` : ''}
      </div>
      <div class="product-price">${fmtPrice(p.price)}</div>
    </div>
  `;
  $$('.img-slot img', el).forEach(bindImgFallback);
  $$('.swatch', el).forEach(s => s.addEventListener('click', ()=>{
    $$('.swatch', el).forEach(x=>{ x.classList.remove('on'); x.setAttribute('aria-pressed','false'); });
    s.classList.add('on');
    s.setAttribute('aria-pressed','true');
    const idx = Number(s.dataset.idx);
    el.dataset.colorIndex = idx;
    $('.swatch-label', el).textContent = p.colors[idx][currentLang];
  }));
  return el;
}

function renderProductGrids(){
  // homepage-only sections — guarded since this shared script now
  // runs on every page, and only index.html has these elements
  const rail = $('#rail-new');
  const grid = $('#bs-grid');
  if(rail){
    rail.innerHTML = '';
    PRODUCTS.filter(p=>p.badge==='new').concat(PRODUCTS.filter(p=>p.badge!=='new').slice(0,2))
      .forEach(p => rail.appendChild(productCard(p, true)));
  }
  if(grid){
    grid.innerHTML = '';
    [PRODUCTS[2],PRODUCTS[13],PRODUCTS[6],PRODUCTS[14],PRODUCTS[0],PRODUCTS[8],PRODUCTS[12],PRODUCTS[4]]
      .forEach(p => grid.appendChild(productCard(p, false)));
  }
}

/* ============================================================
   Category page product grid — filters PRODUCTS by department
   and by whichever tab is active in that page's spotlight hero.
   Each tab's i18n key doubles as its filter identity, since it's
   already unique per page (e.g. "wa_tab_bag" only exists on the
   accessories page) — no separate taxonomy needed.
   ============================================================ */
const TAB_FILTERS = {
  ws_tab_clothing: p => (p.dept==='women'||p.dept==='unisex') && p.tab==='clothing',
  ws_tab_coat:     p => p.dept==='women' && p.tab==='coat',
  ws_tab_access:   p => p.dept==='unisex' && ['bag','watch','glasses','jewelry'].includes(p.tab),
  wm_tab_clothing: p => (p.dept==='men'||p.dept==='unisex') && p.tab==='clothing',
  wm_tab_apparel:  p => p.dept==='men' && p.tab==='apparel',
  wm_tab_shoes:    p => p.tab==='shoes',
  wa_tab_watch:    p => p.tab==='watch',
  wa_tab_glasses:  p => p.tab==='glasses',
  wa_tab_bag:      p => p.tab==='bag',
  wa_tab_jewelry:  p => p.tab==='jewelry',
};
function renderCategoryGrid(){
  const grid = $('#category-grid');
  if(!grid) return;
  const activeTab = $('.ws-tabs .ws-tab.active');
  const filterKey = activeTab ? activeTab.dataset.i18n : null;
  const filterFn = TAB_FILTERS[filterKey];
  const items = filterFn ? PRODUCTS.filter(filterFn) : [];
  grid.innerHTML = '';
  if(items.length === 0){
    grid.innerHTML = `<p class="grid-empty">${t('grid_empty')}</p>`;
    return;
  }
  items.forEach(p => grid.appendChild(productCard(p, false)));
}

/* ============================================================
   Toast
   ============================================================ */
const toastContainer = $('#toast-container');
function toast(msg){
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<svg viewBox="0 0 24 24"><use href="#ic-check"/></svg><span>${msg}</span>`;
  toastContainer.appendChild(el);
  setTimeout(()=>{ el.classList.add('out'); setTimeout(()=>el.remove(), 260); }, 2600);
}
$$('.js-toast-link').forEach(a=>a.addEventListener('click', e=>{
  e.preventDefault(); toast(t('toast_generic_demo'));
}));

/* ============================================================
   Account / login panel — front-end-only demo auth. There's no
   server here, so "accounts" are just a users list kept in this
   browser's localStorage; good enough to demo the real flow
   (sign up, log in, stay signed in across pages, log out) without
   pretending it's production-grade security.
   ============================================================ */
let USERS = storeGet('users', []);       // [{name, email, password}]
let SESSION = storeGet('session', null); // {name, email} | null
let authMode = 'login';

document.body.insertAdjacentHTML('beforeend', `
<div id="auth-overlay" class="auth-overlay">
  <div class="auth-panel" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
    <button class="auth-close" id="auth-close" data-i18n-aria="aria_auth_close" aria-label="Close">
      <svg viewBox="0 0 24 24"><use href="#ic-close"/></svg>
    </button>
    <h2 class="auth-title" id="auth-modal-title"></h2>

    <div class="auth-tabs" id="auth-tabs">
      <button type="button" class="auth-tab active" id="auth-tab-login" data-i18n="auth_tab_login"></button>
      <button type="button" class="auth-tab" id="auth-tab-signup" data-i18n="auth_tab_signup"></button>
    </div>

    <form id="auth-login-form" class="auth-form active" novalidate>
      <div class="form-field">
        <label for="auth-login-email" data-i18n="form_email"></label>
        <input type="email" id="auth-login-email" autocomplete="email">
      </div>
      <div class="form-field">
        <label for="auth-login-password" data-i18n="form_password"></label>
        <input type="password" id="auth-login-password" autocomplete="current-password">
      </div>
      <p class="auth-error" id="auth-login-error"></p>
      <button type="submit" class="btn btn-dark" data-i18n="auth_cta_login"></button>
      <p class="auth-switch"><button type="button" class="text-link" id="auth-goto-signup" data-i18n="auth_switch_to_signup"></button></p>
    </form>

    <form id="auth-signup-form" class="auth-form" novalidate>
      <div class="form-field">
        <label for="auth-signup-name" data-i18n="form_name"></label>
        <input type="text" id="auth-signup-name" autocomplete="name">
      </div>
      <div class="form-field">
        <label for="auth-signup-email" data-i18n="form_email"></label>
        <input type="email" id="auth-signup-email" autocomplete="email">
      </div>
      <div class="form-field">
        <label for="auth-signup-password" data-i18n="form_password"></label>
        <input type="password" id="auth-signup-password" autocomplete="new-password">
      </div>
      <p class="auth-error" id="auth-signup-error"></p>
      <button type="submit" class="btn btn-dark" data-i18n="auth_cta_signup"></button>
      <p class="auth-switch"><button type="button" class="text-link" id="auth-goto-login" data-i18n="auth_switch_to_login"></button></p>
    </form>

    <div class="auth-account-view" id="auth-account-view">
      <div class="auth-avatar" id="auth-avatar"></div>
      <div class="auth-account-name" id="auth-account-name"></div>
      <div class="auth-account-email" id="auth-account-email"></div>
      <button type="button" class="btn btn-outline" id="auth-logout-btn" data-i18n="auth_logout"></button>
    </div>

    <p class="auth-demo-note" id="auth-demo-note" data-i18n="auth_demo_note"></p>
  </div>
</div>`);

const authOverlayEl = $('#auth-overlay');
$('#account-btn').insertAdjacentHTML('beforeend', '<span class="badge" id="account-badge" style="display:none"></span>');
const mmAccountBtn = $('#mm-account');
if(mmAccountBtn) mmAccountBtn.insertAdjacentHTML('beforeend', '<span class="mm-account-name" id="mm-account-name"></span>');

function initials(name){ return (name || '').trim().charAt(0).toUpperCase() || '?'; }

function clearAuthErrors(){
  $$('.auth-error').forEach(el=>{ el.textContent=''; el.classList.remove('show'); });
}
function showAuthError(which, msg){
  const el = $('#auth-'+which+'-error');
  el.textContent = msg; el.classList.add('show');
}
function setAuthTitle(){
  const el = $('#auth-modal-title');
  el.textContent = SESSION ? t('auth_title_account') : t(authMode==='signup' ? 'auth_title_signup' : 'auth_title_login');
}
function switchAuthTab(mode){
  authMode = mode;
  $('#auth-tab-login').classList.toggle('active', mode==='login');
  $('#auth-tab-signup').classList.toggle('active', mode==='signup');
  $('#auth-login-form').classList.toggle('active', mode==='login');
  $('#auth-signup-form').classList.toggle('active', mode==='signup');
  clearAuthErrors();
  setAuthTitle();
}
function renderAuthUI(){
  const badge = $('#account-badge');
  const mmName = $('#mm-account-name');
  if(SESSION){
    $('#auth-tabs').style.display = 'none';
    $('#auth-login-form').classList.remove('active');
    $('#auth-signup-form').classList.remove('active');
    $('#auth-account-view').classList.add('active');
    $('#auth-account-name').textContent = SESSION.name;
    $('#auth-account-email').textContent = SESSION.email;
    $('#auth-avatar').textContent = initials(SESSION.name);
    badge.style.display = 'flex'; badge.textContent = initials(SESSION.name);
    if(mmName) mmName.textContent = SESSION.name;
  } else {
    $('#auth-tabs').style.display = 'flex';
    $('#auth-account-view').classList.remove('active');
    switchAuthTab(authMode);
    badge.style.display = 'none';
    if(mmName) mmName.textContent = '';
  }
  setAuthTitle();
}
function openAuth(mode){
  closeMobileMenu();
  if(!SESSION) switchAuthTab(mode || authMode);
  renderAuthUI();
  authOverlayEl.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(()=>{
    if(SESSION) return;
    const input = $('.auth-form.active input');
    if(input) input.focus();
  }, 260);
}
function closeAuth(){
  authOverlayEl.classList.remove('open');
  document.body.style.overflow = '';
}
$('#account-btn').addEventListener('click', ()=> openAuth('login'));
$('#mm-account').addEventListener('click', ()=> openAuth('login'));
$('#auth-close').addEventListener('click', closeAuth);
authOverlayEl.addEventListener('click', e=>{ if(e.target===authOverlayEl) closeAuth(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && authOverlayEl.classList.contains('open')) closeAuth(); });
$('#auth-tab-login').addEventListener('click', ()=> switchAuthTab('login'));
$('#auth-tab-signup').addEventListener('click', ()=> switchAuthTab('signup'));
$('#auth-goto-signup').addEventListener('click', ()=> switchAuthTab('signup'));
$('#auth-goto-login').addEventListener('click', ()=> switchAuthTab('login'));

$('#auth-login-form').addEventListener('submit', e=>{
  e.preventDefault();
  clearAuthErrors();
  const email = $('#auth-login-email').value.trim().toLowerCase();
  const password = $('#auth-login-password').value;
  if(!email || !password){ showAuthError('login', t('auth_err_fill')); return; }
  const user = USERS.find(u=> u.email.toLowerCase()===email && u.password===password);
  if(!user){ showAuthError('login', t('auth_err_invalid')); return; }
  SESSION = {name:user.name, email:user.email};
  storeSet('session', SESSION);
  $('#auth-login-form').reset();
  renderAuthUI();
  toast(tf('auth_success_login', {name:user.name}));
  closeAuth();
});
$('#auth-signup-form').addEventListener('submit', e=>{
  e.preventDefault();
  clearAuthErrors();
  const name = $('#auth-signup-name').value.trim();
  const email = $('#auth-signup-email').value.trim().toLowerCase();
  const password = $('#auth-signup-password').value;
  if(!name || !email || !password){ showAuthError('signup', t('auth_err_fill')); return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showAuthError('signup', t('auth_err_email')); return; }
  if(password.length < 6){ showAuthError('signup', t('auth_err_password_len')); return; }
  if(USERS.some(u=> u.email.toLowerCase()===email)){ showAuthError('signup', t('auth_err_exists')); return; }
  USERS.push({name, email, password});
  storeSet('users', USERS);
  SESSION = {name, email};
  storeSet('session', SESSION);
  $('#auth-signup-form').reset();
  renderAuthUI();
  toast(tf('auth_success_signup', {name}));
  closeAuth();
});
$('#auth-logout-btn').addEventListener('click', ()=>{
  SESSION = null;
  storeSet('session', null);
  authMode = 'login';
  renderAuthUI();
  toast(t('auth_logout_success'));
  closeAuth();
});
renderAuthUI();

/* ============================================================
   Wishlist
   ============================================================ */
const wishCountEl = $('#wish-count');
function updateWishBadge(){
  wishCountEl.textContent = WISH.size;
  wishCountEl.dataset.count = WISH.size;
  wishCountEl.classList.remove('bump'); void wishCountEl.offsetWidth; wishCountEl.classList.add('bump');
}
document.addEventListener('click', e=>{
  const btn = e.target.closest('.pf-wish');
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const p = PRODUCTS.find(x=>x.id===id);
  const isNowActive = !WISH.has(id);
  if(isNowActive){ WISH.add(id); toast(tf('toast_added_wish', {name: p.name[currentLang]})); }
  else WISH.delete(id);
  $$(`.pf-wish[data-id="${id}"]`).forEach(b=>{
    b.classList.toggle('active', isNowActive);
    b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
  });
  storeSet('wish', [...WISH]);
  updateWishBadge();
});
$('#wish-btn').addEventListener('click', ()=>{
  toast(WISH.size===0 ? t('toast_wish_empty') : t('toast_wish_view'));
});
$('#mm-wish').addEventListener('click', ()=>{
  closeMobileMenu();
  toast(WISH.size===0 ? t('toast_wish_empty') : t('toast_wish_view'));
});

/* ============================================================
   Cart
   ============================================================ */
const cartItemsEl = $('#cart-items');
const cartCountEl = $('#cart-count');
const cartDrawer = $('#cart-drawer');
const cartOverlay = $('#cart-overlay');

function addToCart(id, colorIdx, qty=1){
  const line = CART.find(c=>c.id===id && c.colorIdx===colorIdx);
  if(line) line.qty += qty; else CART.push({id, colorIdx, qty});
  renderCart(); openCart();
  const p = PRODUCTS.find(x=>x.id===id);
  toast(tf('toast_added_cart', {name: p.name[currentLang]}));
}
function removeFromCart(id, colorIdx){
  const row = cartItemsEl.querySelector(`[data-row="${id}-${colorIdx}"]`);
  if(!row) return;
  row.classList.add('removing');
  setTimeout(()=>{ CART = CART.filter(c=>!(c.id===id && c.colorIdx===colorIdx)); renderCart(); }, 240);
}
function setQty(id, colorIdx, qty){
  const line = CART.find(c=>c.id===id && c.colorIdx===colorIdx);
  if(!line) return;
  line.qty = Math.max(1, Math.min(9, qty));
  renderCart();
}
function cartTotals(){
  let sub=0, count=0;
  CART.forEach(c=>{
    const p = PRODUCTS.find(x=>x.id===c.id);
    if(p){ sub += p.price*c.qty; count += c.qty; }
  });
  return {sub, count};
}
function renderCart(){
  storeSet('cart', CART);
  const {sub, count} = cartTotals();
  cartCountEl.textContent = count; cartCountEl.dataset.count = count;
  cartCountEl.classList.remove('bump'); void cartCountEl.offsetWidth; cartCountEl.classList.add('bump');

  if(CART.length === 0){
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24"><use href="#ic-bag"/></svg>
        <p>${t('cart_empty_msg')}</p>
        <a href="index.html#new-arrivals" class="text-link" id="cart-empty-link">${t('cart_empty_link')}</a>
      </div>`;
    $('#cart-empty-link').addEventListener('click', closeCart);
    $('#cart-foot').style.display = 'none';
    return;
  }
  $('#cart-foot').style.display = 'block';
  cartItemsEl.innerHTML = CART.map(c=>{
    const p = PRODUCTS.find(x=>x.id===c.id);
    const color = p.colors[c.colorIdx] || p.colors[0];
    return `
    <div class="cart-item" data-row="${p.id}-${c.colorIdx}">
      <div class="ci-figure">
        <div class="img-slot" data-fallback-label="${p.image}">
          <svg class="fallback-mark" viewBox="0 0 24 24" width="20" height="20"><use href="#ic-image"/></svg>
          <img src="${p.image}" alt="${p.name[currentLang]}" loading="lazy">
        </div>
      </div>
      <div class="ci-info">
        <div class="ci-top">
          <div>
            <h4>${p.name[currentLang]}</h4>
            <div class="ci-meta">${p.category[currentLang]} · <span class="ci-swatch" style="background:${color.hex}"></span> ${color[currentLang]}</div>
          </div>
          <div class="ci-price">${fmtPrice(p.price*c.qty)}</div>
        </div>
        <div class="ci-bottom">
          <div class="ci-qty">
            <button class="js-qty-down" data-id="${p.id}" data-color="${c.colorIdx}" aria-label="${t('qty_decrease')}">−</button>
            <span>${c.qty}</span>
            <button class="js-qty-up" data-id="${p.id}" data-color="${c.colorIdx}" aria-label="${t('qty_increase')}">+</button>
          </div>
          <button class="ci-remove js-remove" data-id="${p.id}" data-color="${c.colorIdx}">${t('cart_remove')}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  $$('.img-slot img', cartItemsEl).forEach(bindImgFallback);

  $('#cart-subtotal').textContent = fmtPrice(sub);
  $('#cart-total').textContent = fmtPrice(sub);
}
cartItemsEl.addEventListener('click', e=>{
  const up = e.target.closest('.js-qty-up');
  const down = e.target.closest('.js-qty-down');
  const rem = e.target.closest('.js-remove');
  if(up){ const id=Number(up.dataset.id), ci=Number(up.dataset.color); const l=CART.find(c=>c.id===id&&c.colorIdx===ci); setQty(id, ci, l.qty+1); }
  if(down){ const id=Number(down.dataset.id), ci=Number(down.dataset.color); const l=CART.find(c=>c.id===id&&c.colorIdx===ci); setQty(id, ci, l.qty-1); }
  if(rem){ removeFromCart(Number(rem.dataset.id), Number(rem.dataset.color)); }
});
function openCart(){ cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); document.body.style.overflow='hidden'; }
function closeCart(){ cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow=''; }
$('#cart-btn').addEventListener('click', openCart);
$('#cart-close').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
$('#checkout-btn').addEventListener('click', ()=> toast(t('toast_checkout_demo')));
document.addEventListener('click', e=>{
  const btn = e.target.closest('.js-quickadd');
  if(!btn) return;
  const card = btn.closest('.product-card');
  const colorIdx = card ? Number(card.dataset.colorIndex || 0) : 0;
  addToCart(Number(btn.dataset.id), colorIdx, 1);
});
renderCart();

/* ============================================================
   Header scroll state
   ============================================================ */
const header = $('#site-header');
function updateHeaderScroll(){
  const solid = window.scrollY > 40;
  header.classList.toggle('solid', solid);
  header.classList.toggle('on-dark', !solid);
}
window.addEventListener('scroll', updateHeaderScroll, {passive:true});
updateHeaderScroll();

/* ============================================================
   Mobile menu
   ============================================================ */
const menuToggle = $('#menu-toggle');
const mobileMenu = $('#mobile-menu');
function openMobileMenu(){
  mobileMenu.classList.add('open');
  menuToggle.classList.add('open');
  menuToggle.setAttribute('aria-expanded','true');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu(){
  mobileMenu.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}
menuToggle.addEventListener('click', ()=> mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu());
$('#mm-close').addEventListener('click', closeMobileMenu);
$$('#mobile-menu nav a').forEach(a=>a.addEventListener('click', closeMobileMenu));

/* ============================================================
   Search overlay
   ============================================================ */
const searchOverlay = $('#search-overlay');
function openSearch(){
  searchOverlay.classList.add('open');
  $('#search-toggle').setAttribute('aria-expanded','true');
  setTimeout(()=> $('#search-input').focus(), 260);
}
function closeSearch(){
  searchOverlay.classList.remove('open');
  $('#search-toggle').setAttribute('aria-expanded','false');
}
$('#search-toggle').addEventListener('click', ()=> searchOverlay.classList.contains('open') ? closeSearch() : openSearch());
$('#search-close').addEventListener('click', closeSearch);
searchOverlay.addEventListener('click', e=>{ if(e.target===searchOverlay) closeSearch(); });

document.addEventListener('keydown', e=>{
  if(e.key !== 'Escape') return;
  if(cartDrawer.classList.contains('open')) closeCart();
  else if(searchOverlay.classList.contains('open')) closeSearch();
  else if(mobileMenu.classList.contains('open')) closeMobileMenu();
});

/* ============================================================
   Theme toggle
   ============================================================ */
const root = document.documentElement;
function applyTheme(themeName){
  root.setAttribute('data-theme', themeName);
  $$('.theme-toggle button').forEach(b=> b.classList.toggle('active', b.dataset.theme===themeName));
  storeSet('theme', themeName);
}
applyTheme(storeGet('theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
$$('.theme-toggle button').forEach(b=> b.addEventListener('click', ()=> applyTheme(b.dataset.theme)));
$('#theme-toggle-nav').addEventListener('click', ()=>{
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   Language toggle — persists for the session (no reload occurs
   in this single-page site, so the choice naturally holds for
   as long as the page stays open)
   ============================================================ */
function applyLanguage(lang){
  currentLang = lang;
  storeSet('lang', lang);
  root.setAttribute('lang', lang);
  root.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');

  $$('[data-i18n]').forEach(el=>{ el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-placeholder]').forEach(el=>{ el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)); });
  $$('[data-i18n-aria]').forEach(el=>{ el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  $$('.i18n-num').forEach(el=>{ el.textContent = lang==='fa' ? toFaDigits(el.textContent) : toEnDigits(el.textContent); });

  const nextLabel = lang === 'fa' ? 'EN' : 'فا';
  $$('.lang-label').forEach(el=> el.textContent = nextLabel);
  $$('#lang-toggle, #mm-lang-toggle').forEach(el=> el.setAttribute('aria-label', t('aria_lang')));

  renderProductGrids();
  renderCategoryGrid();
  renderCart();
  renderAuthUI();
}
$('#lang-toggle').addEventListener('click', ()=> applyLanguage(currentLang === 'fa' ? 'en' : 'fa'));
$('#mm-lang-toggle').addEventListener('click', ()=> applyLanguage(currentLang === 'fa' ? 'en' : 'fa'));
applyLanguage(currentLang);

/* ============================================================
   New Arrivals rail — prev/next, native touch, mouse-drag
   ============================================================ */
function initRail(railEl, controlsEl){
  if(!controlsEl) return;
  const prev = controlsEl.querySelector('.prev');
  const next = controlsEl.querySelector('.next');
  function step(forward){
    const card = railEl.querySelector('.rail-card');
    const amount = card ? card.getBoundingClientRect().width + 16 : 300;
    // Modern browsers standardize RTL scrollLeft so 0 = start and values
    // go negative toward the end; LTR is the opposite (0 = start,
    // positive toward the end). Read the live direction so this keeps
    // working correctly after a language switch.
    const isRTL = document.documentElement.dir === 'rtl';
    const sign = forward ? (isRTL ? -1 : 1) : (isRTL ? 1 : -1);
    railEl.scrollBy({left: sign * amount, behavior:'smooth'});
  }
  prev.addEventListener('click', ()=> step(false));
  next.addEventListener('click', ()=> step(true));

  let isDown=false, startX=0, startScroll=0, moved=false;
  railEl.addEventListener('pointerdown', e=>{
    isDown=true; moved=false; startX=e.clientX; startScroll=railEl.scrollLeft;
  });
  window.addEventListener('pointermove', e=>{
    if(!isDown) return;
    const dx = e.clientX - startX;
    if(Math.abs(dx) > 4) moved = true;
    railEl.scrollLeft = startScroll - dx;
  });
  window.addEventListener('pointerup', ()=>{ isDown=false; });
  railEl.addEventListener('click', e=>{ if(moved){ e.preventDefault(); e.stopPropagation(); } }, true);
}
initRail($('#rail-new'), $('#rail-controls-new'));

/* ============================================================
   Women spotlight — category tabs (active state)
   ============================================================ */
$$('.ws-tabs .ws-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    const group = tab.closest('.ws-tabs');
    $$('.ws-tab', group).forEach(x=>{ x.classList.remove('active'); x.setAttribute('aria-selected','false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    renderCategoryGrid();
  });
});
renderCategoryGrid();

/* ============================================================
   Newsletter
   ============================================================ */
const nlForm = $('#nl-form');
if(nlForm){
  nlForm.addEventListener('submit', e=>{
    e.preventDefault();
    if(!$('#nl-email').value.trim()) return;
    $('#nl-note').style.display = 'none';
    $('#nl-success').classList.add('show');
    $('#nl-email').value = '';
    toast(t('toast_newsletter'));
  });
}

/* ============================================================
   Collaborate / Wholesale application forms — no backend here,
   so submitting just confirms receipt via toast (same pattern
   as the newsletter). Guarded since each form only exists on
   its own dedicated page.
   ============================================================ */
const collabForm = $('#collab-form');
if(collabForm){
  collabForm.addEventListener('submit', e=>{
    e.preventDefault();
    toast(t('toast_collab_success'));
    collabForm.reset();
  });
}
const wholesaleForm = $('#wholesale-form');
if(wholesaleForm){
  wholesaleForm.addEventListener('submit', e=>{
    e.preventDefault();
    toast(t('toast_wholesale_success'));
    wholesaleForm.reset();
  });
}

/* ============================================================
   Subtle scroll reveal — section headers only (premium, not showy)
   ============================================================ */
const io = new IntersectionObserver(entries=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
}, {threshold:0.15, rootMargin:'0px 0px -6% 0px'});
$$('.reveal').forEach(el=> io.observe(el));
// safety net: never let content stay permanently invisible if something
// prevents the observer from firing (e.g. an unusual viewport state)
setTimeout(()=> $$('.reveal:not(.in)').forEach(el=> el.classList.add('in')), 1500);

})();

/* Image lightbox — click any product image to view full-size */
(function(){
  const lb = document.createElement('div');
  lb.id = 'img-lightbox';
  lb.innerHTML = '<button class="lb-close" aria-label="بستن"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg></button><img src="" alt="">';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');
  function openLb(src, alt){ lbImg.src = src; lbImg.alt = alt||''; lb.classList.add('open'); }
  function closeLb(){ lb.classList.remove('open'); lbImg.src=''; }
  document.addEventListener('click', e=>{
    const img = e.target.closest('.pf-image-clip .img-slot img');
    if(img && img.src){ openLb(img.src, img.alt); }
  });
  lb.addEventListener('click', e=>{ if(e.target===lb || e.target.closest('.lb-close')) closeLb(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLb(); });
})();
