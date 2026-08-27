export const STORE = {
  company: {
    name: 'КОЛМАН ЕООД',
    brand: 'WAGNER',
    email: 'kolmaneood@abv.bg',
    eik: '200736602',
    phone: '+359 88 579 66 13'
  },
  categories: [
    { id: 'airless', name: 'Безвъздушно боядисване', desc: 'Airless решения за професионално нанасяне на покрития.' },
    { id: 'hvlp', name: 'HVLP системи', desc: 'Компактни системи за боядисване и довършителни работи.' },
    { id: 'guns', name: 'Пистолети и дюзи', desc: 'Пистолети, дюзи и компоненти за контролирано нанасяне.' },
    { id: 'finishing', name: 'Шпакловка и замазка', desc: 'Оборудване за довършителни материали и професионални приложения.' },
    { id: 'heat', name: 'Горещ въздух', desc: 'Професионални инструменти за работа с горещ въздух.' },
    { id: 'accessories', name: 'Аксесоари и консумативи', desc: 'Маркучи, филтри, дюзи и други компоненти.' }
  ],
  products: [
    { id: 'wagner-airless-pro', category: 'airless', name: 'Професионална WAGNER Airless система', eyebrow: 'WAGNER PROFESSIONAL', blurb: 'За професионално боядисване с висока производителност. Подходящата конфигурация се определя според материала и задачата.', priceKnown: false, price: null },
    { id: 'wagner-hvlp-system', category: 'hvlp', name: 'WAGNER HVLP система за боядисване', eyebrow: 'WAGNER SPRAY', blurb: 'Компактно решение за боядисване и довършителни работи. Конкретният модел се избира според приложението.', priceKnown: false, price: null },
    { id: 'wagner-spray-gun', category: 'guns', name: 'WAGNER професионален пистолет за боядисване', eyebrow: 'SPRAY GUN', blurb: 'Прецизен компонент за различни системи за нанасяне. Изпълнението и съвместимостта се потвърждават при запитване.', priceKnown: false, price: null },
    { id: 'wagner-finishing', category: 'finishing', name: 'WAGNER система за шпакловка и замазка', eyebrow: 'FINISHING', blurb: 'Оборудване за довършителни материали и професионални строителни приложения.', priceKnown: false, price: null },
    { id: 'wagner-heat-gun', category: 'heat', name: 'WAGNER пистолет за горещ въздух', eyebrow: 'HOT AIR', blurb: 'Инструменти за работа с горещ въздух в строителни и ремонтни приложения.', priceKnown: false, price: null },
    { id: 'wagner-accessories', category: 'accessories', name: 'WAGNER аксесоари и консумативи', eyebrow: 'ACCESSORIES', blurb: 'Дюзи, маркучи, пистолети, филтри и други компоненти за поддръжка и работа.', priceKnown: false, price: null }
  ]
};

export const getCategory = (id) => STORE.categories.find((item) => item.id === id);
export const getProduct = (id) => STORE.products.find((item) => item.id === id);
