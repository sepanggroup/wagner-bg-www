export const STORE = {
  company: {
    name: 'КОЛМАН ЕООД',
    brand: 'WAGNER',
    email: 'kolmaneood@abv.bg',
    eik: '200736602',
    phone: '+359 88 579 66 13'
  },
  categories: [
    { id: 'airless', name: 'Airless боядисване', desc: 'Високоефективно нанасяне на бои, фасадни покрития и други материали.' },
    { id: 'xvlp', name: 'XVLP / HVLP', desc: 'Компактни системи за FineFinish, лакове, емайли и ремонтни задачи.' },
    { id: 'filler', name: 'Шпакловка и замазка', desc: 'Производителни решения за спрей шпакловка и тежки довършителни материали.' },
    { id: 'guns', name: 'Пистолети и дюзи', desc: 'Професионални пистолети, HEA и FineFinish дюзи и съвместими компоненти.' },
    { id: 'accessories', name: 'Аксесоари', desc: 'Маркучи, филтри, удължители, ролери и други компоненти за системите.' },
    { id: 'preparation', name: 'Подготовка', desc: 'Инструменти и решения за подготовка на повърхности преди нанасяне.' }
  ],
  products: [
    {
      id: 'superfinish-21-pro-hea',
      category: 'airless',
      name: 'SuperFinish 21 Pro HEA',
      eyebrow: 'WAGNER PROFESSIONAL · AIRLESS HEA',
      blurb: 'Компактна професионална диафрагмена помпа за дисперсии и латексови бои при средни по размер обекти.',
      priceKnown: true,
      price: 1477.63,
      priceNote: 'Пазарен ориентир; потвърди крайната цена с КОЛМАН ЕООД.',
      priceSource: 'Etools.bg',
      specs: ['Макс. дебит: 2,1 l/min', 'Макс. дюза: 0,021″', 'Работно налягане: 207 bar', 'Мотор: 0,9 kW'],
      sourceUrl: 'https://www.wagner-group.com/en/contractor/products-and-accessories/building-trade/'
    },
    {
      id: 'control-pro-350m',
      category: 'airless',
      name: 'Control Pro 350M',
      eyebrow: 'WAGNER · HEA AIRLESS',
      blurb: 'Бутална HEA система за боядисване с ниско налягане и контролирано разпрашаване.',
      priceKnown: true,
      price: 787.39,
      priceNote: 'Пазарен ориентир; потвърди крайната цена с КОЛМАН ЕООД.',
      priceSource: 'Etools.bg',
      specs: ['Мощност: 600 W', 'Дебит: 1,5 l/min', 'HEA технология', '15 m маркуч'],
      sourceUrl: 'https://etools.bg/product/5232/mashina-za-praskane-na-lateks-wagner-control-pro-350m-600-w-1-5-l-min.html'
    },
    {
      id: 'prospray-320-hea',
      category: 'airless',
      name: 'ProSpray 3.20 HEA',
      eyebrow: 'WAGNER PROFESSIONAL · AIRLESS',
      blurb: 'Професионална безвъздушна система за пръскане на бои с HEA технология.',
      priceKnown: true,
      price: 1687.26,
      priceNote: 'Пазарен ориентир; потвърди крайната цена с КОЛМАН ЕООД.',
      priceSource: 'Etools.bg',
      specs: ['Макс. налягане: 207 bar', 'Дебит: 1,6 l/min', '15 m маркуч', '230 V'],
      sourceUrl: 'https://etools.bg/product/39804/wagner-prospray-3-20-hea-profesionalna-bezvazdushna-mashina-za-praskane-na-boi-1000-w-2-l-min.html'
    },
    {
      id: 'control-pro-300-move',
      category: 'airless',
      name: 'Control Pro 300 Move',
      eyebrow: 'WAGNER · AIRLESS · 18 V',
      blurb: 'Мобилна акумулаторна безвъздушна система за боядисване, подходяща за ремонтни и средни задачи.',
      priceKnown: true,
      price: 843.12,
      priceNote: 'Пазарен ориентир; потвърди крайната цена с КОЛМАН ЕООД.',
      priceSource: 'Etools.bg',
      specs: ['18 V', 'Дебит: 0,9 l/min', 'Налягане: 110 bar', 'Резервоар: 4,7 l'],
      sourceUrl: 'https://www.etools.bg/category/3285/mashini-za-boyadisvane-wagner.html'
    },
    {
      id: 'finishcontrol-3500',
      category: 'xvlp',
      name: 'FinishControl 3500',
      eyebrow: 'WAGNER · XVLP',
      blurb: 'Компактна XVLP система за лакове, FineFinish, ремонтни задачи и малки проекти.',
      priceKnown: true,
      price: 506.18,
      priceNote: 'Пазарен ориентир; потвърди крайната цена с КОЛМАН ЕООД.',
      priceSource: 'Etools.bg',
      specs: ['700 W', '2,3 kg', '0,2 bar', 'До 50 m²'],
      sourceUrl: 'https://www.wagner-group.com/uk/contractor/products-and-accessories/product/finishcontrol-3500/'
    },
    {
      id: 'w180p',
      category: 'xvlp',
      name: 'WAGNER W180P',
      eyebrow: 'WAGNER · SPRAY SYSTEM',
      blurb: 'Компактно решение с аксесоари за боядисване при по-малки задачи и ремонтни работи.',
      priceKnown: true,
      price: 86.41,
      priceNote: 'Пазарен ориентир; потвърди крайната цена с КОЛМАН ЕООД.',
      priceSource: 'Etools.bg',
      specs: ['Мощност: 110 W', 'Контейнер: 800 ml', 'Комплект с аксесоари'],
      sourceUrl: 'https://www.etools.bg/brand/203/wagner.html'
    },
    {
      id: 'prospray-339-connect-filler',
      category: 'filler',
      name: 'ProSpray 3.39 Connect Filler',
      eyebrow: 'WAGNER PROFESSIONAL · CONNECT',
      blurb: 'Високопроизводителна piston-pump система за спрей шпакловка и големи строителни обекти.',
      priceKnown: false,
      price: null,
      priceNote: 'Цена при запитване.',
      priceSource: null,
      specs: ['Макс. дебит: 5,0 l/min', 'Макс. дюза: 0,039″', 'Мотор: 2,185 kW', 'Тегло: 50 kg'],
      sourceUrl: 'https://www.wagner-group.com/en/contractor/products-and-accessories/product/prospray-339-connect-filler/'
    },
    {
      id: 'superfinish-23-plus-hea',
      category: 'airless',
      name: 'SuperFinish 23 Plus HEA',
      eyebrow: 'WAGNER PROFESSIONAL · AIRLESS HEA',
      blurb: 'Компактна и здрава система за емулсионни и фасадни бои при средни строителни и ремонтни проекти.',
      priceKnown: false,
      price: null,
      priceNote: 'Цена при запитване.',
      priceSource: null,
      specs: ['Макс. дебит: 2,6 l/min', 'Макс. дюза: 0,023″', 'Макс. налягане: 250 bar', 'Мотор: 1,3 kW'],
      sourceUrl: 'https://www.wagner-group.com/uk/contractor/products-and-accessories/product/superfinish-23-plus-hea-spraypack/'
    },
    {
      id: 'wagner-vector-pro',
      category: 'guns',
      name: 'WAGNER професионален airless пистолет',
      eyebrow: 'WAGNER · AIRLESS GUN',
      blurb: 'Професионален пистолет за airless системи; точната конфигурация се определя според дюзата и приложението.',
      priceKnown: true,
      price: 101.75,
      priceNote: 'Пазарен ориентир; потвърди крайната цена с КОЛМАН ЕООД.',
      priceSource: 'Etools.bg',
      specs: ['Модел: Control 150M 2399788', 'Професионално изпълнение', 'Съвместимост според системата'],
      sourceUrl: 'https://www.etools.bg/category/3284/boyadzhiyski-pistoletti-wagner.html'
    }
  ]
};

export const getCategory = (id) => STORE.categories.find((item) => item.id === id);
export const getProduct = (id) => STORE.products.find((item) => item.id === id);
