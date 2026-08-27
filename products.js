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
      priceKnown: false,
      price: null,
      specs: ['Макс. дебит: 2,1 l/min', 'Макс. дюза: 0,021″', 'Работно налягане: 207 bar', 'Мотор: 0,9 kW'],
      sourceUrl: 'https://www.wagner-group.com/en/contractor/products-and-accessories/building-trade/'
    },
    {
      id: 'finishcontrol-3500',
      category: 'xvlp',
      name: 'FinishControl 3500',
      eyebrow: 'WAGNER · XVLP',
      blurb: 'Компактна XVLP система за лакове, FineFinish, ремонтни задачи и малки проекти.',
      priceKnown: false,
      price: null,
      specs: ['700 W', '2,3 kg', '0,2 bar', 'До 50 m²'],
      sourceUrl: 'https://www.wagner-group.com/uk/contractor/products-and-accessories/product/finishcontrol-3500/'
    },
    {
      id: 'prospray-339-connect-filler',
      category: 'filler',
      name: 'ProSpray 3.39 Connect Filler',
      eyebrow: 'WAGNER PROFESSIONAL · CONNECT',
      blurb: 'Високопроизводителна piston-pump система за спрей шпакловка и големи строителни обекти.',
      priceKnown: false,
      price: null,
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
      specs: ['Макс. дебит: 2,6 l/min', 'Макс. дюза: 0,023″', 'Макс. налягане: 250 bar', 'Мотор: 1,3 kW'],
      sourceUrl: 'https://www.wagner-group.com/uk/contractor/products-and-accessories/product/superfinish-23-plus-hea-spraypack/'
    },
    {
      id: 'wagner-vector-pro',
      category: 'guns',
      name: 'WAGNER Vector Pro',
      eyebrow: 'WAGNER · AIRLESS GUN',
      blurb: 'Професионален airless пистолет; точната конфигурация се определя според дюзата и приложението.',
      priceKnown: false,
      price: null,
      specs: ['1/4″ връзка', 'Съвместим с TradeTip 3', '2- и 4-пръстов спусък според изпълнението'],
      sourceUrl: 'https://www.wagner-group.com/en/contractor/products-and-accessories/'
    },
    {
      id: 'wagner-accessories',
      category: 'accessories',
      name: 'WAGNER аксесоари и консумативи',
      eyebrow: 'WAGNER · ACCESSORIES',
      blurb: 'Дюзи, маркучи, филтри, удължители и други компоненти за поддръжка и работа.',
      priceKnown: false,
      price: null,
      specs: ['Избор според машина', 'Избор според материал', 'Потвърждение на съвместимостта при запитване'],
      sourceUrl: 'https://www.wagner-group.com/en/contractor/products-and-accessories/'
    }
  ]
};

export const getCategory = (id) => STORE.categories.find((item) => item.id === id);
export const getProduct = (id) => STORE.products.find((item) => item.id === id);
