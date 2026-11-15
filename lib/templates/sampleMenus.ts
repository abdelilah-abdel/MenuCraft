import { MenuItem, MenuLanguage, MenuSection, TemplateType } from '../types/menu';

type Copy = { en: string; fr: string; ar: string };
type SampleItem = { name: Copy; description: Copy; price: number; image: string; tags?: Copy[] };
type SampleSubsection = { name: Copy; description?: Copy; items: SampleItem[] };
type SampleSection = { name: Copy; description: Copy; subsections: SampleSubsection[] };

type MoroccanTemplateType = Extract<TemplateType, 'medina-cafe' | 'moroccan-fine-dining' | 'modern-moroccan-garden'>;

const photos = {
  tagine: 'https://images.unsplash.com/photo-1572282981354-f371f859a22a?auto=format&fit=crop&w=900&q=80',
  couscous: 'https://images.unsplash.com/photo-1739217744880-472f59559cc5?auto=format&fit=crop&w=900&q=80',
  tea: 'https://images.unsplash.com/photo-1591299089616-c9604047b1a6?auto=format&fit=crop&w=900&q=80',
  table: 'https://images.unsplash.com/photo-1517314597476-e1788060b6cb?auto=format&fit=crop&w=900&q=80',
};

const copy = (en: string, fr: string, ar: string): Copy => ({ en, fr, ar });

