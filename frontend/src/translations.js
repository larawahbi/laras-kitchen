const t = {
  en: {
    nav_recipes: 'Recipes',
    nav_about: 'About',

    hero_eyebrow: 'A personal collection',
    hero_title_line1: 'Recipes from',
    hero_title_em: 'my kitchen',
    hero_sub: 'Family recipes, favourites found along the way, and everything in between — collected in one place.',
    hero_cta: 'Browse recipes',
    hero_stat_recipes: 'Recipes',
    hero_stat_cuisines: 'Cuisines',
    hero_stat_rated: 'All rated',

    filters_title: 'All Recipes',
    filters_count: 'recipes',
    filters_by_meal: 'By Meal',
    filters_by_cuisine: 'By Cuisine',
    filters_all: 'All',

    back: '← Back to Recipes',
    start_cooking: '🍳 Start Cooking',
    prep: 'Prep',
    cook: 'Cook',
    total: 'Total',
    serves: 'Serves',
    kcal: 'kcal',
    ingredients: 'Ingredients',
    method: 'Method',
    my_notes: 'My Notes',
    serve_with: 'Serve With',

    cook_back: 'Back',
    cook_progress_ingredients: 'Ingredients',
    cook_progress_done: 'Done!',
    cook_gather_title: 'Gather your ingredients',
    cook_gather_sub: "Check off each ingredient as you gather it. When you're ready, move on to the steps.",
    cook_start_btn: 'Start cooking →',
    cook_step_of: (i, total) => `Step ${i} of ${total}`,
    cook_prev: '← Previous',
    cook_next: 'Next step →',
    cook_all_done: '✓ All done',
    cook_timer_min: 'min',
    cook_timer_start: 'Start timer',
    cook_timer_stop: 'Stop',
    cook_done_title: 'Bon appétit!',
    cook_done_sub: 'Your dish is ready. Enjoy every bite.',
    cook_done_btn: 'Back to recipes',

    time_min: 'm',

    about_script: 'with love,',
    about_title: 'About This Kitchen',
    about_text: "This website is a living diary of the dishes that shape my world. Here, you will find a blend of treasured family recipes from my mom and grandma, inspiration gathered from my travels, and ideas shared by friends. I love experimenting in the kitchen—whether I am putting my own creative twist on modern TikTok and YouTube trends or discovering new flavors. \n As a Palestinian-Jordanian woman, my journey has taken me from the Middle East to Spain and the UK. Last year, I got married and moved to Australia, embarking on a beautiful new chapter. Living abroad, cooking became my way of bringing the taste of home with me. This space is a celebration of that adventure: recreating comforting heritage dishes, eagerly experimenting with fresh local ingredients, and embracing global flavors to create something uniquely delicious.",

    // PLACEHOLDER — replace with final teaser copy
    about_teaser_text: 'A small collection of dishes from my kitchen — Palestinian, Jordanian, Italian, and everything I have picked up along the way.',
    about_teaser_link: 'Read more',

    // PLACEHOLDER — replace with final section copy
    about_how_title: 'How I choose recipes',
    about_how_text: 'Placeholder — text about how recipes are chosen goes here.',
    about_bilingual_title: 'Why Arabic and English',
    about_bilingual_text: 'Placeholder — text about why the site is bilingual goes here.',
    about_contact_title: 'Get in touch',
    about_contact_text: 'Placeholder — contact information goes here.',

    price_est_cost: 'Est. Cost',
    price_pantry: 'From your kitchen',
    price_shop: 'Shop →',
    price_grocery_estimate: 'Grocery Estimate',
    price_total_est: 'Estimated Total',
    price_last_checked: 'Prices last checked',
    price_no_data: 'Price estimate unavailable',

    footer_made: 'Made with love in Adelaide',

    loading: 'Your recipe is on its way',
  },
  ar: {
    nav_recipes: 'الوصفات',
    nav_about: 'عنّي',

    hero_eyebrow: 'مجموعة شخصية',
    hero_title_line1: 'وصفات من',
    hero_title_em: 'مطبخي',
    hero_sub: 'وصفات عائلية ومفضلات وجدتها على الطريق — جمعتها كلها في مكان واحد.',
    hero_cta: 'تصفح الوصفات',
    hero_stat_recipes: 'وصفة',
    hero_stat_cuisines: 'نكهات عالمية',
    hero_stat_rated: 'تم تقييمها جميعاً',

    filters_title: 'كل الوصفات',
    filters_count: 'وصفة',
    filters_by_meal: 'حسب نوع الوجبة',
    filters_by_cuisine: 'حسب المطبخ',
    filters_all: 'الكل',

    back: 'عودة للوصفات',
    start_cooking: '🍳 ابدأ الطبخ',
    prep: 'التحضير',
    cook: 'الطبخ',
    total: 'الوقت الإجمالي',
    serves: 'أشخاص',
    kcal: 'سعرة حرارية',
    ingredients: 'المقادير',
    method: 'طريقة التحضير',
    my_notes: 'ملاحظاتي',
    serve_with: 'يُقدَّم مع',

    cook_back: 'رجوع',
    cook_progress_ingredients: 'المقادير',
    cook_progress_done: 'انتهينا!',
    cook_gather_title: 'جهّز المكونات',
    cook_gather_sub:'لنبدأ أولاً بتجهيز المكونات؛ اضغط على كل مكون متوفر لديك لشطبه من القائمة، وعند الانتهاء اضغط على: إبدأ الطبخ.',
    cook_start_btn: 'ابدأ الطبخ',
    cook_step_of: (i, total) => `الخطوة ${i} من ${total}`,
    cook_prev: 'السابقة',
    cook_next: 'الخطوة التالية',
    cook_all_done: '✓ طبقك جاهز',
    cook_timer_min: 'دقيقة',
    cook_timer_start: 'ابدأ المؤقت',
    cook_timer_stop: 'إيقاف',
    cook_done_title: 'بالهناء والشفاء!',
    cook_done_sub: 'طبقك جاهز. استمتع بكل لقمة.',
    cook_done_btn: 'العودة للوصفات',

    time_min: 'د',

    cuisine_labels: {
      'Italian': 'إيطالي',
      'Middle Eastern':'مطبخ عربي',
      'Turkish': 'تركي',
      'Other': 'أخرى',
    },

    meal_type_labels: {
      'Dessert': 'حلويات',
      'Dinner': 'عشاء',
      'Side': 'طبق جانبي',
    },

    about_title: 'عن هذا المطبخ',
    about_script: 'نكهات من حول العالم ،ووصفات من القلب.. بلمسات تشبهنا',
    about_text: `هذا الموقع هو دفتر وصفاتي البسيط؛ بمثابة مذكرات طهي حيّة تجمع الأطباق التي تشكّل عالمي. ستجدون هنا مزيجاً من الوصفات العائلية المتوارثة والغالية على قلبي من أمي وجدتي، ووصفات تعلمتها خلال رحلاتي وسفري أو شاركني إياها أصدقائي.
كفتاة فلسطينية أردنية، أخذتني رحلة الحياة من الوطن العربي لأعيش في إسبانيا والمملكة المتحدة، وفي العام الماضي تزوجت وانتقلت إلى أستراليا لأبدأ فصلاً جديداً من حياتي. ومع الغربة، أصبح الطهي طريقتي الخاصة لاستحضار دفء ونكهات "البيت" أينما كنت. هذه المساحة هي احتفاء بتلك المغامرة بين أطباق تراثية أُعيد ابتكارها بحنين، وتجارب مستوحاة من تيك توك ويوتيوب تتأرجح بين النجاح والفشل، أخلط كل هذه النكهات بما تتيحه لي المكونات المحلية، لأصنع أطباقاً جديدة عروقها تنبض بدفء البيت.`,

    // PLACEHOLDER — replace with final teaser copy
    about_teaser_text: 'مجموعة صغيرة من أطباق مطبخي — فلسطينية وأردنية وإيطالية وكل ما التقطته على طول الطريق.',
    about_teaser_link: 'اقرأ المزيد',

    // PLACEHOLDER — replace with final section copy
    about_how_title: 'كيف أختار الوصفات',
    about_how_text: 'نص مؤقت — يُستبدل بنص عن طريقة اختيار الوصفات.',
    about_bilingual_title: 'لماذا العربية والإنجليزية؟',
    about_bilingual_text: 'نص مؤقت — يُستبدل بنص عن سبب دعم اللغتين.',
    about_contact_title: 'تواصلي',
    about_contact_text: 'نص مؤقت — بيانات التواصل هنا.',

    price_est_cost: 'التكلفة التقريبية',
    price_pantry: 'من مطبخك',
    price_shop: 'إلى التسوق',
    price_grocery_estimate: 'تقدير تكلفة المشتريات',
    price_total_est: 'المجموع التقريبي',
    price_last_checked: 'آخر تحديث للأسعار',
    price_no_data: 'التكلفة غير متوفرة',

    footer_made: 'صُنع بحب في أديلايد',

    loading: 'صبرك علينا',
  },
};

export default t;