const sampleMenus: Record<MoroccanTemplateType, SampleSection[]> = {
  'medina-cafe': [
    {
      name: copy('Breakfast & Tea Time', 'Petit déjeuner & goûter', 'الفطور والشاي'),
      description: copy('A slow start with warm Moroccan breads and fresh mint tea.', 'Un réveil gourmand autour des pains marocains et du thé à la menthe.', 'بداية هادئة مع الخبز المغربي والشاي بالنعناع.'),
      subsections: [
        {
          name: copy('From the griddle', 'Crêpes marocaines', 'من المقلاة'),
          items: [
            { name: copy('Msemen & honey', 'Msemen au miel', 'مسمن بالعسل'), description: copy('Flaky folded pancakes served warm with local honey.', 'Crêpes feuilletées servies chaudes avec du miel local.', 'مسمن مورق يقدم دافئاً مع العسل المحلي.'), price: 35, image: photos.table },
            { name: copy('Baghrir & amlou', 'Baghrir et amlou', 'بغرير وأملو'), description: copy('Soft semolina pancakes with almond and argan spread.', 'Crêpes légères de semoule avec amlou aux amandes et à l’argan.', 'بغرير طري مع أملو اللوز وزيت الأركان.'), price: 40, image: photos.couscous },
          ],
        },
        {
          name: copy('Tea & coffee', 'Thés & cafés', 'الشاي والقهوة'),
          items: [
            { name: copy('Moroccan mint tea', 'Thé marocain à la menthe', 'أتاي مغربي بالنعناع'), description: copy('Green tea, fresh mint, and a little sweetness.', 'Thé vert, menthe fraîche et une touche de douceur.', 'شاي أخضر ونعناع طازج ولمسة من الحلاوة.'), price: 25, image: photos.tea },
          ],
        },
      ],
    },
    {
      name: copy('The Moroccan Table', 'La table marocaine', 'المائدة المغربية'),
      description: copy('Slow-cooked favorites, served with the generosity of home.', 'Les plats mijotés préférés, servis avec la générosité de la maison.', 'أطباق محضرة على مهل وتقدم بكرم الضيافة المغربية.'),
      subsections: [
        {
          name: copy('Tagines', 'Tajines', 'طواجن'),
          items: [
            { name: copy('Chicken, preserved lemon & olives', 'Poulet au citron confit et olives', 'طاجين الدجاج بالليمون المصير والزيتون'), description: copy('Tender chicken with saffron, preserved lemon, and green olives.', 'Poulet tendre au safran, citron confit et olives vertes.', 'دجاج طري بالزعفران والليمون المصير والزيتون الأخضر.'), price: 95, image: photos.tagine },
            { name: copy('Garden vegetable tagine', 'Tajine de légumes du jardin', 'طاجين خضار الحديقة'), description: copy('Seasonal vegetables with warm spices and fresh herbs.', 'Légumes de saison, épices douces et herbes fraîches.', 'خضار موسمية مع توابل دافئة وأعشاب طازجة.'), price: 80, image: photos.couscous, tags: [copy('Vegetarian', 'Végétarien', 'نباتي')] },
          ],
        },
        {
          name: copy('Couscous', 'Couscous', 'كسكس'),
          items: [
            { name: copy('Seven-vegetable couscous', 'Couscous aux sept légumes', 'كسكس بسبع خضار'), description: copy('Steamed semolina, seasonal vegetables, and fragrant broth.', 'Semoule vapeur, légumes de saison et bouillon parfumé.', 'سميد مفور وخضار موسمية ومرق معطر.'), price: 90, image: photos.couscous },
          ],
        },
      ],
    },
    {
      name: copy('Sweets & Sips', 'Douceurs & boissons', 'حلويات ومشروبات'),
      description: copy('A little something sweet, with tea or fresh juice.', 'Une note sucrée, accompagnée de thé ou de jus frais.', 'لمسة حلوة مع الشاي أو العصير الطازج.'),
      subsections: [
        {
          name: copy('House favorites', 'Les douceurs de la maison', 'حلويات الدار'),
          items: [
            { name: copy('Orange & cinnamon salad', 'Salade d’oranges à la cannelle', 'سلطة البرتقال بالقرفة'), description: copy('Fresh orange slices, cinnamon, and orange blossom.', 'Oranges fraîches, cannelle et eau de fleur d’oranger.', 'شرائح برتقال طازجة مع القرفة وماء الزهر.'), price: 35, image: photos.table },
            { name: copy('Fresh orange juice', 'Jus d’orange frais', 'عصير البرتقال الطازج'), description: copy('Pressed to order.', 'Pressé à la commande.', 'يعصر عند الطلب.'), price: 30, image: photos.tea },
          ],
        },
      ],
    },
  ],
  'moroccan-fine-dining': [
    {
      name: copy('Opening Courses', 'Pour commencer', 'أطباق البداية'),
      description: copy('Small plates inspired by Moroccan market tables.', 'Des assiettes inspirées des tables de marché marocaines.', 'أطباق صغيرة مستوحاة من موائد الأسواق المغربية.'),
      subsections: [
        {
          name: copy('Soups & salads', 'Soupes & salades', 'الشوربات والسلطات'),
          items: [
            { name: copy('Harira of the house', 'Harira de la maison', 'حريرة الدار'), description: copy('Tomato, lentils, chickpeas, herbs, and warming spices.', 'Tomate, lentilles, pois chiches, herbes et épices douces.', 'طماطم وعدس وحمص وأعشاب وتوابل دافئة.'), price: 55, image: photos.table },
            { name: copy('Seven Moroccan salads', 'Assortiment de salades marocaines', 'تشكيلة سلطات مغربية'), description: copy('A colorful selection of seasonal salads and dips.', 'Un assortiment coloré de salades et de préparations de saison.', 'تشكيلة ملونة من سلطات ومقبلات موسمية.'), price: 75, image: photos.couscous, tags: [copy('Vegetarian', 'Végétarien', 'نباتي')] },
          ],
        },
        {
          name: copy('Pastry & sharing', 'Feuilletés à partager', 'فطائر للمشاركة'),
          items: [
            { name: copy('Briouates selection', 'Assortiment de briouates', 'تشكيلة بريوات'), description: copy('Crisp pastry parcels with a savory seasonal filling.', 'Feuilletés croustillants garnis selon la saison.', 'فطائر مقرمشة بحشوة مالحة موسمية.'), price: 65, image: photos.tagine },
          ],
        },
      ],
    },
    {
      name: copy('From the Kitchen', 'À la table', 'من المطبخ'),
      description: copy('Traditional recipes presented with a contemporary touch.', 'Des recettes traditionnelles présentées avec une touche contemporaine.', 'وصفات تقليدية بلمسة معاصرة.'),
      subsections: [
        {
          name: copy('Tagines & couscous', 'Tajines & couscous', 'طواجن وكسكس'),
          items: [
            { name: copy('Lamb, apricot & almond tagine', 'Tajine d’agneau aux abricots et amandes', 'طاجين لحم الغنم بالمشمش واللوز'), description: copy('Slow-braised lamb, dried apricots, toasted almonds, and garden herbs.', 'Agneau mijoté, abricots secs, amandes torréfiées et herbes du jardin.', 'لحم غنم مطهو ببطء مع مشمش مجفف ولوز محمص وأعشاب الحديقة.'), price: 145, image: photos.tagine },
            { name: copy('Couscous with seven vegetables', 'Couscous aux sept légumes', 'كسكس بسبع خضار'), description: copy('Hand-steamed semolina, seasonal vegetables, and a delicate broth.', 'Semoule travaillée à la main, légumes de saison et bouillon délicat.', 'سميد مفور يدوياً وخضار موسمية ومرق خفيف.'), price: 125, image: photos.couscous },
          ],
        },
      ],
    },
    {
      name: copy('The Sweet Ending', 'Pour finir en douceur', 'ختام حلو'),
      description: copy('A final note of citrus, honey, and orange blossom.', 'Une dernière note d’agrumes, de miel et de fleur d’oranger.', 'لمسة أخيرة من الحمضيات والعسل وماء الزهر.'),
      subsections: [
        {
          name: copy('Desserts', 'Desserts', 'حلويات'),
          items: [
            { name: copy('Milk pastilla', 'Pastilla au lait', 'بسطيلة بالحليب'), description: copy('Crisp pastry, orange blossom cream, and caramelized almonds.', 'Feuilletage croustillant, crème à la fleur d’oranger et amandes caramélisées.', 'عجين مقرمش وكريمة ماء الزهر ولوز مكرمل.'), price: 50, image: photos.table },
            { name: copy('Mint tea service', 'Service de thé à la menthe', 'جلسة أتاي بالنعناع'), description: copy('Fresh mint tea served at the table.', 'Thé à la menthe fraîche servi à table.', 'شاي بالنعناع الطازج يقدم على المائدة.'), price: 30, image: photos.tea },
          ],
        },
      ],
    },
  ],
  'modern-moroccan-garden': [
    {
      name: copy('Fresh from the Garden', 'Fraîcheur du jardin', 'طازج من الحديقة'),
      description: copy('Bright salads and small plates for sharing.', 'Des salades fraîches et des assiettes à partager.', 'سلطات طازجة وأطباق للمشاركة.'),
      subsections: [
        {
          name: copy('Salads & mezze', 'Salades & mezzés', 'سلطات ومقبلات'),
          items: [
            { name: copy('Carrot, orange & toasted almond salad', 'Salade de carottes, orange et amandes', 'سلطة الجزر والبرتقال واللوز'), description: copy('Fresh herbs, citrus dressing, and toasted almonds.', 'Herbes fraîches, vinaigrette aux agrumes et amandes grillées.', 'أعشاب طازجة وصلصة حمضيات ولوز محمص.'), price: 55, image: photos.couscous, tags: [copy('Vegetarian', 'Végétarien', 'نباتي')] },
            { name: copy('Warm zaalouk & flatbread', 'Zaalouk tiède et pain maison', 'زعلوك دافئ وخبز الدار'), description: copy('Smoky aubergine, tomato, coriander, and warm bread.', 'Aubergine fumée, tomate, coriandre et pain chaud.', 'باذنجان مدخن وطماطم وقزبر وخبز دافئ.'), price: 45, image: photos.table },
          ],
        },
      ],
    },
    {
      name: copy('Fire & Clay', 'Feu & terre', 'النار والطين'),
      description: copy('Charcoal-grilled favorites and slow-cooked tagines.', 'Des grillades au charbon et des tajines mijotés.', 'مشاوي على الفحم وطواجن مطهوة على مهل.'),
      subsections: [
        {
          name: copy('Grill & tagine', 'Grillades & tajines', 'مشاوي وطواجن'),
          items: [
            { name: copy('Charcoal kefta skewers', 'Brochettes de kefta au charbon', 'أسياخ كفتة على الفحم'), description: copy('Herbed beef kefta with grilled peppers and house chermoula.', 'Kefta de bœuf aux herbes, poivrons grillés et chermoula maison.', 'كفتة لحم بالأعشاب مع فلفل مشوي وشرمولة الدار.'), price: 95, image: photos.tagine },
            { name: copy('Vegetable couscous bowl', 'Bol de couscous aux légumes', 'وعاء كسكس بالخضار'), description: copy('Seven seasonal vegetables, steamed semolina, and fragrant broth.', 'Sept légumes de saison, semoule vapeur et bouillon parfumé.', 'سبع خضار موسمية وسميد مفور ومرق معطر.'), price: 85, image: photos.couscous, tags: [copy('Vegetarian', 'Végétarien', 'نباتي')] },
          ],
        },
      ],
    },
    {
      name: copy('Cool Down', 'Fraîcheur & douceur', 'انتعاش وحلاوة'),
      description: copy('Freshly pressed drinks and simple desserts.', 'Des boissons fraîches et des desserts tout en simplicité.', 'مشروبات طازجة وحلويات بسيطة.'),
      subsections: [
        {
          name: copy('Drinks & dessert', 'Boissons & dessert', 'مشروبات وحلويات'),
          items: [
            { name: copy('Mint lemonade', 'Citronnade à la menthe', 'ليمونادة بالنعناع'), description: copy('Lemon, fresh mint, and a touch of orange blossom.', 'Citron, menthe fraîche et une touche de fleur d’oranger.', 'ليمون ونعناع طازج ولمسة من ماء الزهر.'), price: 30, image: photos.tea },
            { name: copy('Seasonal fruit plate', 'Assiette de fruits de saison', 'طبق فواكه موسمية'), description: copy('Fresh local fruit with a little honey.', 'Fruits locaux frais et une touche de miel.', 'فواكه محلية طازجة مع القليل من العسل.'), price: 40, image: photos.table },
          ],
        },
      ],
    },
  ],
};

function localized(value: Copy, language: MenuLanguage): string {
  return value[language];
}

export function createSampleMenuSections(template: MoroccanTemplateType, language: MenuLanguage): MenuSection[] {
  let itemIndex = 0;

  return sampleMenus[template].map((section, sectionIndex) => {
    const subsections = section.subsections.map((subsection, subsectionIndex) => ({
      id: `sample-${template}-subsection-${sectionIndex}-${subsectionIndex}`,
      name: localized(subsection.name, language),
      description: subsection.description ? localized(subsection.description, language) : undefined,
      order: subsectionIndex,
    }));

    const items: MenuItem[] = section.subsections.flatMap((subsection, subsectionIndex) => subsection.items.map((item) => {
      itemIndex += 1;
      return {
        id: `sample-${template}-item-${itemIndex}`,
        name: localized(item.name, language),
        description: localized(item.description, language),
        price: item.price,
        currency: 'MAD',
        image: item.image,
        subsectionId: `sample-${template}-subsection-${sectionIndex}-${subsectionIndex}`,
        tags: [localized(copy('Example', 'Exemple', 'مثال'), language), ...(item.tags || []).map((tag) => localized(tag, language))],
        available: true,
      };
    }));

    return {
      id: `sample-${template}-section-${sectionIndex}`,
      name: localized(section.name, language),
      description: localized(section.description, language),
      items,
      subsections,
      order: sectionIndex,
    };
  });
}
